"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import { money } from "@/lib/format";

const SHIPPING_FLAT = 149;
const FREE_SHIPPING_THRESHOLD = 1500;

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-8 text-3xl font-700 text-brand-ink">Tu carrito</h1>

        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-brand-line py-24 text-center">
            <p className="mb-5 text-sm text-brand-ink-soft">Tu carrito está vacío.</p>
            <Link
              href="/catalogo"
              className="inline-block rounded-md bg-brand-orange px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-[1fr_320px]">
            <div className="divide-y divide-brand-line border-y border-brand-line">
              {items.map((item) => (
                <div key={item.sku} className="flex items-center gap-5 py-5">
                  <Link
                    href={`/producto/${item.slug}`}
                    className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-brand-blue-light text-[10px] font-mono text-brand-ink-soft"
                  >
                    foto
                  </Link>
                  <div className="flex-1">
                    <Link href={`/producto/${item.slug}`} className="text-sm font-semibold text-brand-ink hover:text-brand-blue">
                      {item.name}
                    </Link>
                    <p className="mt-1 font-mono text-xs text-brand-ink-soft">SKU {item.sku}</p>
                    <button
                      onClick={() => removeItem(item.sku)}
                      className="mt-2 text-xs font-medium text-brand-ink-soft underline hover:text-brand-orange"
                    >
                      Eliminar
                    </button>
                  </div>

                  <div className="flex items-center rounded-md border border-brand-line">
                    <button
                      onClick={() => updateQty(item.sku, item.qty - 1)}
                      className="px-3 py-2 text-brand-ink-soft hover:text-brand-ink"
                      aria-label="Disminuir cantidad"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-mono text-sm">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.sku, item.qty + 1)}
                      className="px-3 py-2 text-brand-ink-soft hover:text-brand-ink"
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>

                  <div className="w-24 text-right font-mono text-sm font-medium text-brand-ink">
                    {money(item.price * item.qty)}
                  </div>
                </div>
              ))}

              <div className="py-5">
                <Link href="/catalogo" className="text-sm font-semibold text-brand-blue hover:text-brand-orange">
                  ← Continuar comprando
                </Link>
              </div>
            </div>

            {/* Resumen */}
            <aside className="h-max rounded-lg border border-brand-line p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-ink">
                Resumen del pedido
              </h2>
              <div className="space-y-2 border-b border-brand-line pb-4 text-sm">
                <div className="flex justify-between text-brand-ink-soft">
                  <span>Subtotal</span>
                  <span className="font-mono">{money(subtotal)}</span>
                </div>
                <div className="flex justify-between text-brand-ink-soft">
                  <span>Envío</span>
                  <span className="font-mono">{shipping === 0 ? "Gratis" : money(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-brand-ink-soft">
                    Envío gratis en compras mayores a {money(FREE_SHIPPING_THRESHOLD)}.
                  </p>
                )}
              </div>
              <div className="flex justify-between py-4 text-base font-semibold text-brand-ink">
                <span>Total</span>
                <span className="font-mono">{money(total)}</span>
              </div>
              <Link
                href="/checkout"
                className="block w-full rounded-md bg-brand-orange py-3.5 text-center text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark"
              >
                Finalizar compra
              </Link>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
