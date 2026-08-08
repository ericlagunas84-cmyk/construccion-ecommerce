const benefits = [
  {
    title: "Entrega rápida",
    desc: "24–48 horas en zona metropolitana.",
    icon: (
      <path d="M3 3h13v10H3zM16 8h4l3 3v2h-7zM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
    ),
  },
  {
    title: "Productos de calidad",
    desc: "Marcas verificadas, garantía de fábrica.",
    icon: <path d="M12 2 3 7v6c0 5 4 9 9 9s9-4 9-9V7Z" />,
  },
  {
    title: "Atención personalizada",
    desc: "Asesoría técnica antes y después de comprar.",
    icon: (
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
    ),
  },
  {
    title: "Pago seguro",
    desc: "Tarjetas, transferencia y efectivo vía Mercado Pago.",
    icon: <path d="M2 7h20v12H2zM2 11h20M6 15h4" />,
  },
];

export default function Benefits() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((b) => (
          <div key={b.title} className="flex flex-col items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-blue text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {b.icon}
              </svg>
            </div>
            <h3 className="font-display text-base font-600 text-brand-ink">{b.title}</h3>
            <p className="text-sm text-brand-ink-soft">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
