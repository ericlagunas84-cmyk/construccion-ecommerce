import Link from "next/link";

export function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-col items-start gap-6 rounded-lg bg-brand-orange px-8 py-10 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/80">
            Promoción de temporada
          </span>
          <h3 className="text-2xl font-700">15% de descuento en impermeabilizantes</h3>
          <p className="mt-1 text-sm text-white/85">Válido antes de temporada de lluvias. Aplica en línea y en sucursal.</p>
        </div>
        <Link
          href="/catalogo?cat=impermeabilizantes"
          className="whitespace-nowrap rounded-md bg-brand-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-black"
        >
          Ver promoción
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
          <h3 className="mb-3 text-2xl font-700">¿Necesitas asesoría para tu proyecto?</h3>
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
