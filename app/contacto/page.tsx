import ContactoForm from "@/components/ContactoForm";
import { getSucursales } from "@/lib/data/catalog";

export default async function ContactoPage() {
  const sucursales = await getSucursales();
  return <ContactoForm sucursales={sucursales} />;
}
