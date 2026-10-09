"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { importCatalogAction, type ImportResult } from "@/lib/actions/catalog-import";

export default function ImportCatalogForm() {
  const [confirmacion, setConfirmacion] = useState("");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    startTransition(async () => {
      setResult(await importCatalogAction(confirmacion));
    });
  }

  if (result?.ok) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-800">
        <p className="mb-2 text-base font-bold">Catálogo cargado correctamente</p>
        <ul className="mb-4 list-inside list-disc space-y-1">
          <li>{result.createdProducts} productos nuevos cargados</li>
          <li>{result.createdCategories} categorías y {result.createdBrands} marcas</li>
          <li>
            Se borraron {result.deletedProducts} productos anteriores y {result.deletedOrders} pedidos de
            prueba
          </li>
        </ul>
        <div className="flex gap-4">
          <Link href="/admin/productos" className="font-semibold underline">
            Ver productos en el panel
          </Link>
          <Link href="/catalogo" target="_blank" className="font-semibold underline">
            Ver catálogo en el sitio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">
          Para confirmar, escribe <span className="font-mono font-bold text-red-600">BORRAR</span>
        </label>
        <input
          value={confirmacion}
          onChange={(e) => setConfirmacion(e.target.value)}
          disabled={pending}
          autoComplete="off"
          className="w-full rounded-md border border-brand-line px-3 py-2 font-mono text-sm uppercase focus:border-red-500 focus:outline-none"
        />
      </div>
      {result && !result.ok && <p className="text-sm font-medium text-red-600">{result.message}</p>}
      <button
        type="submit"
        disabled={pending || confirmacion.trim().toUpperCase() !== "BORRAR"}
        className="rounded-md bg-red-600 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-brand-line disabled:text-brand-ink-soft"
      >
        {pending ? "Cargando catálogo… (no cierres la página)" : "Borrar todo y cargar catálogo nuevo"}
      </button>
    </form>
  );
}
