import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-blue text-white">
      {/* Textura sutil: retícula tipo plano arquitectónico, muy discreta */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-24 md:grid-cols-2 md:py-32">
        <div>
          <span className="mb-4 inline-block font-mono text-xs uppercase tracking-widest text-brand-orange">
            Entrega en 24–48 horas
          </span>
          <h1 className="mb-5 max-w-lg text-4xl font-700 leading-[1.05] md:text-5xl">
            Todo lo que tu obra necesita, en un solo lugar
          </h1>
          <p className="mb-8 max-w-md text-base text-white/80">
            Polvos, herramientas, epóxicos e impermeabilizantes con stock real
            y precio claro. Compra en línea o recoge en sucursal.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/catalogo"
              className="rounded-md bg-brand-orange px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark"
            >
              Comprar ahora
            </Link>
            <Link
              href="/catalogo"
              className="rounded-md border border-white/30 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
            >
              Ver productos
            </Link>
          </div>
        </div>

        <div className="relative aspect-[4/3] rounded-lg border border-white/15 bg-white/5">
          <div className="flex h-full items-center justify-center text-sm font-mono text-white/40">
            foto / video: herramientas en obra — 1200×900
          </div>
        </div>
      </div>
    </section>
  );
}
