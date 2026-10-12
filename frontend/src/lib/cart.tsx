'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, Product } from './types';

/**
 * "ऑर्डर यादी" (order list). The list is sent to the shop on WhatsApp and saved as an order
 * enquiry in the backend; the shop confirms the final price and delivery.
 */
type Ctx = {
  items: CartItem[];
  count: number;
  open: boolean;
  setOpen: (o: boolean) => void;
  add: (p: Product, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};
const CartContext = createContext<Ctx | null>(null);
const KEY = 'sanjivani-order-list';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* storage blocked or corrupt: start empty */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, loaded]);

  const add = useCallback((p: Product, qty = 1) => {
    setItems((list) => {
      const i = list.findIndex((x) => x.slug === p.slug);
      if (i === -1) return [...list, { slug: p.slug, name: p.name, image: p.image, qty, price: p.price ?? null }];
      const next = [...list];
      next[i] = { ...next[i], qty: Math.min(next[i].qty + qty, 999) };
      return next;
    });
  }, []);
  const setQty = useCallback((slug: string, qty: number) => {
    setItems((list) => (qty <= 0 ? list.filter((x) => x.slug !== slug) : list.map((x) => (x.slug === slug ? { ...x, qty: Math.min(qty, 999) } : x))));
  }, []);
  const remove = useCallback((slug: string) => setItems((list) => list.filter((x) => x.slug !== slug)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, count: items.reduce((n, x) => n + x.qty, 0), open, setOpen, add, setQty, remove, clear }),
    [items, open, add, setQty, remove, clear]
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
