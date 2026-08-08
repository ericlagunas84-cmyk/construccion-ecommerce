import { prisma } from "@/lib/prisma";
import { createBrand, deleteBrand } from "@/lib/actions/brands";

export default async function AdminMarcasPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h1 className="mb-1 text-2xl font-700 text-brand-ink">Marcas</h1>
      <p className="mb-6 text-sm text-brand-ink-soft">{brands.length} marcas</p>

      <div className="grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="overflow-x-auto rounded-lg border border-brand-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-line bg-brand-blue-light/40 text-left text-xs text-brand-ink-soft">
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Productos</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-line">
              {brands.map((b: (typeof brands)[number]) => (
                <tr key={b.name}>
                  <td className="px-4 py-3 font-medium text-brand-ink">{b.name}</td>
                  <td className="px-4 py-3 font-mono text-brand-ink-soft">{b._count.products}</td>
                  <td className="px-4 py-3">
                    {b._count.products === 0 ? (
                      <form action={deleteBrand.bind(null, b.name)}>
                        <button className="text-xs font-medium text-red-600 hover:underline">Eliminar</button>
                      </form>
                    ) : (
                      <span className="text-xs text-brand-ink-soft" title="No se puede eliminar: tiene productos asignados">
                        Eliminar
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="h-max rounded-lg border border-brand-line bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-ink">
            Nueva marca
          </h2>
          <form action={createBrand} className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Nombre</label>
              <input name="name" required className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-brand-orange py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark"
            >
              Crear marca
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
