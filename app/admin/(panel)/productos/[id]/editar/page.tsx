import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "@/lib/actions/products";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) return notFound();

  const updateWithId = updateProduct.bind(null, id);

  return (
    <div className="max-w-2xl">
      <Link href="/admin/productos" className="mb-4 inline-block text-xs font-medium text-brand-blue hover:underline">
        ← Volver a productos
      </Link>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-ink">Editar producto</h1>
        <span className="font-mono text-xs text-brand-ink-soft">SKU {product.sku}</span>
      </div>

      <form action={updateWithId} className="space-y-5 rounded-lg border border-brand-line bg-white p-6">
        <ImageUploadField initialUrl={product.imageUrl ?? undefined} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Nombre</label>
            <input name="name" required defaultValue={product.name} className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Stock</label>
            <input name="stock" type="number" min={0} defaultValue={product.stock} className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Categoría</label>
            <select name="category" required defaultValue={product.categorySlug} className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none">
              {categories.map((c: (typeof categories)[number]) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Marca</label>
            <select name="brand" required defaultValue={product.brandName} className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none">
              {brands.map((b: (typeof brands)[number]) => (
                <option key={b.name} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Precio</label>
            <input name="price" type="number" min={0} step="0.01" required defaultValue={Number(product.price)} className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
            <p className="mt-1 text-[11px] text-brand-ink-soft">Pon 0 para mostrarlo como “Precio a cotizar” (botón de WhatsApp).</p>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Precio oferta (opcional)</label>
            <input
              name="compareAtPrice"
              type="number"
              min={0}
              step="0.01"
              defaultValue={product.compareAtPrice ? Number(product.compareAtPrice) : undefined}
              className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Descripción corta</label>
          <input name="shortDescription" defaultValue={product.shortDescription} className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Descripción larga</label>
          <textarea name="description" rows={4} defaultValue={product.description} className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-brand-ink">
            <input type="checkbox" name="featured" defaultChecked={product.featured} className="h-4 w-4 rounded border-brand-line text-brand-blue focus:ring-brand-blue" />
            Producto destacado
          </label>
          <label className="flex items-center gap-2 text-sm text-brand-ink">
            <input type="checkbox" name="visible" defaultChecked={product.visible} className="h-4 w-4 rounded border-brand-line text-brand-blue focus:ring-brand-blue" />
            Visible en el sitio
          </label>
        </div>

        <button
          type="submit"
          className="rounded-md bg-brand-orange px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark"
        >
          Guardar cambios
        </button>
      </form>

      {(product.internalNotes || product.gallery.length > 0 || product.techSheetUrl || product.manufacturerUrl) && (
        <div className="mt-6 space-y-3 rounded-lg border border-dashed border-brand-line bg-brand-blue-light/30 p-5 text-xs text-brand-ink-soft">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-brand-ink">Datos del catálogo técnico (solo admin)</h2>
          {product.gallery.length > 0 && <p>{product.gallery.length} foto(s) en la galería del producto.</p>}
          {product.techSheetUrl && (
            <p>
              Ficha técnica PDF:{" "}
              <a href={product.techSheetUrl} target="_blank" rel="noopener noreferrer" className="break-all text-brand-blue underline">
                {product.techSheetUrl}
              </a>
            </p>
          )}
          {product.manufacturerUrl && (
            <p>
              Página del fabricante:{" "}
              <a href={product.manufacturerUrl} target="_blank" rel="noopener noreferrer" className="break-all text-brand-blue underline">
                {product.manufacturerUrl}
              </a>
            </p>
          )}
          {product.internalNotes && <p className="whitespace-pre-line">{product.internalNotes}</p>}
        </div>
      )}
    </div>
  );
}
