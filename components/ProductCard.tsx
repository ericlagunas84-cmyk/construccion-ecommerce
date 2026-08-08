"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { money } from "@/lib/format";

const availabilityLabel: Record<Product["availability"], string> = {
  disponible: "Disponible",
  "pocas-piezas": "Pocas piezas",
  agotado: "Agotado",
};

const availabilityColor: Record<Product["availability"], string> = {
  disponible: "text-emerald-700 bg-emerald-50",
  "pocas-piezas": "text-brand-orange bg-orange-50",
  agotado: "text-brand-ink-soft bg-brand-line",
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleBuy() {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="flex flex-col rounded-lg border border-brand-line bg-white transition hover:shadow-md">
      <Link href={`/producto/${product.slug}`} className="flex h-44 items-center justify-center rounded-t-lg bg-brand-blue-light text-xs font-mono text-brand-ink-soft">
        foto 1000×1000
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[11px] text-brand-ink-soft">SKU {product.sku}</span>
          <span className={`rounded px-2 py-0.5 text-[11px] font-medium ${availabilityColor[product.availability]}`}>
            {availabilityLabel[product.availability]}
          </span>
        </div>
        <Link href={`/producto/${product.slug}`}>
          <h3 className="mb-1 text-sm font-semibold leading-snug text-brand-ink hover:text-brand-blue">
            {product.name}
          </h3>
        </Link>
        <p className="mb-3 text-xs text-brand-ink-soft line-clamp-2">{product.shortDescription}</p>
        <div className="mb-4 mt-auto flex items-baseline gap-2 font-mono">
          <span className="text-lg font-medium text-brand-ink">{money(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-brand-ink-soft line-through">
              {money(product.compareAtPrice)}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            disabled={product.availability === "agotado"}
            onClick={handleBuy}
            className="flex-1 rounded-md bg-brand-orange py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:bg-brand-line disabled:text-brand-ink-soft"
          >
            {added ? "Agregado ✓" : "Comprar"}
          </button>
          <Link
            href={`/producto/${product.slug}`}
            className="flex-1 rounded-md border border-brand-line py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-brand-ink transition hover:border-brand-blue"
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
}
