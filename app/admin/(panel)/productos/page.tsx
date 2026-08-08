import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/format";
import { deleteProduct, toggleFeatured, toggleVisible, duplicateProduct } from "@/lib/actions/products";

export default async function AdminProductosPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, _count: { select: { orderItems: true } } },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">Productos</h1>
          <p className="text-sm text-brand-ink-soft">{products.length} productos en catálogo</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-md bg-brand-orange px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark"
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-brand-line bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-line bg-brand-blue-light/40 text-left text-xs text-brand-ink-soft">
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-line">
            {products.map((p: (typeof products)[number]) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-brand-ink">{p.name}</p>
                  {p.featured && (
                    <span className="mt-1 inline-block rounded bg-orange-50 px-1.5 py-0.5 text-[10px] font-medium text-brand-orange">
                      Destacado
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-brand-ink-soft">{p.sku}</td>
                <td className="px-4 py-3 text-brand-ink-soft">{p.category.name}</td>
                <td className="px-4 py-3 font-mono text-brand-ink-soft">{money(Number(p.price))}</td>
                <td className="px-4 py-3 font-mono text-brand-ink-soft">{p.stock}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded px-2 py-0.5 text-[11px] font-medium ${
                      p.visible ? "bg-emerald-50 text-emerald-700" : "bg-brand-line text-brand-ink-soft"
                    }`}
                  >
                    {p.visible ? "Visible" : "Oculto"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/productos/${p.id}/editar`} className="text-xs font-medium text-brand-blue hover:underline">
                      Editar
                    </Link>
                    <form action={toggleFeatured.bind(null, p.id, p.featured)}>
                      <button className="text-xs font-medium text-brand-blue hover:underline">
                        {p.featured ? "Quitar destacado" : "Destacar"}
                      </button>
                    </form>
                    <form action={toggleVisible.bind(null, p.id, p.visible)}>
                      <button className="text-xs font-medium text-brand-blue hover:underline">
                        {p.visible ? "Ocultar" : "Mostrar"}
                      </button>
                    </form>
                    <form action={duplicateProduct.bind(null, p.id)}>
                      <button className="text-xs font-medium text-brand-blue hover:underline">
                        Duplicar
                      </button>
                    </form>
                    {p._count.orderItems === 0 ? (
                      <form action={deleteProduct.bind(null, p.id)}>
                        <button className="text-xs font-medium text-red-600 hover:underline">
                          Eliminar
                        </button>
                      </form>
                    ) : (
                      <span
                        className="text-xs text-brand-ink-soft"
                        title={`No se puede eliminar: tiene ${p._count.orderItems} pedido(s) asociado(s). Usa "Ocultar" en su lugar.`}
                      >
                        Eliminar
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
