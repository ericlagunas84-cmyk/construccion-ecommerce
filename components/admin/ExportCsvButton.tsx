"use client";

import { useState } from "react";

// Botón genérico para descargar cualquier export CSV del panel. Recibe la
// Server Action que arma los datos (siempre devuelve { csv, filename }) y
// aquí, en el cliente, se antepone el BOM de UTF-8 para que Excel abra los
// acentos correctamente en vez de mostrar caracteres corruptos.
export default function ExportCsvButton({
  action,
}: {
  action: () => Promise<{ csv: string; filename: string }>;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const { csv, filename } = await action();
      const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-md border border-brand-line px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-brand-ink-soft transition hover:border-brand-blue hover:text-brand-blue disabled:opacity-50"
    >
      {loading ? "Generando…" : "Exportar CSV"}
    </button>
  );
}
