"use client";

import Link from "next/link";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Deja un rastro en los logs de Vercel (Runtime Logs) para poder
    // diagnosticar qué pasó, sin exponer detalles técnicos al visitante.
    console.error(error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <span className="mb-3 font-mono text-xs uppercase tracking-widest text-brand-orange">
          Algo salió mal
        </span>
        <h1 className="mb-3 text-3xl font-bold text-brand-ink">Ocurrió un error</h1>
        <p className="mb-8 text-sm text-brand-ink-soft">
          No pudimos completar tu solicitud. Puedes intentarlo de nuevo, o volver al inicio si el
          problema sigue.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-md bg-brand-orange px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="rounded-md border border-brand-blue px-6 py-3 text-sm font-semibold uppercase tracking-wide text-brand-blue transition hover:bg-brand-blue-light"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
