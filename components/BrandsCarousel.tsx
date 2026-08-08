"use client";

import type { Brand } from "@/lib/types";

export default function BrandsCarousel({ brands }: { brands: Brand[] }) {
  // Se duplica la lista para lograr un scroll infinito sin salto.
  const loop = [...brands, ...brands];

  return (
    <section className="border-y border-brand-line bg-white py-12">
      <div className="mx-auto mb-6 max-w-7xl px-6">
        <span className="font-mono text-xs uppercase tracking-widest text-brand-ink-soft">
          Marcas con las que trabajamos
        </span>
      </div>

      <div className="group relative overflow-hidden">
        <div className="flex w-max animate-[scroll_28s_linear_infinite] gap-16 px-6 group-hover:[animation-play-state:paused]">
          {loop.map((b, i) => (
            <span
              key={`${b.name}-${i}`}
              className="font-display text-xl font-600 text-brand-ink-soft/60"
            >
              {b.name}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
