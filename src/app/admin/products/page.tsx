"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Edit2, X, Save, Plus, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const CATEGORIES = [
  { id: "hot-items", name: "Hot Items" },
  { id: "sweet-items", name: "Sweet Items" },
  { id: "podis-and-powders", name: "Podis & Powders" },
  { id: "pickles", name: "Pickles" },
  { id: "fryums", name: "Fryums" },
];

interface Product {
  id: number;
  name: string;
  name_english: string;
  category: string;
  description: string;
  price: number;
  price_unit: string;
  mrp?: number;
  quantity_prices: { quantity: string; price: number; mrp?: number }[];
  image: string;
  images: string[];
  badge?: string;
  popular: boolean;
  spice_level: number;
  shelf_life: string;
  serves: string;
  ingredients: string[];
  nutrition: { calories: string; protein: string; carbs: string; fat: string; fiber: string };
  tags: string[];
  reviews: { name: string; rating: number; comment: string; date: string }[];
  coupon_applicable?: boolean;
}

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  name_english: "",
  category: "hot-items",
  description: "",
  price: 0,
  price_unit: "500g",
  mrp: 0,
  quantity_prices: [],
  image: "",
  images: [],
  badge: "",
  popular: false,
  spice_level: 0,
  shelf_life: "",
  serves: "",
  ingredients: [],
  nutrition: { calories: "", protein: "", carbs: "", fat: "", fiber: "" },
  tags: [],
  reviews: [],
  coupon_applicable: true,
};

