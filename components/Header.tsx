"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/cart-context";

const productCategories = [
  { label: "Polvos", href: "/catalogo?cat=polvos" },
  { label: "Herramientas", href: "/catalogo?cat=herramientas" },
  { label: "Epóxicos", href: "/catalogo?cat=epoxicos" },
  { label: "Impermeabilizantes", href: "/catalogo?cat=impermeabilizantes" },
];

export default function Header() {
  const { count } = useCart();
  const { data: session, status } = useSession();
  const [productsOpen, setProductsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-line bg-brand-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-epoxy-depot.png" alt="Epoxy Depot" className="h-10 w-auto" />
        </Link>

        <nav className="hidden flex-1 items-center gap-6 whitespace-nowrap text-sm font-bold text-brand-ink lg:flex">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProductsOpen((v) => !v)}
              className="flex items-center gap-1.5 hover:text-brand-blue"
            >
              Productos
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                className={`transition-transform ${productsOpen ? "rotate-180" : ""}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {productsOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 rounded-md border border-brand-line bg-white py-2 shadow-lg">
                {productCategories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setProductsOpen(false)}
                    className="block px-4 py-2.5 text-sm font-bold text-brand-ink hover:bg-brand-blue-light hover:text-brand-blue"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/quienes-somos" className="hover:text-brand-blue">Quiénes somos</Link>
          <Link href="/contacto" className="hover:text-brand-blue">Contacto</Link>
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
          className="hidden items-center gap-1.5 text-sm font-bold text-brand-ink hover:text-brand-blue lg:flex"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          {status === "authenticated" ? session.user?.name?.split(" ")[0] : "Iniciar sesión"}
        </Link>

        <a
          href="https://wa.me/524771395384"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escríbenos por WhatsApp"
          className="hidden items-center gap-2 rounded-md bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1ebe5a] lg:flex"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.6 6.3A8.9 8.9 0 0 0 3.7 16.9L2.7 21l4.2-1.1a8.9 8.9 0 0 0 4.3 1.1h0a8.9 8.9 0 0 0 6.4-15.2ZM11.2 19.5h0a7.4 7.4 0 0 1-3.8-1l-.3-.2-2.5.6.6-2.4-.2-.3a7.4 7.4 0 1 1 13.7-3.9 7.4 7.4 0 0 1-7.5 7.2Zm4-5.5c-.2-.1-1.3-.6-1.5-.7-.2-.1-.3-.1-.5.1s-.6.7-.7.9-.3.1-.5 0a6.1 6.1 0 0 1-1.8-1.1 6.7 6.7 0 0 1-1.2-1.6c-.1-.2 0-.3.1-.5l.3-.4a1.4 1.4 0 0 0 .2-.3.5.5 0 0 0 0-.4c-.1-.1-.5-1.2-.7-1.7s-.4-.3-.5-.3h-.4a.9.9 0 0 0-.6.3 2.5 2.5 0 0 0-.8 1.9 4.4 4.4 0 0 0 .9 2.3 10 10 0 0 0 3.9 3.5c.5.2 1 .4 1.3.5a3.1 3.1 0 0 0 1.4.1 2.3 2.3 0 0 0 1.5-1.1 1.8 1.8 0 0 0 .1-1.1c-.1-.1-.2-.1-.5-.3Z" />
          </svg>
          WhatsApp
        </a>

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
