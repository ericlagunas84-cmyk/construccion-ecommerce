import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const values = [
  { title: "Satisfacción del cliente", desc: "Es nuestra prioridad en cada compra y cada entrega." },
  { title: "Mejores precios", desc: "Precio competitivo frente al mercado, sin sacrificar calidad." },
  { title: "Calidad", desc: "Trabajamos con las mejores marcas del mercado de recubrimientos de concreto." },
  { title: "Tiempos de entrega", desc: "Entrega inmediata para no detener tu obra." },
];

const suppliers = [
  "Tramex", "Superabrasive", "Boon Tools", "Convergent Concrete Technologies",
  "Nour", "MK Diamond Products", "CS Unitec", "Dripless",
];

export default function QuienesSomosPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-brand-blue py-20 text-white">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <span className="mb-3 block font-mono text-xs uppercase tracking-widest text-brand-orange">
              Quiénes somos
            </span>
            <h1 className="text-3xl font-bold md:text-4xl">
              Herramientas para instaladores exigentes
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="mb-3 text-xl font-bold text-brand-ink">Sobre la empresa</h2>
          <p className="mb-10 text-sm leading-relaxed text-brand-ink-soft">
            Somos una empresa mexicana experta en recubrimientos de concreto. Distribuimos las
            mejores marcas del mercado de reparación, preparación y recubrimiento de pisos, con
            precio competitivo y entrega inmediata para los aplicadores de pisos industriales en
            México.
          </p>

          <h2 className="mb-5 text-xl font-bold text-brand-ink">Por qué elegirnos</h2>
          <div className="mb-16 grid gap-6 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="rounded-lg border border-brand-line p-5">
                <h3 className="mb-1.5 font-display text-base font-semibold text-brand-ink">{v.title}</h3>
                <p className="text-sm text-brand-ink-soft">{v.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="mb-5 text-xl font-bold text-brand-ink">Nuestros proveedores</h2>
          <div className="mb-16 flex flex-wrap gap-3">
            {suppliers.map((s) => (
              <span key={s} className="rounded-md border border-brand-line px-4 py-2 text-sm font-medium text-brand-ink">
                {s}
              </span>
            ))}
          </div>

          <div className="rounded-lg bg-brand-blue-light px-8 py-10 text-center">
            <h3 className="mb-2 text-lg font-bold text-brand-ink">¿Listo para tu próximo proyecto?</h3>
            <p className="mb-6 text-sm text-brand-ink-soft">
              Explora el catálogo o escríbenos si necesitas asesoría.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/catalogo"
                className="rounded-md bg-brand-orange px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark"
              >
                Ver catálogo
              </Link>
              <Link
                href="/contacto"
                className="rounded-md border border-brand-blue px-6 py-3 text-sm font-semibold uppercase tracking-wide text-brand-blue transition hover:bg-white"
              >
                Contactar
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
