import Link from "next/link";

const nav = [
  { href: "/admin", label: "Dashboard", icon: "M3 13h8V3H3zM13 21h8V11h-8zM13 3v6h8V3zM3 21h8v-6H3z" },
  { href: "/admin/productos", label: "Productos", icon: "M20 7 12 3 4 7v10l8 4 8-4zM4 7l8 4 8-4M12 11v10" },
  { href: "/admin/categorias", label: "Categorías", icon: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" },
  { href: "/admin/marcas", label: "Marcas", icon: "M12 2 2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
  { href: "/admin/pedidos", label: "Pedidos", icon: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" },
  { href: "/admin/clientes", label: "Clientes", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
  { href: "/admin/mensajes", label: "Mensajes", icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
];

export default function AdminSidebar() {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-brand-line bg-white">
      <div className="border-b border-brand-line px-6 py-5">
        <Link href="/admin" className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-epoxy-depot.png" alt="Epoxy Depot" className="h-8 w-auto" />
        </Link>
        <p className="mt-0.5 text-xs text-brand-ink-soft">Panel administrativo</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-brand-ink-soft transition hover:bg-brand-blue-light hover:text-brand-blue"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d={item.icon} />
            </svg>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-brand-line p-4">
        <Link href="/" className="text-xs font-medium text-brand-ink-soft hover:text-brand-blue">
          ← Volver al sitio
        </Link>
      </div>
    </aside>
  );
}
