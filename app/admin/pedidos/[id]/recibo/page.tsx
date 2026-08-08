import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/format";
import PrintButton from "@/components/admin/PrintButton";

const statusLabel: Record<string, string> = {
  PENDIENTE: "Pendiente",
  PAGADO: "Pagado",
  PREPARANDO: "Preparando",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export default async function ReciboPage({ params }: { params: Promise<{ id: string }> }) {
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
    <div className="mx-auto max-w-2xl bg-white p-10 print:p-0">
      <div className="mb-8 flex items-start justify-between print:hidden">
        <p className="text-sm text-brand-ink-soft">Vista de recibo — lista para imprimir o guardar como PDF</p>
        <PrintButton />
      </div>

      <div className="mb-8 flex items-center justify-between border-b border-brand-line pb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-epoxy-depot.png" alt="Epoxy Depot" className="h-10 w-auto" />
        <div className="text-right">
          <p className="font-mono text-lg font-bold text-brand-ink">{order.number}</p>
          <p className="text-xs text-brand-ink-soft">
            {order.createdAt.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
          <p className="mt-1 text-xs font-medium text-brand-orange">{statusLabel[order.status] ?? order.status}</p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-6 text-sm">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase text-brand-ink-soft">Cliente</p>
          <p className="font-medium text-brand-ink">{order.customer.name}</p>
          <p className="text-brand-ink-soft">{order.customer.email}</p>
          {order.customer.phone && <p className="text-brand-ink-soft">{order.customer.phone}</p>}
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase text-brand-ink-soft">Entrega</p>
          {order.deliveryMethod === "DOMICILIO" ? (
            address ? (
              <p className="text-brand-ink-soft">
                {address.street}, {address.colonia}<br />
                {address.city}, {address.state} {address.postalCode}
              </p>
            ) : (
              <p className="text-brand-ink-soft">Envío a domicilio</p>
            )
          ) : (
            <p className="text-brand-ink-soft">
              Recoger en {order.sucursal?.name}<br />
              {order.sucursal?.address}
            </p>
          )}
        </div>
      </div>

      <table className="mb-6 w-full text-sm">
        <thead>
          <tr className="border-b border-brand-ink text-left">
            <th className="pb-2 font-semibold text-brand-ink">Producto</th>
            <th className="pb-2 text-right font-semibold text-brand-ink">Cant.</th>
            <th className="pb-2 text-right font-semibold text-brand-ink">Precio</th>
            <th className="pb-2 text-right font-semibold text-brand-ink">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item: (typeof order.items)[number]) => (
            <tr key={item.id} className="border-b border-brand-line">
              <td className="py-2 text-brand-ink">{item.product.name}</td>
              <td className="py-2 text-right font-mono text-brand-ink-soft">{item.qty}</td>
              <td className="py-2 text-right font-mono text-brand-ink-soft">{money(Number(item.unitPrice))}</td>
              <td className="py-2 text-right font-mono text-brand-ink-soft">{money(Number(item.unitPrice) * item.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <div className="flex justify-between border-t border-brand-ink pt-1.5 text-base font-bold text-brand-ink">
          <span>Total</span>
          <span className="font-mono">{money(Number(order.total))}</span>
        </div>
      </div>

      <p className="mt-10 border-t border-brand-line pt-4 text-center text-xs text-brand-ink-soft">
        Epoxy Depot · +800 400 8000 · WhatsApp +52 477 139 5384
      </p>
    </div>
  );
}
