import ContactoForm from "@/components/ContactoForm";
import { getSucursales } from "@/lib/data/catalog";

export const dynamic = "force-dynamic";

export default async function ContactoPage() {
  const sucursales = await getSucursales();
  return <ContactoForm sucursales={sucursales} />;
}
