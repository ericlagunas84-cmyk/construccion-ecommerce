"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import type { Product } from "@/lib/types";

export type CartItem = {
  sku: string;
  slug: string;
  name: string;
  price: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  updateQty: (sku: string, qty: number) => void;
  removeItem: (sku: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "construexpress-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Carga inicial desde localStorage (solo en cliente)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // localStorage no disponible o dato corrupto: se ignora y arranca vacío
    }
    setHydrated(true);
  }, []);

  // Persiste cada cambio
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(product: Product, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.sku === product.sku);
      if (existing) {
        return prev.map((i) => (i.sku === product.sku ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { sku: product.sku, slug: product.slug, name: product.name, price: product.price, qty }];
    });
  }

  function updateQty(sku: string, qty: number) {
    if (qty <= 0) return removeItem(sku);
    setItems((prev) => prev.map((i) => (i.sku === sku ? { ...i, qty } : i)));
  }

  function removeItem(sku: string) {
    setItems((prev) => prev.filter((i) => i.sku !== sku));
  }

  function clear() {
    setItems([]);
  }

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.qty * i.price, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clear, count, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
