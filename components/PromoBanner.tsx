import Link from "next/link";

type PromoBannerData = {
  title: string;
  subtitle: string | null;
  ctaText: string | null;
  ctaUrl: string | null;
};

// Igual que el hero: usa el primer banner activo con ubicación "PROMO"
// cargado desde /admin/banners, y si no hay ninguno cae en el mensaje
// por defecto para que la sección nunca se vea vacía.
export function PromoBanner({ banner }: { banner?: PromoBannerData | null }) {
  const title = banner?.title ?? "15% de descuento en impermeabilizantes";
  const subtitle =
    banner?.subtitle ?? "Válido antes de temporada de lluvias. Aplica en línea y en sucursal.";
  const ctaText = banner?.ctaText || "Ver promoción";
  const ctaUrl = banner?.ctaUrl || "/catalogo?cat=impermeabilizantes";

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-col items-start gap-6 rounded-lg bg-brand-orange px-8 py-10 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/80">
            Promoción de temporada
          </span>
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="mt-1 text-sm text-white/85">{subtitle}</p>
        </div>
        <Link
          href={ctaUrl}
          className="whitespace-nowrap rounded-md bg-brand-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-black"
        >
          {ctaText}
        </Link>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <>
      <div className="measure-divider" />
      <section className="bg-brand-blue py-16 text-center text-white">
        <div className="mx-auto max-w-xl px-6">
          <h3 className="mb-3 text-2xl font-bold">¿Necesitas asesoría para tu proyecto?</h3>
          <p className="mb-7 text-white/80">
            Cuéntanos qué estás construyendo y te ayudamos a elegir los materiales correctos.
          </p>
          <Link
            href="/contacto"
            className="inline-block rounded-md bg-brand-orange px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark"
          >
            Contactar
          </Link>
        </div>
      </section>
    </>
  );
}
