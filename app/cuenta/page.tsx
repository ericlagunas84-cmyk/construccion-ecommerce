import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/format";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignOutButton from "@/components/SignOutButton";

const statusLabel: Record<string, string> = {
  PENDIENTE: "Pendiente",
  PAGADO: "Pagado",
  PREPARANDO: "Preparando",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export default async function CuentaPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { customer: { include: { orders: { include: { items: { include: { product: true } } }, orderBy: { createdAt: "desc" } } } } },
  });

  const orders = user?.customer?.orders ?? [];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-14">
        <div className="mb-10 flex items-start justify-between">
          <div>
            <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-brand-orange">
              Mi cuenta
            </span>
            <h1 className="text-2xl font-bold text-brand-ink">{user?.name}</h1>
            <p className="text-sm text-brand-ink-soft">{user?.email}</p>
          </div>
          <SignOutButton />
        </div>

        <h2 className="mb-4 text-lg font-bold text-brand-ink">Historial de pedidos</h2>

        {orders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-brand-line py-16 text-center text-sm text-brand-ink-soft">
            Todavía no tienes pedidos.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o: (typeof orders)[number]) => (
              <div key={o.id} className="rounded-lg border border-brand-line bg-white p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-sm font-semibold text-brand-ink">{o.number}</span>
                    <span className="ml-3 rounded bg-brand-blue-light px-2 py-0.5 text-xs font-medium text-brand-blue">
                      {statusLabel[o.status] ?? o.status}
                    </span>
                  </div>
                  <span className="text-xs text-brand-ink-soft">
                    {o.createdAt.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                </div>
                <ul className="mb-3 space-y-1 text-sm text-brand-ink-soft">
                  {o.items.map((i: (typeof o.items)[number]) => (
                    <li key={i.id}>{i.qty} × {i.product.name}</li>
                  ))}
                </ul>
                <p className="text-right font-mono text-sm font-semibold text-brand-ink">{money(Number(o.total))}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
