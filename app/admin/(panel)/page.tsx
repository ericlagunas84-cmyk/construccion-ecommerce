import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/format";

async function getStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    salesToday,
    salesMonth,
    pendingOrders,
    totalCustomers,
    outOfStock,
    lowStock,
    pendingReviews,
    unreadMessages,
    bestSellers,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: today }, status: { not: "CANCELADO" } },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: monthStart }, status: { not: "CANCELADO" } },
    }),
    prisma.order.count({ where: { status: "PENDIENTE" } }),
    prisma.customer.count(),
    prisma.product.count({ where: { availability: "AGOTADO" } }),
    prisma.product.findMany({
      where: { availability: "POCAS_PIEZAS", visible: true },
      orderBy: { stock: "asc" },
      select: { name: true, sku: true, stock: true },
      take: 8,
    }),
    prisma.review.count({ where: { approved: false } }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.product.findMany({
      orderBy: { soldCount: "desc" },
      take: 5,
      select: { name: true, sku: true, soldCount: true, price: true },
    }),
  ]);

  return {
    salesToday: Number(salesToday._sum.total ?? 0),
    salesMonth: Number(salesMonth._sum.total ?? 0),
    pendingOrders,
    totalCustomers,
    outOfStock,
    lowStock,
    pendingReviews,
    unreadMessages,
    bestSellers,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Ventas del día", value: money(stats.salesToday) },
    { label: "Ventas del mes", value: money(stats.salesMonth) },
    { label: "Pedidos pendientes", value: stats.pendingOrders, href: "/admin/pedidos" },
    { label: "Clientes registrados", value: stats.totalCustomers, href: "/admin/clientes" },
    { label: "Productos agotados", value: stats.outOfStock, href: "/admin/productos" },
  ];

  const alerts = [
    stats.pendingReviews > 0 && {
      text: `${stats.pendingReviews} reseña${stats.pendingReviews !== 1 ? "s" : ""} pendiente${stats.pendingReviews !== 1 ? "s" : ""} de aprobar`,
      href: "/admin/resenas",
    },
    stats.unreadMessages > 0 && {
      text: `${stats.unreadMessages} mensaje${stats.unreadMessages !== 1 ? "s" : ""} sin leer`,
      href: "/admin/mensajes",
    },
  ].filter(Boolean) as { text: string; href: string }[];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-ink">Dashboard</h1>

      {alerts.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-3">
          {alerts.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="rounded-md bg-orange-50 px-4 py-2 text-sm font-medium text-brand-orange hover:bg-orange-100"
            >
              ⚠️ {a.text}
            </Link>
          ))}
        </div>
      )}

      <div className="mb-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) =>
          c.href ? (
            <Link key={c.label} href={c.href} className="rounded-lg border border-brand-line bg-white p-5 transition hover:border-brand-blue">
              <p className="mb-1 text-xs font-medium text-brand-ink-soft">{c.label}</p>
              <p className="font-mono text-xl font-medium text-brand-ink">{c.value}</p>
            </Link>
          ) : (
            <div key={c.label} className="rounded-lg border border-brand-line bg-white p-5">
              <p className="mb-1 text-xs font-medium text-brand-ink-soft">{c.label}</p>
              <p className="font-mono text-xl font-medium text-brand-ink">{c.value}</p>
            </div>
          )
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-brand-line bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-ink">
            Productos más vendidos
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-line text-left text-xs text-brand-ink-soft">
                <th className="pb-2 font-medium">Producto</th>
                <th className="pb-2 font-medium">SKU</th>
                <th className="pb-2 font-medium">Precio</th>
                <th className="pb-2 text-right font-medium">Vendidos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-line">
              {stats.bestSellers.map((p: (typeof stats.bestSellers)[number]) => (
                <tr key={p.sku}>
                  <td className="py-2.5 font-medium text-brand-ink">{p.name}</td>
                  <td className="py-2.5 font-mono text-xs text-brand-ink-soft">{p.sku}</td>
                  <td className="py-2.5 font-mono text-brand-ink-soft">{money(Number(p.price))}</td>
                  <td className="py-2.5 text-right font-mono text-brand-ink-soft">{p.soldCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-brand-line bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-ink">
            Stock bajo — reabastecer pronto
          </h2>
          {stats.lowStock.length === 0 ? (
            <p className="text-sm text-brand-ink-soft">Ningún producto con stock bajo por ahora.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-line text-left text-xs text-brand-ink-soft">
                  <th className="pb-2 font-medium">Producto</th>
                  <th className="pb-2 font-medium">SKU</th>
                  <th className="pb-2 text-right font-medium">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-line">
                {stats.lowStock.map((p: (typeof stats.lowStock)[number]) => (
                  <tr key={p.sku}>
                    <td className="py-2.5 font-medium text-brand-ink">{p.name}</td>
                    <td className="py-2.5 font-mono text-xs text-brand-ink-soft">{p.sku}</td>
                    <td className="py-2.5 text-right font-mono font-semibold text-brand-orange">{p.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
