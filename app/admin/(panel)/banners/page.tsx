import { prisma } from "@/lib/prisma";
import { createBanner, toggleBannerActive, deleteBanner } from "@/lib/actions/banners";
import ImageUploadField from "@/components/admin/ImageUploadField";

export const dynamic = "force-dynamic";

const PLACEMENT_LABEL: Record<string, string> = {
  HERO: "Portada (hero)",
  PROMO: "Franja de promoción",
};

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({ orderBy: [{ placement: "asc" }, { sortOrder: "asc" }] });

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-brand-ink">Banners y promociones</h1>
      <p className="mb-6 text-sm text-brand-ink-soft">
        Controla los anuncios de la página principal sin tocar código. Cambia, activa/desactiva
        o programa fechas de inicio y fin.
      </p>

      <div className="grid gap-8 md:grid-cols-[1fr_360px]">
        <div className="overflow-x-auto rounded-lg border border-brand-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-line bg-brand-blue-light/40 text-left text-xs text-brand-ink-soft">
                <th className="px-4 py-3 font-medium">Banner</th>
                <th className="px-4 py-3 font-medium">Ubicación</th>
                <th className="px-4 py-3 font-medium">Vigencia</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-line">
              {banners.map((b: (typeof banners)[number]) => (
                <tr key={b.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded border border-brand-line bg-brand-blue-light">
                        {b.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={b.imageUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-[9px] text-brand-ink-soft">sin img</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-brand-ink">{b.title}</p>
                        {b.subtitle && <p className="text-xs text-brand-ink-soft">{b.subtitle}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-brand-ink-soft">{PLACEMENT_LABEL[b.placement]}</td>
                  <td className="px-4 py-3 text-xs text-brand-ink-soft">
                    {b.startsAt ? b.startsAt.toLocaleDateString("es-MX") : "—"} a{" "}
                    {b.endsAt ? b.endsAt.toLocaleDateString("es-MX") : "sin fin"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-0.5 text-[11px] font-medium ${b.active ? "bg-emerald-50 text-emerald-700" : "bg-brand-line text-brand-ink-soft"}`}>
                      {b.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <form action={toggleBannerActive.bind(null, b.id, b.active)}>
                        <button className="text-xs font-medium text-brand-blue hover:underline">
                          {b.active ? "Desactivar" : "Activar"}
                        </button>
                      </form>
                      <form action={deleteBanner.bind(null, b.id)}>
                        <button className="text-xs font-medium text-red-600 hover:underline">Eliminar</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {banners.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-brand-ink-soft">
                    Todavía no hay banners. Crea el primero aquí a la derecha.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="h-max rounded-lg border border-brand-line bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-ink">
            Nuevo banner
          </h2>
          <form action={createBanner} className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Ubicación</label>
              <select name="placement" className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none">
                <option value="PROMO">Franja de promoción (debajo de marcas)</option>
                <option value="HERO">Portada (hero, arriba del todo)</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Título</label>
              <input name="title" required placeholder="15% de descuento en impermeabilizantes" className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Subtítulo (opcional)</label>
              <input name="subtitle" placeholder="Válido antes de temporada de lluvias" className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
            </div>
            <ImageUploadField kind="banner" />
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Texto del botón (opcional)</label>
              <input name="ctaText" placeholder="Ver promoción" className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Enlace del botón (opcional)</label>
              <input name="ctaUrl" placeholder="/catalogo?cat=impermeabilizantes" className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Desde (opcional)</label>
                <input name="startsAt" type="date" className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Hasta (opcional)</label>
                <input name="endsAt" type="date" className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Orden</label>
              <input name="sortOrder" type="number" defaultValue={0} className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
              <p className="mt-1 text-[11px] text-brand-ink-soft">Los números más bajos aparecen primero.</p>
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-brand-orange py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark"
            >
              Crear banner
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
