import Link from "next/link";
import { isSectionVisible } from "@/lib/permissions";

const nav = [
  { href: "/admin", label: "Dashboard", icon: "M3 13h8V3H3zM13 21h8V11h-8zM13 3v6h8V3zM3 21h8v-6H3z" },
  { href: "/admin/productos", label: "Productos", icon: "M20 7 12 3 4 7v10l8 4 8-4zM4 7l8 4 8-4M12 11v10" },
  { href: "/admin/categorias", label: "Categorías", icon: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" },
  { href: "/admin/marcas", label: "Marcas", icon: "M12 2 2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
  { href: "/admin/pedidos", label: "Pedidos", icon: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" },
  { href: "/admin/clientes", label: "Clientes", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
  { href: "/admin/cupones", label: "Cupones", icon: "M3 7h18v10H3zM3 12h18M7 7v10M17 7v10" },
  { href: "/admin/banners", label: "Banners", icon: "M3 5h18v14H3zM3 9h18M8 5v4" },
  { href: "/admin/resenas", label: "Reseñas", icon: "M12 17.3 6.2 21l1.6-6.6L2.5 9.9l6.7-.6L12 3l2.8 6.3 6.7.6-5.3 4.5 1.6 6.6z" },
  { href: "/admin/mensajes", label: "Mensajes", icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
  { href: "/admin/newsletter", label: "Newsletter", icon: "M4 4h16v16H4zM4 6l8 7 8-7" },
  { href: "/admin/usuarios", label: "Usuarios", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6" },
];

export default function AdminSidebar({ role }: { role?: string }) {
  const items = nav.filter((item) => isSectionVisible(role, item.href));

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
        {items.map((item) => (
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
