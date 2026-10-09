"use client";

import { useState } from "react";

// Foto principal + miniaturas. Al dar clic en una miniatura se vuelve la
// foto principal; al dar clic en la principal se abre en tamaño completo.
export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg bg-brand-blue-light text-xs font-mono text-brand-ink-soft">
        Sin foto
      </div>
    );
  }

  return (
    <div>
      <a
        href={current}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-brand-line bg-white"
        title="Ver foto en tamaño completo"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={current} alt={alt} className="h-full w-full object-contain p-4" />
      </a>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={`flex aspect-square items-center justify-center overflow-hidden rounded-md border bg-white transition ${
                i === active ? "border-brand-blue ring-2 ring-brand-blue/30" : "border-brand-line hover:border-brand-blue"
              }`}
              aria-label={`Ver foto ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
