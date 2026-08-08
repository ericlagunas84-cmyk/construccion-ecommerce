"use client";

import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

export default function AdminTopbar({ user }: { user: Session["user"] }) {
  return (
    <header className="flex items-center justify-end gap-4 border-b border-brand-line bg-white px-8 py-4">
      <div className="text-right">
        <p className="text-sm font-medium text-brand-ink">{user?.name}</p>
        <p className="text-xs text-brand-ink-soft">
          {(user as { role?: string })?.role === "ADMIN" ? "Administrador" : "Empleado"}
        </p>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="rounded-md border border-brand-line px-3 py-2 text-xs font-medium text-brand-ink-soft transition hover:border-brand-blue hover:text-brand-blue"
      >
        Cerrar sesión
      </button>
    </header>
  );
}
