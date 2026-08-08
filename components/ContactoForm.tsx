"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Sucursal } from "@/lib/types";
import { submitContactMessage } from "@/lib/actions/contact";

export default function ContactoForm({ sucursales }: { sucursales: Sucursal[] }) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      await submitContactMessage({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        message: String(form.get("message") ?? ""),
      });
      setSent(true);
    } catch {
      setError("No pudimos enviar tu mensaje. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-14">
        <div className="mb-10">
          <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-brand-orange">
            Contacto
          </span>
          <h1 className="text-3xl font-700 text-brand-ink">Escríbenos</h1>
          <p className="mt-2 max-w-lg text-sm text-brand-ink-soft">
            ¿Dudas sobre un producto o tu pedido? Responde nuestro equipo, no un bot.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          {/* Formulario */}
          <div>
            {sent ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-800">
                Gracias por escribirnos. Te respondemos en menos de 24 horas hábiles.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Nombre</label>
                  <input name="name" required className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Correo</label>
                  <input name="email" type="email" required className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Teléfono</label>
                  <input name="phone" type="tel" className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Mensaje</label>
                  <textarea name="message" required rows={5} className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
                </div>
                {error && <p className="text-xs font-medium text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-brand-orange px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark disabled:opacity-60"
                >
                  {submitting ? "Enviando…" : "Enviar mensaje"}
                </button>
              </form>
            )}
          </div>

          {/* Datos + mapa */}
          <div>
            <div className="mb-6 flex aspect-[4/3] items-center justify-center rounded-lg bg-brand-blue-light text-xs font-mono text-brand-ink-soft">
              mapa — Paseo de las Liebres 404
            </div>

            <div className="space-y-5 text-sm">
              <div>
                <p className="font-semibold text-brand-ink">Teléfono</p>
                <p className="text-brand-ink-soft">+800 400 8000</p>
              </div>
              <div>
                <p className="font-semibold text-brand-ink">WhatsApp</p>
                <p className="text-brand-ink-soft">+52 477 139 5384</p>
              </div>
              <div>
                <p className="font-semibold text-brand-ink">Horario</p>
                <p className="text-brand-ink-soft">Lun–Sáb 8:00–19:00</p>
              </div>
              <div>
                <p className="mb-2 font-semibold text-brand-ink">Sucursales</p>
                <ul className="space-y-2 text-brand-ink-soft">
                  {sucursales.map((s) => (
                    <li key={s.id}>
                      <span className="font-medium text-brand-ink">{s.name}</span> — {s.address}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 font-semibold text-brand-ink">Redes sociales</p>
                <div className="flex gap-3">
                  {["Facebook", "Instagram", "WhatsApp"].map((r) => (
                    <span key={r} className="rounded-md border border-brand-line px-3 py-1.5 text-xs text-brand-ink-soft">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
