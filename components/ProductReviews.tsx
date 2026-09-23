"use client";

import { useState } from "react";
import { submitReview } from "@/lib/actions/reviews";

type Review = {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: Date;
};

function Stars({ rating, size = "text-base" }: { rating: number; size?: string }) {
  return (
    <span className={`text-brand-orange ${size}`}>
      {"★".repeat(rating)}
      <span className="text-brand-line">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default function ProductReviews({
  productSlug,
  reviews,
}: {
  productSlug: string;
  reviews: Review[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const average =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  async function handleSubmit(formData: FormData) {
    setError("");
    setSending(true);
    try {
      await submitReview({
        productSlug,
        customerName: String(formData.get("customerName") ?? ""),
        customerEmail: String(formData.get("customerEmail") ?? ""),
        rating,
        comment: String(formData.get("comment") ?? ""),
        website: String(formData.get("website") ?? ""),
      });
      setSent(true);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar tu reseña.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-16 border-t border-brand-line pt-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-brand-ink">Reseñas de clientes</h2>
          {reviews.length > 0 ? (
            <p className="mt-1 flex items-center gap-2 text-sm text-brand-ink-soft">
              <Stars rating={Math.round(average)} />
              {average.toFixed(1)} de 5 · {reviews.length} reseña{reviews.length !== 1 ? "s" : ""}
            </p>
          ) : (
            <p className="mt-1 text-sm text-brand-ink-soft">Todavía no hay reseñas para este producto.</p>
          )}
        </div>
        {!showForm && !sent && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-md border border-brand-line px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-brand-ink transition hover:border-brand-blue hover:text-brand-blue"
          >
            Escribir reseña
          </button>
        )}
      </div>

      {sent && (
        <div className="mb-8 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Gracias por tu reseña. Se publicará en cuanto la revisemos.
        </div>
      )}

      {showForm && (
        <form action={handleSubmit} className="mb-10 max-w-lg space-y-3 rounded-lg border border-brand-line bg-white p-5">
          {/* Campo señuelo anti-spam: invisible para personas, atractivo para bots */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Calificación</label>
            <div className="flex gap-1 text-2xl">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setRating(n)}
                  className={n <= rating ? "text-brand-orange" : "text-brand-line"}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Nombre</label>
            <input name="customerName" required className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Correo</label>
            <input name="customerEmail" type="email" required className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Comentario</label>
            <textarea name="comment" required rows={3} className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
          </div>
          {error && <p className="text-xs font-medium text-red-600">{error}</p>}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={sending}
              className="rounded-md bg-brand-orange px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark disabled:opacity-50"
            >
              {sending ? "Enviando…" : "Enviar reseña"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-xs font-medium text-brand-ink-soft hover:text-brand-ink"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {reviews.length > 0 && (
        <div className="space-y-5">
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-brand-line pb-5">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium text-brand-ink">{r.customerName}</span>
                <span className="text-xs text-brand-ink-soft">
                  {r.createdAt.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
              </div>
              <Stars rating={r.rating} size="text-sm" />
              <p className="mt-2 text-sm text-brand-ink-soft">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
