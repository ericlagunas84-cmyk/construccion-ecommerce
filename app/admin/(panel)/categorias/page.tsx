import { prisma } from "@/lib/prisma";
import {
  createCategory,
  updateCategory,
  toggleCategoryVisible,
  deleteCategory,
  reorderCategory,
} from "@/lib/actions/categories";

export default async function AdminCategoriasPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h1 className="mb-1 text-2xl font-700 text-brand-ink">Categorías</h1>
      <p className="mb-6 text-sm text-brand-ink-soft">{categories.length} categorías</p>

      <div className="mb-8 grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="overflow-x-auto rounded-lg border border-brand-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-line bg-brand-blue-light/40 text-left text-xs text-brand-ink-soft">
                <th className="px-4 py-3 font-medium">Orden</th>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Productos</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-line">
              {categories.map((c: (typeof categories)[number], i: number) => (
                <tr key={c.slug}>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <form action={reorderCategory.bind(null, c.slug, "up")}>
                        <button disabled={i === 0} className="text-brand-ink-soft hover:text-brand-blue disabled:opacity-30">↑</button>
                      </form>
                      <form action={reorderCategory.bind(null, c.slug, "down")}>
                        <button disabled={i === categories.length - 1} className="text-brand-ink-soft hover:text-brand-blue disabled:opacity-30">↓</button>
                      </form>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-brand-ink">{c.name}</p>
                    <p className="text-xs text-brand-ink-soft">{c.description}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-brand-ink-soft">{c._count.products}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-0.5 text-[11px] font-medium ${c.visible ? "bg-emerald-50 text-emerald-700" : "bg-brand-line text-brand-ink-soft"}`}>
                      {c.visible ? "Visible" : "Oculta"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <form action={toggleCategoryVisible.bind(null, c.slug, c.visible)}>
                        <button className="text-xs font-medium text-brand-blue hover:underline">
                          {c.visible ? "Ocultar" : "Mostrar"}
                        </button>
                      </form>
                      {c._count.products === 0 ? (
                        <form action={deleteCategory.bind(null, c.slug)}>
                          <button className="text-xs font-medium text-red-600 hover:underline">Eliminar</button>
                        </form>
                      ) : (
                        <span className="text-xs text-brand-ink-soft" title="No se puede eliminar: tiene productos asignados">
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

        {/* Crear nueva */}
        <div className="h-max rounded-lg border border-brand-line bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-ink">
            Nueva categoría
          </h2>
          <form action={createCategory} className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Nombre</label>
              <input name="name" required className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Descripción</label>
              <textarea name="description" rows={3} className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-brand-orange py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark"
            >
              Crear categoría
            </button>
          </form>
        </div>
      </div>

      {/* Edición rápida en línea */}
      <div className="rounded-lg border border-brand-line bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-ink">
          Editar descripción
        </h2>
        <div className="space-y-4">
          {categories.map((c: (typeof categories)[number]) => (
            <form key={c.slug} action={updateCategory.bind(null, c.slug)} className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[160px]">
                <label className="mb-1 block text-xs font-medium text-brand-ink-soft">Nombre</label>
                <input name="name" defaultValue={c.name} className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
              </div>
              <div className="flex-[2] min-w-[220px]">
                <label className="mb-1 block text-xs font-medium text-brand-ink-soft">Descripción</label>
                <input name="description" defaultValue={c.description} className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
              </div>
              <button type="submit" className="rounded-md border border-brand-blue px-4 py-2 text-xs font-semibold uppercase text-brand-blue hover:bg-brand-blue-light">
                Guardar
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
