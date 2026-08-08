import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/format";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export default async function AdminPedidoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: { include: { addresses: true } },
      sucursal: true,
      coupon: true,
      items: { include: { product: true } },
    },
  });

  if (!order) return notFound();

  const address = order.customer.addresses.find((a: (typeof order.customer.addresses)[number]) => a.isDefault) ?? order.customer.addresses[0];

  return (
    <div className="max-w-3xl">
      <Link href="/admin/pedidos" className="mb-4 inline-block text-xs font-medium text-brand-blue hover:underline">
        ← Volver a pedidos
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-mono text-2xl font-bold text-brand-ink">{order.number}</h1>
          <p className="text-sm text-brand-ink-soft">
            {order.createdAt.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-brand-line bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-ink">Cliente</h2>
          <p className="text-sm font-medium text-brand-ink">{order.customer.name}</p>
          <p className="text-sm text-brand-ink-soft">{order.customer.email}</p>
          {order.customer.phone && <p className="text-sm text-brand-ink-soft">{order.customer.phone}</p>}
        </div>

        <div className="rounded-lg border border-brand-line bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-ink">Entrega</h2>
          {order.deliveryMethod === "DOMICILIO" ? (
            address ? (
              <p className="text-sm text-brand-ink-soft">
                {address.street}, {address.colonia}<br />
                {address.city}, {address.state} {address.postalCode}
              </p>
            ) : (
              <p className="text-sm text-brand-ink-soft">Envío a domicilio (sin dirección registrada)</p>
            )
          ) : (
            <p className="text-sm text-brand-ink-soft">
              Recoger en: <span className="font-medium text-brand-ink">{order.sucursal?.name}</span>
              <br />
              {order.sucursal?.address}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-brand-line bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-line bg-brand-blue-light/40 text-left text-xs text-brand-ink-soft">
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 text-right font-medium">Cantidad</th>
              <th className="px-4 py-3 text-right font-medium">Precio unitario</th>
              <th className="px-4 py-3 text-right font-medium">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-line">
            {order.items.map((item: (typeof order.items)[number]) => (
              <tr key={item.id}>
                <td className="px-4 py-3 font-medium text-brand-ink">{item.product.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-brand-ink-soft">{item.product.sku}</td>
                <td className="px-4 py-3 text-right font-mono text-brand-ink-soft">{item.qty}</td>
                <td className="px-4 py-3 text-right font-mono text-brand-ink-soft">{money(Number(item.unitPrice))}</td>
                <td className="px-4 py-3 text-right font-mono text-brand-ink-soft">{money(Number(item.unitPrice) * item.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t border-brand-line p-5">
          <div className="ml-auto max-w-xs space-y-1.5 text-sm">
            <div className="flex justify-between text-brand-ink-soft">
              <span>Subtotal</span>
              <span className="font-mono">{money(Number(order.subtotal))}</span>
            </div>
            <div className="flex justify-between text-brand-ink-soft">
              <span>Envío</span>
              <span className="font-mono">{Number(order.shipping) === 0 ? "Gratis" : money(Number(order.shipping))}</span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Descuento{order.coupon ? ` (${order.coupon.code})` : ""}</span>
                <span className="font-mono">-{money(Number(order.discount))}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-brand-line pt-1.5 text-base font-semibold text-brand-ink">
              <span>Total</span>
              <span className="font-mono">{money(Number(order.total))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
