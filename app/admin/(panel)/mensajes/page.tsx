import { prisma } from "@/lib/prisma";
import { toggleMessageRead } from "@/lib/actions/contact";

export default async function AdminMensajesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  const unreadCount = messages.filter((m: (typeof messages)[number]) => !m.read).length;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-brand-ink">Mensajes de contacto</h1>
      <p className="mb-6 text-sm text-brand-ink-soft">
        {messages.length} mensajes recibidos
        {unreadCount > 0 && <span className="ml-2 font-medium text-brand-orange">· {unreadCount} sin leer</span>}
      </p>

      {messages.length === 0 ? (
        <div className="rounded-lg border border-dashed border-brand-line py-16 text-center text-sm text-brand-ink-soft">
          Todavía no hay mensajes. Aparecerán aquí cuando alguien use el formulario de Contacto.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m: (typeof messages)[number]) => (
            <div
              key={m.id}
              className={`rounded-lg border p-5 ${m.read ? "border-brand-line bg-white" : "border-brand-blue bg-brand-blue-light/40"}`}
            >
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span className="font-semibold text-brand-ink">{m.name}</span>
                  {!m.read && (
                    <span className="ml-2 rounded bg-brand-orange px-1.5 py-0.5 text-[10px] font-medium text-white">
                      Nuevo
                    </span>
                  )}
                  <p className="text-xs text-brand-ink-soft">{m.email}{m.phone ? ` · ${m.phone}` : ""}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-brand-ink-soft">
                    {m.createdAt.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <form action={toggleMessageRead.bind(null, m.id, m.read)}>
                    <button className="text-xs font-medium text-brand-blue hover:underline">
                      {m.read ? "Marcar como no leído" : "Marcar como leído"}
                    </button>
                  </form>
                </div>
              </div>
              <p className="text-sm text-brand-ink-soft">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
