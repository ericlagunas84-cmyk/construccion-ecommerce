import { prisma } from "@/lib/prisma";
import { approveReview, deleteReview } from "@/lib/actions/reviews";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-brand-orange">
      {"★".repeat(rating)}
      <span className="text-brand-line">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default async function AdminResenasPage() {
  const reviews = await prisma.review.findMany({
    orderBy: [{ approved: "asc" }, { createdAt: "desc" }],
    include: { product: true },
  });
  const pending = reviews.filter((r: (typeof reviews)[number]) => !r.approved);
  const approved = reviews.filter((r: (typeof reviews)[number]) => r.approved);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-brand-ink">Reseñas</h1>
      <p className="mb-6 text-sm text-brand-ink-soft">
        {pending.length} pendiente{pending.length !== 1 ? "s" : ""} de aprobar · {approved.length} publicada{approved.length !== 1 ? "s" : ""}
      </p>

      {pending.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-orange">
            Pendientes de aprobar
          </h2>
          <div className="space-y-4">
            {pending.map((r: (typeof reviews)[number]) => (
              <div key={r.id} className="rounded-lg border border-brand-orange/40 bg-orange-50/30 p-5">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-brand-ink">{r.customerName}</span>
                    <span className="ml-2 text-xs text-brand-ink-soft">{r.customerEmail}</span>
                  </div>
                  <Stars rating={r.rating} />
                </div>
                <p className="mb-1 text-xs text-brand-ink-soft">
                  Producto: <span className="font-medium text-brand-ink">{r.product.name}</span>
                </p>
                <p className="mb-3 text-sm text-brand-ink-soft">{r.comment}</p>
                <div className="flex gap-3">
                  <form action={approveReview.bind(null, r.id)}>
                    <button className="rounded-md bg-emerald-600 px-4 py-1.5 text-xs font-semibold uppercase text-white hover:bg-emerald-700">
                      Aprobar
                    </button>
                  </form>
                  <form action={deleteReview.bind(null, r.id)}>
                    <button className="rounded-md border border-red-300 px-4 py-1.5 text-xs font-semibold uppercase text-red-600 hover:bg-red-50">
                      Rechazar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-ink">
        Publicadas
      </h2>
      {approved.length === 0 ? (
        <p className="text-sm text-brand-ink-soft">Todavía no hay reseñas publicadas.</p>
      ) : (
        <div className="space-y-4">
          {approved.map((r: (typeof reviews)[number]) => (
            <div key={r.id} className="rounded-lg border border-brand-line bg-white p-5">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-brand-ink">{r.customerName}</span>
                <Stars rating={r.rating} />
              </div>
              <p className="mb-1 text-xs text-brand-ink-soft">
                Producto: <span className="font-medium text-brand-ink">{r.product.name}</span>
              </p>
              <p className="mb-3 text-sm text-brand-ink-soft">{r.comment}</p>
              <form action={deleteReview.bind(null, r.id)}>
                <button className="text-xs font-medium text-red-600 hover:underline">Eliminar</button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
