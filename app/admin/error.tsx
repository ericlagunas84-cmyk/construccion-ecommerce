"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-blue-light px-6 text-center">
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-brand-orange">
        Error en el panel
      </p>
      <h1 className="mb-3 text-2xl font-bold text-brand-ink">Algo salió mal</h1>
      <p className="mb-6 max-w-sm text-sm text-brand-ink-soft">
        {error.message || "No pudimos completar la acción. Intenta de nuevo."}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-brand-orange px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark"
        >
          Intentar de nuevo
        </button>
        <a
          href="/admin"
          className="rounded-md border border-brand-blue px-6 py-3 text-sm font-semibold uppercase tracking-wide text-brand-blue transition hover:bg-white"
        >
          Ir al Dashboard
        </a>
      </div>
    </div>
  );
}
