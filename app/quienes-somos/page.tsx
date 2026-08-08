import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const values = [
  { title: "Honestidad", desc: "Precio claro, sin letras chiquitas ni sorpresas en la caja." },
  { title: "Rapidez", desc: "Entendemos que un día de obra parada cuesta dinero." },
  { title: "Cercanía", desc: "Asesoría real de gente que conoce los materiales, no un script." },
];

const team = [
  { name: "Renata Salas", role: "Dirección general" },
  { name: "Iván Cordero", role: "Operaciones y logística" },
  { name: "Marisol Peña", role: "Atención a clientes" },
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
            <h1 className="text-3xl font-700 md:text-4xl">
              Empezamos como una ferretería de barrio. Seguimos operando como una.
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="mb-3 text-xl font-700 text-brand-ink">Nuestra historia</h2>
          <p className="mb-10 text-sm leading-relaxed text-brand-ink-soft">
            ConstruExpress nació de una necesidad simple: los maestros de obra perdían horas
            buscando material en tres o cuatro ferreterías distintas. Empezamos vendiendo cemento
            y herramienta básica en una sola sucursal; hoy distribuimos polvos, herramientas,
            epóxicos e impermeabilizantes en línea y en sucursal, con el mismo criterio del
            primer día: si no lo tenemos en stock real, no lo prometemos.
          </p>

          <div className="mb-12 grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-orange">
                Misión
              </h3>
              <p className="text-sm leading-relaxed text-brand-ink-soft">
                Poner al alcance de cualquier obra, grande o pequeña, materiales de calidad con
                entrega rápida y precio justo.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-orange">
                Visión
              </h3>
              <p className="text-sm leading-relaxed text-brand-ink-soft">
                Ser el proveedor de materiales de construcción en línea de mayor confianza en la
                región, reconocido por su honestidad en inventario y tiempos de entrega.
              </p>
            </div>
          </div>

          <h2 className="mb-5 text-xl font-700 text-brand-ink">Valores</h2>
          <div className="mb-16 grid gap-6 sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="rounded-lg border border-brand-line p-5">
                <h3 className="mb-1.5 font-display text-base font-600 text-brand-ink">{v.title}</h3>
                <p className="text-sm text-brand-ink-soft">{v.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="mb-5 text-xl font-700 text-brand-ink">Equipo</h2>
          <div className="mb-16 grid gap-6 sm:grid-cols-3">
            {team.map((t) => (
              <div key={t.name}>
                <div className="mb-3 flex aspect-square items-center justify-center rounded-lg bg-brand-blue-light text-xs font-mono text-brand-ink-soft">
                  foto 600×600
                </div>
                <h3 className="font-semibold text-brand-ink">{t.name}</h3>
                <p className="text-sm text-brand-ink-soft">{t.role}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-brand-blue-light px-8 py-10 text-center">
            <h3 className="mb-2 text-lg font-700 text-brand-ink">¿Listo para tu próximo proyecto?</h3>
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
