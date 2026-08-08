"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const faqs = [
  {
    q: "¿A qué partes de México hacen envíos?",
    a: "Hacemos envíos a todo México. El tiempo estimado de entrega a domicilio es de 24 a 48 horas hábiles en zona metropolitana; puede variar según tu ubicación.",
  },
  {
    q: "¿Puedo recoger mi pedido en sucursal?",
    a: "Sí. Al finalizar tu compra puedes elegir \"Recoger en sucursal\" y seleccionar cualquiera de nuestras 3 sucursales. Tu pedido suele estar listo en 2 horas.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Aceptamos tarjetas de crédito y débito, transferencia bancaria, y pago en efectivo en tiendas afiliadas.",
  },
  {
    q: "¿Tienen ficha técnica de sus productos?",
    a: "Sí, los productos que cuentan con ficha técnica muestran un botón de descarga en PDF directo en su página.",
  },
  {
    q: "¿Puedo devolver un producto si no era lo que necesitaba?",
    a: "Sí, tienes hasta 15 días naturales para solicitar una devolución si el producto está sin usar y en su empaque original. Revisa nuestra Política de devoluciones para más detalle.",
  },
  {
    q: "¿Cómo sé si un producto tiene stock disponible?",
    a: "Cada producto muestra su disponibilidad: \"Disponible\", \"Pocas piezas\" o \"Agotado\". Si dice agotado, no podrás agregarlo al carrito hasta que se reabastezca.",
  },
  {
    q: "¿Ofrecen asesoría técnica antes de comprar?",
    a: "Sí, puedes escribirnos por WhatsApp o el formulario de Contacto y te ayudamos a elegir el producto correcto para tu proyecto.",
  },
  {
    q: "¿Tienen precios especiales para compras grandes o de contratista?",
    a: "Contáctanos directamente por WhatsApp o Contacto contándonos tu proyecto — evaluamos cada caso.",
  },
];

export default function PreguntasFrecuentesPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-14">
        <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-brand-orange">
          Ayuda
        </span>
        <h1 className="mb-10 text-3xl font-bold text-brand-ink">Preguntas frecuentes</h1>

        <div className="space-y-3">
          {faqs.map((item, i) => (
            <div key={i} className="rounded-lg border border-brand-line bg-white">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-semibold text-brand-ink">{item.q}</span>
                <svg
                  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className={`shrink-0 text-brand-ink-soft transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {openIndex === i && (
                <p className="border-t border-brand-line px-5 py-4 text-sm text-brand-ink-soft">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