export default function AdminProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, "id"> | Product>(emptyProduct);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/products`);
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load products", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter((p) => {
    const matchCat = cat === "all" || p.category === cat;
    const matchSearch = !search || p.name_english.toLowerCase().includes(search.toLowerCase()) || p.name.includes(search);
    return matchCat && matchSearch;
  });

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setFormData({ ...product });
    setIsNew(false);
  };

  const handleAdd = () => {
    setEditProduct({} as Product);
    setFormData(emptyProduct);
    setIsNew(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("snackzee_token");
    if (!token) return;
    setSaving(true);
    try {
      const url = isNew ? `${BACKEND_URL}/products` : `${BACKEND_URL}/products/${(editProduct as Product).id}`;
      const method = isNew ? "POST" : "PUT";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save");
      const saved = await res.json();
      const productId = saved.product?.id || (editProduct as Product).id;

      // Save reviews separately
      await fetch(`${BACKEND_URL}/products/${productId}/reviews`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reviews: formData.reviews || [] }),
      });

      toast({ title: "Success", description: `Product ${isNew ? "added" : "updated"} successfully` });
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      toast({ title: "Error", description: "Failed to save product", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    const token = localStorage.getItem("snackzee_token");
    try {
      await fetch(`${BACKEND_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: "Deleted", description: "Product deleted successfully" });
      fetchProducts();
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const addQuantityPrice = () => {
    handleChange("quantity_prices", [...formData.quantity_prices, { quantity: "", price: 0, mrp: 0 }]);
  };

  const updateQuantityPrice = (index: number, field: string, value: any) => {
    const updated = [...formData.quantity_prices];
    updated[index] = { ...updated[index], [field]: value };
    handleChange("quantity_prices", updated);
  };

  const removeQuantityPrice = (index: number) => {
    handleChange("quantity_prices", formData.quantity_prices.filter((_, i) => i !== index));
  };

  const addIngredient = () => {
    handleChange("ingredients", [...formData.ingredients, ""]);
  };

  const updateIngredient = (index: number, value: string) => {
    const updated = [...formData.ingredients];
    updated[index] = value;
    handleChange("ingredients", updated);
  };

  const removeIngredient = (index: number) => {
    handleChange("ingredients", formData.ingredients.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadToCloudinary(file, "snackzee/products");
      handleChange("image", url);
      toast({ title: "Image uploaded ✅" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleMultipleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploads = await Promise.all(Array.from(files).map((f) => uploadToCloudinary(f, "snackzee/products")));
      const urls = uploads.map((u) => u.url);
      handleChange("images", [...formData.images, ...urls]);
      toast({ title: `${urls.length} images uploaded ✅` });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    handleChange("images", formData.images.filter((_, i) => i !== index));
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-terracotta/20 border-t-terracotta rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brown">Products</h1>
        <button onClick={handleAdd}
          className="flex items-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white px-4 py-2.5 rounded-xl font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light/40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-terracotta/10 text-brown font-sans text-sm focus:outline-none focus:border-terracotta/30 sm:w-56" />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-terracotta/10 text-brown font-sans text-sm focus:outline-none">
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((product, i) => (
          <motion.div key={`${product.id}:${product.name_english || product.name}:${i}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="bg-white rounded-2xl border border-terracotta/10 overflow-hidden">
            <div className="relative aspect-video bg-cream-dark">
              {product.image ? (
                <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brown-light/30">No Image</div>
              )}
              {product.badge && (
                <span className="absolute top-2 left-2 bg-terracotta text-white text-[9px] font-bold font-sans px-2 py-0.5 rounded-full">{product.badge}</span>
              )}
              {product.coupon_applicable !== false ? (
                <span className="absolute bottom-2 left-2 bg-green-600 text-white text-[9px] font-bold font-sans px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  🎟️ Coupon Eligible
                </span>
              ) : (
                <span className="absolute bottom-2 left-2 bg-red-500/80 text-white text-[9px] font-bold font-sans px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  🚫 No Coupon
                </span>
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                <button onClick={() => handleEdit(product)}
                  className="bg-white/90 hover:bg-white text-terracotta p-2 rounded-full shadow-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(product.id)}
                  className="bg-white/90 hover:bg-white text-red-500 p-2 rounded-full shadow-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1 min-w-0">
                  <p className="font-serif font-bold text-brown truncate">{product.name}</p>
                  <p className="text-brown-light/50 text-xs font-sans truncate">{product.name_english}</p>
                </div>
                <span className="font-serif font-bold text-gold text-lg ml-2 flex-shrink-0">₹{product.price}</span>
              </div>
              <p className="text-brown-light/50 text-[10px] font-sans mb-2 line-clamp-2">{product.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-4xl my-8">
            <div className="sticky top-0 bg-white border-b border-terracotta/10 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="font-serif text-xl font-bold text-brown">{isNew ? "Add" : "Edit"} Product</h2>
              <button onClick={() => setEditProduct(null)} className="text-brown-light/50 hover:text-brown">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Basic Info */}
              <div>
                <h3 className="font-sans font-bold text-brown mb-3">Basic Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-sans font-semibold text-brown-light/70 mb-1 block">Name (English)</label>
                    <input value={formData.name} onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none focus:border-terracotta/30" />
                  </div>
                  <div>
                    <label className="text-xs font-sans font-semibold text-brown-light/70 mb-1 block">Name (Telugu)</label>
                    <input value={formData.name_english} onChange={(e) => handleChange("name_english", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none focus:border-terracotta/30" />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-sans font-semibold text-brown-light/70 mb-1 block">Description</label>
                  <textarea value={formData.description} onChange={(e) => handleChange("description", e.target.value)} rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none focus:border-terracotta/30" />
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="text-xs font-sans font-semibold text-brown-light/70 mb-1 block">Category</label>
                    <select value={formData.category} onChange={(e) => handleChange("category", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none">
                      {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-sans font-semibold text-brown-light/70 mb-1 block">Badge</label>
                    <input value={formData.badge || ""} onChange={(e) => handleChange("badge", e.target.value)} placeholder="e.g. Bestseller"
                      className="w-full px-3 py-2 rounded-lg bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none focus:border-terracotta/30" />
                  </div>
                  <div>
                    <label className="text-xs font-sans font-semibold text-brown-light/70 mb-1 block">Spice Level</label>
                    <select value={formData.spice_level} onChange={(e) => handleChange("spice_level", Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none">
                      <option value={0}>😊 No Spice</option>
                      <option value={1}>🌶️ Mild</option>
                      <option value={2}>🌶️🌶️ Medium</option>
                      <option value={3}>🌶️🌶️🌶️ Hot</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="font-sans font-bold text-brown mb-3">Pricing</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-sans font-semibold text-brown-light/70 mb-1 block">Our Price</label>
                    <input type="number" value={formData.price} onChange={(e) => handleChange("price", Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none focus:border-terracotta/30" />
                  </div>
                  <div>
                    <label className="text-xs font-sans font-semibold text-brown-light/70 mb-1 block">MRP</label>
                    <input type="number" value={formData.mrp || ""} onChange={(e) => handleChange("mrp", Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none focus:border-terracotta/30" />
                  </div>
                  <div>
                    <label className="text-xs font-sans font-semibold text-brown-light/70 mb-1 block">Price Unit</label>
                    <input value={formData.price_unit} onChange={(e) => handleChange("price_unit", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none focus:border-terracotta/30" />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 bg-cream p-3 rounded-xl border border-terracotta/10">
                  <input
                    type="checkbox"
                    id="coupon_applicable"
                    checked={formData.coupon_applicable ?? true}
                    onChange={(e) => handleChange("coupon_applicable", e.target.checked)}
                    className="w-4 h-4 text-terracotta border-terracotta/20 rounded focus:ring-terracotta cursor-pointer"
                  />
                  <label htmlFor="coupon_applicable" className="text-sm font-sans font-semibold text-brown select-none cursor-pointer">
                    Available for Coupon Discount
                  </label>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-sans font-semibold text-brown-light/70">Quantity-wise Pricing</label>
                    <button onClick={addQuantityPrice} className="text-xs text-terracotta hover:text-terracotta-dark font-semibold">+ Add</button>
                  </div>
                  {formData.quantity_prices.map((qp, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input value={qp.quantity} onChange={(e) => updateQuantityPrice(i, "quantity", e.target.value)} placeholder="e.g. 250g"
                        className="flex-1 px-3 py-2 rounded-lg bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none" />
                      <input type="number" value={qp.price} onChange={(e) => updateQuantityPrice(i, "price", Number(e.target.value))} placeholder="Price"
                        className="w-24 px-3 py-2 rounded-lg bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none" />
                      <input type="number" value={qp.mrp || ""} onChange={(e) => updateQuantityPrice(i, "mrp", Number(e.target.value))} placeholder="MRP"
                        className="w-24 px-3 py-2 rounded-lg bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none" />
                      <button onClick={() => removeQuantityPrice(i)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <h3 className="font-sans font-bold text-brown mb-3">Images</h3>
                
                {/* Main Image */}
                <div className="mb-4">
                  <label className="text-xs font-sans font-semibold text-brown-light/70 mb-2 block">Main Image</label>
                  {formData.image && (
                    <div className="relative w-full h-48 mb-2 rounded-lg overflow-hidden border border-terracotta/10">
                      <Image src={formData.image} alt="Main" fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                      id="main-image-upload"
                    />
                    <label
                      htmlFor="main-image-upload"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-terracotta/10 hover:bg-terracotta/20 text-terracotta rounded-lg font-semibold text-sm cursor-pointer transition-colors disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      {uploading ? "Uploading..." : "Upload Main Image"}
                    </label>
                    {formData.image && (
                      <input
                        value={formData.image}
                        onChange={(e) => handleChange("image", e.target.value)}
                        placeholder="Or paste URL"
                        className="flex-1 px-3 py-2 rounded-lg bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none"
                      />
                    )}
                  </div>
                </div>

                {/* Additional Images */}
                <div>
                  <label className="text-xs font-sans font-semibold text-brown-light/70 mb-2 block">Additional Images</label>
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      {formData.images.map((img, i) => (
                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-terracotta/10 group">
                          <Image src={img} alt={`Image ${i + 1}`} fill className="object-cover" />
                          <button
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleImagesUpload}
                    disabled={uploading}
                    className="hidden"
                    id="multiple-images-upload"
                  />
                  <label
                    htmlFor="multiple-images-upload"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-cream hover:bg-cream-dark border border-terracotta/10 text-brown rounded-lg font-semibold text-sm cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    {uploading ? "Uploading..." : "Upload Additional Images"}
                  </label>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-sans font-bold text-brown">Ingredients</h3>
                  <button onClick={addIngredient} className="text-xs text-terracotta hover:text-terracotta-dark font-semibold">+ Add</button>
                </div>
                {formData.ingredients.map((ing, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={ing} onChange={(e) => updateIngredient(i, e.target.value)} placeholder="Ingredient name"
                      className="flex-1 px-3 py-2 rounded-lg bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none" />
                    <button onClick={() => removeIngredient(i)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Nutrition */}
              <div>
                <h3 className="font-sans font-bold text-brown mb-3">Nutrition (per 100g)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {["calories", "protein", "carbs", "fat", "fiber"].map((key) => (
                    <div key={key}>
                      <label className="text-xs font-sans text-brown-light/50 mb-1 block capitalize">{key}</label>
                      <input value={formData.nutrition[key as keyof typeof formData.nutrition]}
                        onChange={(e) => handleChange("nutrition", { ...formData.nutrition, [key]: e.target.value })}
                        className="w-full px-2 py-1.5 rounded-lg bg-cream border border-terracotta/10 text-brown font-sans text-xs focus:outline-none" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Details */}
              <div>
                <h3 className="font-sans font-bold text-brown mb-3">Other Details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-sans font-semibold text-brown-light/70 mb-1 block">Shelf Life</label>
                    <input value={formData.shelf_life} onChange={(e) => handleChange("shelf_life", e.target.value)} placeholder="e.g. 30 days"
                      className="w-full px-3 py-2 rounded-lg bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-sans font-semibold text-brown-light/70 mb-1 block">Serves</label>
                    <input value={formData.serves} onChange={(e) => handleChange("serves", e.target.value)} placeholder="e.g. 2-3 people"
                      className="w-full px-3 py-2 rounded-lg bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="px-6 pb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-sans font-semibold text-brown text-sm">Customer Reviews</h3>
                <button onClick={() => handleChange("reviews", [...(formData.reviews || []), { name: "", rating: 5, comment: "", date: new Date().toISOString().split("T")[0] }])}
                  className="flex items-center gap-1 text-xs text-terracotta font-sans font-semibold hover:underline">
                  <Plus className="w-3 h-3" /> Add Review
                </button>
              </div>
              <div className="space-y-3">
                {(formData.reviews || []).map((review, i) => (
                  <div key={i} className="bg-cream rounded-xl p-3 space-y-2">
                    <div className="flex gap-2">
                      <input value={review.name} onChange={(e) => { const r = [...formData.reviews]; r[i] = { ...r[i], name: e.target.value }; handleChange("reviews", r); }}
                        placeholder="Customer name" className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-terracotta/10 text-brown font-sans text-xs focus:outline-none" />
                      <select value={review.rating} onChange={(e) => { const r = [...formData.reviews]; r[i] = { ...r[i], rating: Number(e.target.value) }; handleChange("reviews", r); }}
                        className="px-2 py-1.5 rounded-lg bg-white border border-terracotta/10 text-brown font-sans text-xs focus:outline-none">
                        {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ⭐</option>)}
                      </select>
                      <input type="date" value={review.date} onChange={(e) => { const r = [...formData.reviews]; r[i] = { ...r[i], date: e.target.value }; handleChange("reviews", r); }}
                        className="px-2 py-1.5 rounded-lg bg-white border border-terracotta/10 text-brown font-sans text-xs focus:outline-none" />
                      <button onClick={() => handleChange("reviews", formData.reviews.filter((_, j) => j !== i))}
                        className="text-red-400 hover:text-red-600 transition-colors"><X className="w-4 h-4" /></button>
                    </div>
                    <textarea value={review.comment} onChange={(e) => { const r = [...formData.reviews]; r[i] = { ...r[i], comment: e.target.value }; handleChange("reviews", r); }}
                      placeholder="Review comment" rows={2}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-terracotta/10 text-brown font-sans text-xs focus:outline-none resize-none" />
                  </div>
                ))}
                {(formData.reviews || []).length === 0 && (
                  <p className="text-brown-light/40 text-xs font-sans text-center py-2">No reviews yet. Click "Add Review" to add one.</p>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-terracotta/10 px-6 py-4 flex gap-3 rounded-b-2xl">
              <button onClick={() => setEditProduct(null)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-cream text-brown font-sans font-semibold hover:bg-cream-dark transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || uploading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-terracotta text-white font-sans font-semibold hover:bg-terracotta-dark transition-colors flex items-center justify-center gap-2">
                {saving ? (
                  <>⏳ Saving...</>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> {isNew ? "Add" : "Save"} Product
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
