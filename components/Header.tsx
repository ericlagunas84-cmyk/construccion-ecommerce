"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/cart-context";

const productCategories = [
  { label: "Densificadores, Selladores y Limpieza", href: "/catalogo?cat=densificadores-limpieza" },
  { label: "Recubrimientos y Adhesivos Epóxicos", href: "/catalogo?cat=recubrimientos-epoxicos" },
  { label: "Pigmentos", href: "/catalogo?cat=pigmentos" },
  { label: "Autonivelantes", href: "/catalogo?cat=autonivelantes" },
  { label: "Uretanos y Poliaspárticos", href: "/catalogo?cat=uretanos-poliaspartico" },
  { label: "Primarios", href: "/catalogo?cat=primarios" },
  { label: "Juntas, Sellado y Anclaje", href: "/catalogo?cat=juntas-sellado-anclaje" },
];

const WhatsAppIcon = ({ className = "" }: { className?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.6 6.3A8.9 8.9 0 0 0 3.7 16.9L2.7 21l4.2-1.1a8.9 8.9 0 0 0 4.3 1.1h0a8.9 8.9 0 0 0 6.4-15.2ZM11.2 19.5h0a7.4 7.4 0 0 1-3.8-1l-.3-.2-2.5.6.6-2.4-.2-.3a7.4 7.4 0 1 1 13.7-3.9 7.4 7.4 0 0 1-7.5 7.2Zm4-5.5c-.2-.1-1.3-.6-1.5-.7-.2-.1-.3-.1-.5.1s-.6.7-.7.9-.3.1-.5 0a6.1 6.1 0 0 1-1.8-1.1 6.7 6.7 0 0 1-1.2-1.6c-.1-.2 0-.3.1-.5l.3-.4a1.4 1.4 0 0 0 .2-.3.5.5 0 0 0 0-.4c-.1-.1-.5-1.2-.7-1.7s-.4-.3-.5-.3h-.4a.9.9 0 0 0-.6.3 2.5 2.5 0 0 0-.8 1.9 4.4 4.4 0 0 0 .9 2.3 10 10 0 0 0 3.9 3.5c.5.2 1 .4 1.3.5a3.1 3.1 0 0 0 1.4.1 2.3 2.3 0 0 0 1.5-1.1 1.8 1.8 0 0 0 .1-1.1c-.1-.1-.2-.1-.5-.3Z" />
  </svg>
);

export default function Header() {
  const { count } = useCart();
  const { data: session, status } = useSession();
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Cierra el menú móvil automáticamente si la pantalla crece a escritorio.
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
        setMobileProductsOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-line bg-brand-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-epoxy-depot.png" alt="Epoxy Depot" className="h-10 w-auto" />
        </Link>

        {/* Navegación de escritorio */}
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
              <div className="absolute left-0 top-full mt-2 w-72 rounded-md border border-brand-line bg-white py-2 shadow-lg">
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

        {/* Buscador de escritorio */}
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
          <WhatsAppIcon />
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

        {/* Botón de menú — solo visible en móvil/tablet */}
        <button
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileMenuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-brand-line lg:hidden"
        >
          {mobileMenuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Panel de menú móvil */}
      {mobileMenuOpen && (
        <div className="border-t border-brand-line bg-white px-6 py-5 lg:hidden">
          <div className="mb-5 flex items-center rounded-md border border-brand-line px-3 py-2.5">
            <svg width="16" height="16" viewBox="0 0 24 24" className="mr-2 shrink-0 text-brand-ink-soft" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              placeholder="Buscar por nombre, SKU o marca…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-brand-ink-soft"
            />
          </div>

          <nav className="flex flex-col gap-1 text-sm font-bold text-brand-ink">
            <button
              onClick={() => setMobileProductsOpen((v) => !v)}
              className="flex items-center justify-between rounded-md px-2 py-3 text-left hover:bg-brand-blue-light"
            >
              Productos
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                className={`transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {mobileProductsOpen && (
              <div className="mb-2 ml-2 flex flex-col gap-1 border-l border-brand-line pl-3">
                {productCategories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-md px-2 py-2 font-medium text-brand-ink-soft hover:bg-brand-blue-light hover:text-brand-blue"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}

            <Link
              href="/quienes-somos"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-2 py-3 hover:bg-brand-blue-light"
            >
              Quiénes somos
            </Link>
            <Link
              href="/contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-2 py-3 hover:bg-brand-blue-light"
            >
              Contacto
            </Link>
            <Link
              href={status === "authenticated" ? "/cuenta" : "/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 rounded-md px-2 py-3 hover:bg-brand-blue-light"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              {status === "authenticated" ? session.user?.name?.split(" ")[0] : "Iniciar sesión"}
            </Link>
          </nav>

          <a
            href="https://wa.me/524771395384"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-md bg-[#25D366] py-3 text-sm font-bold text-white transition hover:bg-[#1ebe5a]"
          >
            <WhatsAppIcon />
            Escríbenos por WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
