"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Upload, ImageIcon, Trash2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const BANNER_KEY = "snackzee_hero_banners";

interface Banner {
  id: string;
  url: string;
  public_id: string;
  label: string;
  active: boolean;
}

export default function AdminBannerPage() {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [uploading, setUploading] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("snackzee_token");
    fetch(`${BACKEND_URL}/banners`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (d.banners && d.banners.length > 0) {
          setBanners(d.banners);
          localStorage.setItem(BANNER_KEY, JSON.stringify(d.banners));
        } else {
          try {
            const stored = localStorage.getItem(BANNER_KEY);
            if (stored) setBanners(JSON.parse(stored));
          } catch {}
        }
      })
      .catch(() => {
        try {
          const stored = localStorage.getItem(BANNER_KEY);
          if (stored) setBanners(JSON.parse(stored));
        } catch {}
      });
  }, []);

  const saveBanners = async (updated: Banner[]) => {
    setBanners(updated);
    localStorage.setItem(BANNER_KEY, JSON.stringify(updated));
    const token = localStorage.getItem("snackzee_token");
    try {
      await fetch(`${BACKEND_URL}/banners`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ banners: updated }),
      });
    } catch {}
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url, public_id } = await uploadToCloudinary(file, "snackzee/banners");
      const newBanner: Banner = {
        id: Date.now().toString(),
        url,
        public_id,
        label: label || file.name.replace(/\.[^.]+$/, ""),
        active: true,
      };
      await saveBanners([...banners, newBanner]);
      setLabel("");
      toast({ title: "Banner uploaded!", description: "Banner is now live on the homepage." });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const toggleActive = async (id: string) => {
    const updated = banners.map((b) => b.id === id ? { ...b, active: !b.active } : b);
    await saveBanners(updated);
    const banner = banners.find((b) => b.id === id);
    toast({ title: banner?.active ? "Banner hidden" : "Banner activated" });
  };

  const deleteBanner = async (id: string) => {
    const banner = banners.find((b) => b.id === id);
    if (banner?.public_id) {
      const token = localStorage.getItem("snackzee_token");
      const encodedId = banner.public_id.replace(/\//g, "--");
      fetch(`${BACKEND_URL}/upload/${encodedId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    await saveBanners(banners.filter((b) => b.id !== id));
    toast({ title: "Banner removed" });
  };

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brown mb-2">Banner Management</h1>
      <p className="text-brown-light/60 font-sans text-sm mb-8">Upload banner images to Cloudinary — they appear in the homepage carousel instantly.</p>

      {/* Upload */}
      <div className="bg-white rounded-2xl border border-terracotta/10 p-6 mb-6">
        <h2 className="font-serif text-lg font-bold text-brown mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-terracotta" /> Upload New Banner
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Banner label (e.g. Diwali Special)"
            className="flex-1 px-4 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none focus:border-terracotta/30"
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-terracotta hover:bg-terracotta-dark disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold font-sans text-sm transition-colors whitespace-nowrap"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading to Cloudinary..." : "Choose Image"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>
        <p className="text-brown-light/40 text-xs font-sans mt-2">Recommended: 1200×500px · JPG or PNG · max 15MB · Stored on Cloudinary</p>
      </div>

      {/* Banners Grid */}
      {banners.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-terracotta/20 p-12 text-center">
          <ImageIcon className="w-12 h-12 text-brown-light/20 mx-auto mb-4" />
          <p className="font-serif text-lg font-bold text-brown mb-2">No banners yet</p>
          <p className="text-brown-light/50 font-sans text-sm">Upload your first banner image above.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {banners.map((banner, i) => (
            <motion.div key={banner.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`bg-white rounded-2xl border-2 overflow-hidden ${banner.active ? "border-terracotta shadow-lg shadow-terracotta/10" : "border-terracotta/10 opacity-60"}`}>
              <div className="relative aspect-video bg-cream-dark">
                <Image src={banner.url} alt={banner.label} fill className="object-cover" sizes="(max-width:640px) 100vw, 50vw" />
                {banner.active && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-terracotta text-white text-xs font-bold font-sans px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </div>
                )}
              </div>
              <div className="p-4 flex items-center justify-between gap-3">
                <p className="font-sans font-semibold text-brown text-sm truncate">{banner.label}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggleActive(banner.id)}
                    className={`flex items-center gap-1.5 text-xs font-sans font-semibold px-3 py-1.5 rounded-lg transition-colors border ${
                      banner.active
                        ? "text-terracotta border-terracotta/30 hover:bg-terracotta/5"
                        : "text-brown-light/50 border-terracotta/20 hover:bg-terracotta/5 hover:text-terracotta"
                    }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {banner.active ? "Active" : "Set Active"}
                  </button>
                  <button onClick={() => deleteBanner(banner.id)}
                    className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
