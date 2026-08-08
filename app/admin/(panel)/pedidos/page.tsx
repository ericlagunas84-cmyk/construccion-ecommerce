import { prisma } from "@/lib/prisma";
import { money } from "@/lib/format";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export default async function AdminPedidosPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true, sucursal: true, items: { include: { product: true } } },
  });

  return (
    <div>
      <h1 className="mb-1 text-2xl font-700 text-brand-ink">Pedidos</h1>
      <p className="mb-6 text-sm text-brand-ink-soft">{orders.length} pedidos totales</p>

      <div className="overflow-x-auto rounded-lg border border-brand-line bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-line bg-brand-blue-light/40 text-left text-xs text-brand-ink-soft">
              <th className="px-4 py-3 font-medium">Folio</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Productos</th>
              <th className="px-4 py-3 font-medium">Entrega</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-line">
            {orders.map((o: (typeof orders)[number]) => (
              <tr key={o.id}>
                <td className="px-4 py-3 font-mono text-xs font-medium text-brand-ink">{o.number}</td>
                <td className="px-4 py-3 text-brand-ink-soft">{o.customer.name}</td>
                <td className="px-4 py-3 text-brand-ink-soft">
                  {o.createdAt.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3 text-brand-ink-soft">
                  {o.items.map((i: (typeof o.items)[number]) => `${i.qty}× ${i.product.name}`).join(", ")}
                </td>
                <td className="px-4 py-3 text-brand-ink-soft">
                  {o.deliveryMethod === "DOMICILIO" ? "Domicilio" : o.sucursal?.name ?? "Sucursal"}
                </td>
                <td className="px-4 py-3 font-mono text-brand-ink-soft">{money(Number(o.total))}</td>
                <td className="px-4 py-3">
                  <OrderStatusSelect orderId={o.id} status={o.status} />
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-brand-ink-soft">
                  Todavía no hay pedidos. Aparecerán aquí en cuanto se conecte Mercado Pago y
                  empiecen a llegar compras reales.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
