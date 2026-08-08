import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createProduct } from "@/lib/actions/products";

export default async function NuevoProductoPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-2xl">
      <Link href="/admin/productos" className="mb-4 inline-block text-xs font-medium text-brand-blue hover:underline">
        ← Volver a productos
      </Link>
      <h1 className="mb-6 text-2xl font-700 text-brand-ink">Nuevo producto</h1>

      <form action={createProduct} className="space-y-5 rounded-lg border border-brand-line bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Nombre</label>
            <input name="name" required className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">SKU</label>
            <input name="sku" required className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Stock inicial</label>
            <input name="stock" type="number" min={0} defaultValue={0} className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Categoría</label>
            <select name="category" required className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none">
              {categories.map((c: (typeof categories)[number]) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Marca</label>
            <select name="brand" required className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none">
              {brands.map((b: (typeof brands)[number]) => (
                <option key={b.name} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Precio</label>
            <input name="price" type="number" min={0} step="0.01" required className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Precio oferta (opcional)</label>
            <input name="compareAtPrice" type="number" min={0} step="0.01" className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Descripción corta</label>
          <input name="shortDescription" className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Descripción larga</label>
          <textarea name="description" rows={4} className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
        </div>

        <label className="flex items-center gap-2 text-sm text-brand-ink">
          <input type="checkbox" name="featured" className="h-4 w-4 rounded border-brand-line text-brand-blue focus:ring-brand-blue" />
          Marcar como producto destacado
        </label>

        <button
          type="submit"
          className="rounded-md bg-brand-orange px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark"
        >
          Crear producto
        </button>
      </form>
    </div>
  );
}
