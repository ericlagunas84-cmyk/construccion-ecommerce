import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-brand-blue text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/hero-construction.jpg')" }}
    >
      {/* Degradado oscuro para que el texto siga siendo legible sobre la foto */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(18,58,107,0.95) 0%, rgba(18,58,107,0.80) 40%, rgba(18,58,107,0.45) 75%, rgba(18,58,107,0.25) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="max-w-lg">
          <span className="mb-4 inline-block font-mono text-xs uppercase tracking-widest text-brand-orange">
            Entrega en 24–48 horas
          </span>
          <h1 className="mb-5 max-w-lg text-4xl font-700 leading-[1.05] md:text-5xl">
            Todo lo que tu obra necesita, en un solo lugar
          </h1>
          <p className="mb-8 max-w-md text-base text-white/85">
            Herramientas especializadas para instalación, pulido y acabado de pisos epóxicos y de
            concreto, con envíos a todo México.
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
      </div>
    </section>
  );
}
