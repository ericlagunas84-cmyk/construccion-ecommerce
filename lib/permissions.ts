// Reglas de acceso del panel administrativo por rol.
//
// - ADMIN: acceso total.
// - EMPLEADO: rol genérico heredado, se trata como acceso total por
//   compatibilidad con cuentas ya creadas antes de que existieran roles
//   específicos.
// - ALMACENISTA: inventario y logística — productos, categorías, marcas,
//   pedidos (sin datos de clientes ni configuración).
// - VENDEDOR: atención al cliente — pedidos, clientes, mensajes, reseñas,
//   newsletter, cupones y banners/promociones.
// - CLIENTE: nunca tiene acceso al panel.

export type StaffRole = "ADMIN" | "EMPLEADO" | "ALMACENISTA" | "VENDEDOR";

export const STAFF_ROLES: StaffRole[] = ["ADMIN", "EMPLEADO", "ALMACENISTA", "VENDEDOR"];

export const ROLE_LABELS: Record<StaffRole, string> = {
  ADMIN: "Administrador general",
  EMPLEADO: "Empleado (acceso total)",
  ALMACENISTA: "Almacenista / Logística",
  VENDEDOR: "Vendedor / Atención al cliente",
};

// Prefijos de ruta dentro de /admin y qué roles pueden entrar. Un rol no
// listado en el arreglo de un prefijo queda fuera de esa sección. Rutas no
// listadas aquí (como /admin en sí, el dashboard) son visibles para
// cualquier rol de staff.
export const ADMIN_ROUTE_ACCESS: { prefix: string; roles: StaffRole[] }[] = [
  { prefix: "/admin/usuarios", roles: ["ADMIN"] },
  { prefix: "/admin/productos", roles: ["ADMIN", "EMPLEADO", "ALMACENISTA"] },
  { prefix: "/admin/categorias", roles: ["ADMIN", "EMPLEADO", "ALMACENISTA"] },
  { prefix: "/admin/marcas", roles: ["ADMIN", "EMPLEADO", "ALMACENISTA"] },
  { prefix: "/admin/pedidos", roles: ["ADMIN", "EMPLEADO", "ALMACENISTA", "VENDEDOR"] },
  { prefix: "/admin/clientes", roles: ["ADMIN", "EMPLEADO", "VENDEDOR"] },
  { prefix: "/admin/mensajes", roles: ["ADMIN", "EMPLEADO", "VENDEDOR"] },
  { prefix: "/admin/resenas", roles: ["ADMIN", "EMPLEADO", "VENDEDOR"] },
  { prefix: "/admin/newsletter", roles: ["ADMIN", "EMPLEADO", "VENDEDOR"] },
  { prefix: "/admin/cupones", roles: ["ADMIN", "EMPLEADO", "VENDEDOR"] },
  { prefix: "/admin/banners", roles: ["ADMIN", "EMPLEADO", "VENDEDOR"] },
  // /admin/perfil: cualquier miembro del staff puede editar su propio perfil.
];

export function canAccessAdminPath(role: string | undefined, pathname: string): boolean {
  if (!role || !STAFF_ROLES.includes(role as StaffRole)) return false;
  if (role === "ADMIN" || role === "EMPLEADO") return true;

  const rule = ADMIN_ROUTE_ACCESS.find((r) => pathname.startsWith(r.prefix));
  if (!rule) return true; // rutas sin regla explícita (dashboard, perfil) son abiertas a todo el staff
  return rule.roles.includes(role as StaffRole);
}

// Navegación del sidebar filtrada por rol. Cada entrada usa el mismo
// prefijo que ADMIN_ROUTE_ACCESS para decidir si se muestra.
export function isSectionVisible(role: string | undefined, sectionPrefix: string): boolean {
  return canAccessAdminPath(role, sectionPrefix);
}
