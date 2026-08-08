import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // El middleware ya protege /admin/*, pero se revalida aquí para tener
  // los datos de sesión disponibles y como segunda capa de seguridad.
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-brand-blue-light/40">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar user={session.user} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
