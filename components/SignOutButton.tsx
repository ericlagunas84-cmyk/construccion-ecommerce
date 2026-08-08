"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-md border border-brand-line px-4 py-2 text-xs font-medium text-brand-ink-soft transition hover:border-brand-blue hover:text-brand-blue"
    >
      Cerrar sesión
    </button>
  );
}
