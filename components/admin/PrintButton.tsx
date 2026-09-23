"use client";

// Botón simple que dispara el diálogo de impresión del navegador — así el
// recibo se puede imprimir o guardar como PDF directo desde la vista.
export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-md bg-brand-orange px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark"
    >
      Imprimir / Guardar PDF
    </button>
  );
}
