"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";

export default function AddToCart({ product, disabled }: { product: Product; disabled?: boolean }) {
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  function handleAdd() {
    addItem(product, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  function handleBuyNow() {
    addItem(product, qty);
    router.push("/carrito");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-md border border-brand-line">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3.5 py-2.5 text-brand-ink-soft hover:text-brand-ink disabled:opacity-40"
            aria-label="Disminuir cantidad"
          >
            −
          </button>
          <span className="w-10 text-center font-mono text-sm">{qty}</span>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setQty((q) => q + 1)}
            className="px-3.5 py-2.5 text-brand-ink-soft hover:text-brand-ink disabled:opacity-40"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={handleAdd}
          className="rounded-md border border-brand-blue px-6 py-3 text-sm font-semibold uppercase tracking-wide text-brand-blue transition hover:bg-brand-blue-light disabled:cursor-not-allowed disabled:border-brand-line disabled:text-brand-ink-soft"
        >
          Agregar al carrito
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={handleBuyNow}
          className="rounded-md bg-brand-orange px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:bg-brand-line disabled:text-brand-ink-soft"
        >
          Comprar ahora
        </button>
      </div>
      {justAdded && (
        <p className="mt-3 text-sm font-medium text-emerald-700">
          Se agregó {qty} × {product.name} al carrito.
        </p>
      )}
    </div>
  );
}
