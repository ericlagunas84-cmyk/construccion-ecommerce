"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product, Category, Brand, Availability } from "@/lib/types";

type SortKey = "relevancia" | "precio-asc" | "precio-desc" | "mas-vendidos" | "mas-recientes";

export default function CatalogoClient({
  products,
  categories,
  brands,
}: {
  products: Product[];
  categories: Category[];
  brands: Brand[];
}) {
  const [query, setQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeBrands, setActiveBrands] = useState<string[]>([]);
  const [activeAvailability, setActiveAvailability] = useState<Availability[]>([]);
  const [maxPrice, setMaxPrice] = useState(3500);
  const [sort, setSort] = useState<SortKey>("relevancia");

  function toggle<T>(list: T[], value: T, setList: (v: T[]) => void) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchesQuery =
        query.trim() === "" ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.sku.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = activeCategories.length === 0 || activeCategories.includes(p.category);
      const matchesBrand = activeBrands.length === 0 || activeBrands.includes(p.brand);
      const matchesAvailability =
        activeAvailability.length === 0 || activeAvailability.includes(p.availability);
      const matchesPrice = p.price <= maxPrice;
      return matchesQuery && matchesCategory && matchesBrand && matchesAvailability && matchesPrice;
    });

    switch (sort) {
      case "precio-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "precio-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "mas-vendidos":
        result = [...result].sort((a, b) => b.soldCount - a.soldCount);
        break;
      case "mas-recientes":
        result = [...result].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        break;
    }
    return result;
  }, [products, query, activeCategories, activeBrands, activeAvailability, maxPrice, sort]);

  return (
    <>
      <div className="mb-8">
        <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-brand-orange">
          Catálogo
        </span>
        <h1 className="text-3xl font-700 text-brand-ink">Todos los productos</h1>
        <p className="mt-1 text-sm text-brand-ink-soft">{filtered.length} productos encontrados</p>
      </div>

      <div className="mb-6 flex items-center rounded-md border border-brand-line px-3 py-2.5 md:hidden">
        <svg width="16" height="16" viewBox="0 0 24 24" className="mr-2 shrink-0 text-brand-ink-soft" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, SKU o marca…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-brand-ink-soft"
        />
      </div>

      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        {/* Filtros */}
        <aside className="space-y-8">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-brand-ink">Categoría</h3>
            <ul className="space-y-2 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <label className="flex cursor-pointer items-center gap-2 text-brand-ink-soft hover:text-brand-ink">
                    <input
                      type="checkbox"
                      checked={activeCategories.includes(c.slug)}
                      onChange={() => toggle(activeCategories, c.slug, setActiveCategories)}
                      className="h-4 w-4 rounded border-brand-line text-brand-blue focus:ring-brand-blue"
                    />
                    {c.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-brand-ink">Marca</h3>
            <ul className="space-y-2 text-sm">
              {brands.map((b) => (
                <li key={b.name}>
                  <label className="flex cursor-pointer items-center gap-2 text-brand-ink-soft hover:text-brand-ink">
                    <input
                      type="checkbox"
                      checked={activeBrands.includes(b.name)}
                      onChange={() => toggle(activeBrands, b.name, setActiveBrands)}
                      className="h-4 w-4 rounded border-brand-line text-brand-blue focus:ring-brand-blue"
                    />
                    {b.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-brand-ink">Disponibilidad</h3>
            <ul className="space-y-2 text-sm">
              {(["disponible", "pocas-piezas", "agotado"] as Availability[]).map((a) => (
                <li key={a}>
                  <label className="flex cursor-pointer items-center gap-2 text-brand-ink-soft hover:text-brand-ink">
                    <input
                      type="checkbox"
                      checked={activeAvailability.includes(a)}
                      onChange={() => toggle(activeAvailability, a, setActiveAvailability)}
                      className="h-4 w-4 rounded border-brand-line text-brand-blue focus:ring-brand-blue"
                    />
                    {a === "disponible" ? "Disponible" : a === "pocas-piezas" ? "Pocas piezas" : "Agotado"}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-brand-ink">
              Precio máximo: <span className="font-mono text-brand-blue">${maxPrice.toLocaleString("es-MX")}</span>
            </h3>
            <input
              type="range"
              min={50}
              max={3500}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand-blue"
            />
          </div>
        </aside>

        {/* Resultados */}
        <div>
          <div className="mb-5 hidden items-center rounded-md border border-brand-line px-3 py-2.5 md:flex">
            <svg width="16" height="16" viewBox="0 0 24 24" className="mr-2 shrink-0 text-brand-ink-soft" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, SKU o marca…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-brand-ink-soft"
            />
          </div>

          <div className="mb-5 flex items-center justify-end">
            <label className="flex items-center gap-2 text-sm text-brand-ink-soft">
              Ordenar por
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-md border border-brand-line bg-white px-3 py-1.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none"
              >
                <option value="relevancia">Relevancia</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
                <option value="mas-vendidos">Más vendidos</option>
                <option value="mas-recientes">Más recientes</option>
              </select>
            </label>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-brand-line py-20 text-center text-sm text-brand-ink-soft">
              No encontramos productos con esos filtros. Prueba quitar alguno.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.sku} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
