"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { Product } from "@/lib/products";

export interface CartItem {
  product: Product;
  quantity: number;
  variantKey?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function getCartItemKey(item: CartItem): string {
  return item.variantKey || `${item.product.id}:${item.product.priceUnit}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("snackzee_cart");
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("snackzee_cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = useCallback((product: Product, qty = 1) => {
    setItems((prev) => {
      const variantKey = `${product.id}:${product.priceUnit}`;
      const existing = prev.find((i) => getCartItemKey(i) === variantKey);
      if (existing) {
        return prev.map((i) =>
          getCartItemKey(i) === variantKey ? { ...i, quantity: i.quantity + qty, product, variantKey } : i
        );
      }
      return [...prev, { product, quantity: qty, variantKey }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => getCartItemKey(i) !== id && i.product.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => getCartItemKey(i) !== id && i.product.id !== id));
    } else {
      setItems((prev) =>
        prev.map((i) => (getCartItemKey(i) === id || i.product.id === id ? { ...i, quantity: qty } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
