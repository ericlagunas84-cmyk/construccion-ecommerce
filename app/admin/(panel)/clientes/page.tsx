import { prisma } from "@/lib/prisma";
import { money } from "@/lib/format";

export default async function AdminClientesPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: { orders: true, addresses: true },
  });

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-brand-ink">Clientes</h1>
      <p className="mb-6 text-sm text-brand-ink-soft">{customers.length} clientes registrados</p>

      <div className="overflow-x-auto rounded-lg border border-brand-line bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-line bg-brand-blue-light/40 text-left text-xs text-brand-ink-soft">
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Correo</th>
              <th className="px-4 py-3 font-medium">Teléfono</th>
              <th className="px-4 py-3 font-medium">Direcciones</th>
              <th className="px-4 py-3 font-medium">Pedidos</th>
              <th className="px-4 py-3 font-medium">Total comprado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-line">
            {customers.map((c: (typeof customers)[number]) => {
              const totalSpent = c.orders
                .filter((o: (typeof c.orders)[number]) => o.status !== "CANCELADO")
                .reduce((sum: number, o: (typeof c.orders)[number]) => sum + Number(o.total), 0);
              return (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-medium text-brand-ink">{c.name}</td>
                  <td className="px-4 py-3 text-brand-ink-soft">{c.email}</td>
                  <td className="px-4 py-3 text-brand-ink-soft">{c.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-brand-ink-soft">{c.addresses.length}</td>
                  <td className="px-4 py-3 text-brand-ink-soft">{c.orders.length}</td>
                  <td className="px-4 py-3 font-mono text-brand-ink-soft">{money(totalSpent)}</td>
                </tr>
              );
            })}
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-brand-ink-soft">
                  Todavía no hay clientes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
