"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const { count } = useCart();
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-brand-line bg-brand-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-epoxy-depot.png" alt="Epoxy Depot" className="h-10 w-auto" />
        </Link>

        <nav className="hidden flex-1 items-center gap-6 whitespace-nowrap text-sm font-medium text-brand-ink lg:flex">
          <Link href="/catalogo" className="hover:text-brand-blue">Catálogo</Link>
          <Link href="/catalogo?cat=polvos" className="hover:text-brand-blue">Polvos</Link>
          <Link href="/catalogo?cat=herramientas" className="hover:text-brand-blue">Herramientas</Link>
          <Link href="/catalogo?cat=epoxicos" className="hover:text-brand-blue">Epóxicos</Link>
          <Link href="/catalogo?cat=impermeabilizantes" className="hover:text-brand-blue">Impermeabilizantes</Link>
          <Link href="/quienes-somos" className="hover:text-brand-blue">Quiénes somos</Link>
        </nav>

        <div className="hidden flex-1 max-w-sm items-center rounded-md border border-brand-line px-3 py-2 lg:flex">
          <svg width="16" height="16" viewBox="0 0 24 24" className="mr-2 shrink-0 text-brand-ink-soft" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Buscar por nombre, SKU o marca…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-brand-ink-soft"
          />
        </div>

        <Link
          href={status === "authenticated" ? "/cuenta" : "/login"}
          className="hidden items-center gap-1.5 text-sm font-medium text-brand-ink hover:text-brand-blue lg:flex"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          {status === "authenticated" ? session.user?.name?.split(" ")[0] : "Iniciar sesión"}
        </Link>

        <Link
          href="/carrito"
          aria-label="Carrito de compras"
          className="relative flex h-10 w-10 items-center justify-center rounded-md border border-brand-line hover:border-brand-blue"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
          </svg>
          <span className="absolute -right-1.5 -top-1.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-brand-orange px-1 text-[10px] font-mono font-medium text-white">
            {count}
          </span>
        </Link>
      </div>
    </header>
  );
}
