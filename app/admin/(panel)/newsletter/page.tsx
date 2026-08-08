import { prisma } from "@/lib/prisma";
import { exportNewsletterCsv } from "@/lib/actions/export";
import ExportCsvButton from "@/components/admin/ExportCsvButton";

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletter.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-brand-ink">Newsletter</h1>
          <p className="text-sm text-brand-ink-soft">{subscribers.length} suscriptores</p>
        </div>
        {subscribers.length > 0 && <ExportCsvButton action={exportNewsletterCsv} />}
      </div>

      {subscribers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-brand-line py-16 text-center text-sm text-brand-ink-soft">
          Todavía no hay suscriptores. Aparecerán aquí cuando alguien se registre desde el pie del sitio.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-brand-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-line bg-brand-blue-light/40 text-left text-xs text-brand-ink-soft">
                <th className="px-4 py-3 font-medium">Correo</th>
                <th className="px-4 py-3 font-medium">Fecha de registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-line">
              {subscribers.map((s: (typeof subscribers)[number]) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 text-brand-ink">{s.email}</td>
                  <td className="px-4 py-3 text-brand-ink-soft">
                    {s.createdAt.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
