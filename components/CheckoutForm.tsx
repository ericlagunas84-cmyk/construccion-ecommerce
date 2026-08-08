"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import { money } from "@/lib/format";
import { estadosMx } from "@/lib/mock-data";
import type { Sucursal } from "@/lib/types";
import { createOrder } from "@/lib/actions/checkout";

const SHIPPING_FLAT = 149;
const FREE_SHIPPING_THRESHOLD = 1500;

type DeliveryMethod = "domicilio" | "sucursal";

export default function CheckoutForm({ sucursales }: { sucursales: Sucursal[] }) {
  const { items, subtotal, clear } = useCart();
  const { data: session } = useSession();
  const [method, setMethod] = useState<DeliveryMethod>("domicilio");
  const [sucursal, setSucursal] = useState(sucursales[0]?.id ?? "");
  const [placed, setPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const shipping = method === "sucursal" ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);

    // Campo trampa para bots — si viene lleno, se ignora el envío en
    // silencio, sin mostrar error (para no delatar la protección).
    if (String(form.get("website") ?? "")) return;

    setSubmitting(true);
    try {
      const result = await createOrder({
        items,
        subtotal,
        shipping,
        total,
        contact: {
          name: String(form.get("name") ?? ""),
          lastName: String(form.get("lastName") ?? ""),
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? ""),
        },
        deliveryMethod: method,
        address:
          method === "domicilio"
            ? {
                street: String(form.get("street") ?? ""),
                colonia: String(form.get("colonia") ?? ""),
                city: String(form.get("city") ?? ""),
                state: String(form.get("state") ?? ""),
                postalCode: String(form.get("postalCode") ?? ""),
              }
            : undefined,
        sucursalId: method === "sucursal" ? sucursal : undefined,
      });
      setOrderNumber(result.orderNumber);
      setPlaced(true);
      clear();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos procesar tu pedido. Inténtalo de nuevo."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (placed) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-lg px-6 py-24 text-center">
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h1 className="mb-3 text-2xl font-bold text-brand-ink">¡Pedido recibido!</h1>
          <p className="mb-2 font-mono text-sm text-brand-ink">Folio: {orderNumber}</p>
          <p className="mb-8 text-sm text-brand-ink-soft">
            Tu pedido ya quedó guardado y aparece en el panel administrativo con estado
            "Pendiente". La confirmación de pago real con Mercado Pago y el correo automático
            se conectan en el siguiente paso — por ahora el pedido queda listo para que un
            administrador lo procese manualmente.
          </p>
          <Link
            href="/"
            className="inline-block rounded-md bg-brand-orange px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark"
          >
            Volver al inicio
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-lg px-6 py-24 text-center">
          <p className="mb-5 text-sm text-brand-ink-soft">Tu carrito está vacío.</p>
          <Link
            href="/catalogo"
            className="inline-block rounded-md bg-brand-orange px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark"
          >
            Ver catálogo
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-8 text-3xl font-bold text-brand-ink">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid gap-10 md:grid-cols-[1fr_320px]">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />
          <div className="space-y-8">
            {/* Datos de contacto */}
            <fieldset>
              <legend className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-ink">
                Datos de contacto
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre" name="name" defaultValue={session?.user?.name?.split(" ")[0]} required />
                <Field label="Apellidos" name="lastName" defaultValue={session?.user?.name?.split(" ").slice(1).join(" ")} required />
                <Field label="Correo" name="email" type="email" defaultValue={session?.user?.email ?? undefined} required />
                <Field label="Teléfono" name="phone" type="tel" required />
              </div>
            </fieldset>

            {/* Método de entrega */}
            <fieldset>
              <legend className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-ink">
                Método de entrega
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setMethod("domicilio")}
                  className={`rounded-md border px-4 py-3 text-left text-sm transition ${
                    method === "domicilio" ? "border-brand-blue bg-brand-blue-light" : "border-brand-line hover:border-brand-blue"
                  }`}
                >
                  <span className="block font-semibold text-brand-ink">Envío a domicilio</span>
                  <span className="text-xs text-brand-ink-soft">
                    {subtotal >= FREE_SHIPPING_THRESHOLD ? "Gratis" : money(SHIPPING_FLAT)} · 24–48 h
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("sucursal")}
                  className={`rounded-md border px-4 py-3 text-left text-sm transition ${
                    method === "sucursal" ? "border-brand-blue bg-brand-blue-light" : "border-brand-line hover:border-brand-blue"
                  }`}
                >
                  <span className="block font-semibold text-brand-ink">Recoger en sucursal</span>
                  <span className="text-xs text-brand-ink-soft">Gratis · listo en 2 horas</span>
                </button>
              </div>

              {method === "domicilio" ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="Dirección" name="street" className="sm:col-span-2" required />
                  <Field label="Colonia" name="colonia" required />
                  <Field label="Ciudad" name="city" required />
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Estado</label>
                    <select name="state" required className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none">
                      {estadosMx.map((e) => (
                        <option key={e}>{e}</option>
                      ))}
                    </select>
                  </div>
                  <Field label="Código postal" name="postalCode" required />
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {sucursales.map((s) => (
                    <label
                      key={s.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-md border px-4 py-3 text-sm transition ${
                        sucursal === s.id ? "border-brand-blue bg-brand-blue-light" : "border-brand-line hover:border-brand-blue"
                      }`}
                    >
                      <input
                        type="radio"
                        name="sucursalRadio"
                        checked={sucursal === s.id}
                        onChange={() => setSucursal(s.id)}
                        className="mt-1 h-4 w-4 text-brand-blue focus:ring-brand-blue"
                      />
                      <div>
                        <span className="block font-semibold text-brand-ink">{s.name}</span>
                        <span className="text-xs text-brand-ink-soft">{s.address} · {s.hours}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </fieldset>

            <fieldset>
              <legend className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-ink">
                Método de pago
              </legend>
              <div className="rounded-md border border-brand-line px-4 py-3 text-sm text-brand-ink-soft">
                Tarjeta, transferencia o efectivo vía Mercado Pago — se habilita en el siguiente
                paso. Por ahora el pedido se guarda con estado "Pendiente" para procesarlo
                manualmente desde el panel.
              </div>
            </fieldset>
          </div>

          {/* Resumen */}
          <aside className="h-max rounded-lg border border-brand-line p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-ink">
              Tu pedido
            </h2>
            <ul className="mb-4 space-y-2 border-b border-brand-line pb-4 text-sm">
              {items.map((i) => (
                <li key={i.sku} className="flex justify-between text-brand-ink-soft">
                  <span>{i.qty} × {i.name}</span>
                  <span className="font-mono">{money(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-b border-brand-line pb-4 text-sm">
              <div className="flex justify-between text-brand-ink-soft">
                <span>Subtotal</span>
                <span className="font-mono">{money(subtotal)}</span>
              </div>
              <div className="flex justify-between text-brand-ink-soft">
                <span>Envío</span>
                <span className="font-mono">{shipping === 0 ? "Gratis" : money(shipping)}</span>
              </div>
            </div>
            <div className="flex justify-between py-4 text-base font-semibold text-brand-ink">
              <span>Total</span>
              <span className="font-mono">{money(total)}</span>
            </div>

            {error && <p className="mb-3 text-xs font-medium text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-brand-orange py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark disabled:opacity-60"
            >
              {submitting ? "Procesando…" : "Realizar compra"}
            </button>
          </aside>
        </form>
      </main>
      <Footer />
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  className = "",
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  className?: string;
  defaultValue?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none"
      />
    </div>
  );
}
