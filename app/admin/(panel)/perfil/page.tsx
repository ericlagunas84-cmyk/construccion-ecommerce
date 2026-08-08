"use client";

import { useState } from "react";
import { changePassword } from "@/lib/actions/profile";

export default function PerfilPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("La nueva contraseña y su confirmación no coinciden.");
      return;
    }

    setSubmitting(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cambiar la contraseña.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="mb-1 text-2xl font-bold text-brand-ink">Mi perfil</h1>
      <p className="mb-6 text-sm text-brand-ink-soft">Cambia tu contraseña de acceso al panel.</p>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-brand-line bg-white p-6">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Contraseña actual</label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Nueva contraseña</label>
          <input
            type="password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none"
          />
          <p className="mt-1 text-xs text-brand-ink-soft">Mínimo 8 caracteres.</p>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Confirma la nueva contraseña</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none"
          />
        </div>

        {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        {success && <p className="text-xs font-medium text-emerald-700">Contraseña actualizada correctamente.</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-brand-orange py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark disabled:opacity-60"
        >
          {submitting ? "Guardando…" : "Cambiar contraseña"}
        </button>
      </form>
    </div>
  );
}
