import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createStaffUser, updateStaffUserRole, deleteStaffUser } from "@/lib/actions/users";
import { ROLE_LABELS, type StaffRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function AdminUsuariosPage() {
  const session = await getServerSession(authOptions);
  const staff = await prisma.user.findMany({
    where: { role: { not: "CLIENTE" } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-brand-ink">Usuarios y roles</h1>
      <p className="mb-6 text-sm text-brand-ink-soft">
        Crea cuentas para tu equipo y asigna qué puede ver cada quién en el panel.
      </p>

      <div className="grid gap-8 md:grid-cols-[1fr_340px]">
        <div className="overflow-x-auto rounded-lg border border-brand-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-line bg-brand-blue-light/40 text-left text-xs text-brand-ink-soft">
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Correo</th>
                <th className="px-4 py-3 font-medium">Rol</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-line">
              {staff.map((u: (typeof staff)[number]) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-medium text-brand-ink">
                    {u.name}
                    {session?.user?.id === u.id && (
                      <span className="ml-2 text-[10px] font-normal uppercase tracking-wide text-brand-ink-soft">
                        (tú)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-brand-ink-soft">{u.email}</td>
                  <td className="px-4 py-3">
                    <form action={updateStaffUserRole.bind(null, u.id)} className="flex items-center gap-2">
                      <select
                        name="role"
                        defaultValue={u.role}
                        className="rounded-md border border-brand-line px-2 py-1.5 text-xs focus:border-brand-blue focus:outline-none"
                      >
                        {(Object.keys(ROLE_LABELS) as StaffRole[]).map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </option>
                        ))}
                      </select>
                      <button className="text-xs font-medium text-brand-blue hover:underline">Guardar</button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    {session?.user?.id === u.id ? (
                      <span className="text-xs text-brand-ink-soft">—</span>
                    ) : (
                      <form action={deleteStaffUser.bind(null, u.id)}>
                        <button className="text-xs font-medium text-red-600 hover:underline">Eliminar</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
              {staff.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-brand-ink-soft">
                    Todavía no hay usuarios de staff.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="h-max rounded-lg border border-brand-line bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-ink">
            Nueva cuenta
          </h2>
          <form action={createStaffUser} className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Nombre</label>
              <input name="name" required className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Correo</label>
              <input name="email" type="email" required className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Contraseña</label>
              <input name="password" type="password" required minLength={8} className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
              <p className="mt-1 text-[11px] text-brand-ink-soft">Mínimo 8 caracteres.</p>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Rol</label>
              <select name="role" className="w-full rounded-md border border-brand-line px-3 py-2 text-sm focus:border-brand-blue focus:outline-none">
                <option value="ALMACENISTA">Almacenista / Logística</option>
                <option value="VENDEDOR">Vendedor / Atención al cliente</option>
                <option value="ADMIN">Administrador general</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-brand-orange py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark"
            >
              Crear usuario
            </button>
          </form>

          <div className="mt-5 space-y-2 border-t border-brand-line pt-4 text-[11px] text-brand-ink-soft">
            <p><strong className="text-brand-ink">Almacenista:</strong> productos, categorías, marcas y pedidos.</p>
            <p><strong className="text-brand-ink">Vendedor:</strong> pedidos, clientes, mensajes, reseñas, cupones y banners.</p>
            <p><strong className="text-brand-ink">Administrador:</strong> acceso a todo, incluida esta sección.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
