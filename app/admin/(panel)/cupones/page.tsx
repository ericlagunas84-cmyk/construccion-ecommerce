import { prisma } from "@/lib/prisma";
import { createCoupon, toggleCouponActive, deleteCoupon } from "@/lib/actions/coupons";

export default async function AdminCuponesPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-brand-ink">Cupones de descuento</h1>
      <p className="mb-6 text-sm text-brand-ink-soft">{coupons.length} cupones</p>

      <div className="grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="overflow-x-auto rounded-lg border border-brand-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-line bg-brand-blue-light/40 text-left text-xs text-brand-ink-soft">
                <th className="px-4 py-3 font-medium">Código</th>
                <th className="px-4 py-3 font-medium">Descuento</th>
                <th className="px-4 py-3 font-medium">Usos</th>
                <th className="px-4 py-3 font-medium">Vence</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-line">
              {coupons.map((c: (typeof coupons)[number]) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-mono font-semibold text-brand-ink">{c.code}</td>
                  <td className="px-4 py-3 text-brand-ink-soft">
                    {c.type === "PORCENTAJE" ? `${Number(c.value)}%` : `$${Number(c.value).toLocaleString("es-MX")}`}
                    {c.minPurchase && (
                      <span className="block text-xs">mín. ${Number(c.minPurchase).toLocaleString("es-MX")}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-brand-ink-soft">
                    {c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ""}
                  </td>
                  <td className="px-4 py-3 text-brand-ink-soft">
                    {c.expiresAt ? c.expiresAt.toLocaleDateString("es-MX") : "Sin vencimiento"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-0.5 text-[11px] font-medium ${c.active ? "bg-emerald-50 text-emerald-700" : "bg-brand-line text-brand-ink-soft"}`}>
                      {c.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <form action={toggleCouponActive.bind(null, c.id, c.active)}>
                        <button className="text-xs font-medium text-brand-blue hover:underline">
                          {c.active ? "Desactivar" : "Activar"}
                        </button>
                      </form>
                      {c.usedCount === 0 ? (
                        <form action={deleteCoupon.bind(null, c.id)}>
                          <button className="text-xs font-medium text-red-600 hover:underline">Eliminar</button>
                        </form>
                      ) : (
                        <span className="text-xs text-brand-ink-soft" title="No se puede eliminar: ya tiene usos registrados">
                          Eliminar
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-brand-ink-soft">
                    Todavía no hay cupones.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="h-max rounded-lg border border-brand-line bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-ink">
            Nuevo cupón
          </h2>
          <form action={createCoupon} className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Código</label>
              <input name="code" required placeholder="EJEMPLO10" className="w-full rounded-md border border-brand-line px-3 py-2 text-sm uppercase focus:border-brand-blue focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Tipo</label>
              <select name="type" className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none">
                <option value="PORCENTAJE">Porcentaje (%)</option>
                <option value="FIJO">Monto fijo ($)</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Valor</label>
              <input name="value" type="number" min={0} step="0.01" required className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Compra mínima (opcional)</label>
              <input name="minPurchase" type="number" min={0} step="0.01" className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Máximo de usos (opcional)</label>
              <input name="maxUses" type="number" min={1} className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Fecha de vencimiento (opcional)</label>
              <input name="expiresAt" type="date" className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-brand-orange py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark"
            >
              Crear cupón
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
