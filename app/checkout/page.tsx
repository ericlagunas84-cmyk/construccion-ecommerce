import CheckoutForm from "@/components/CheckoutForm";
import { getSucursales } from "@/lib/data/catalog";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const sucursales = await getSucursales();
  return <CheckoutForm sucursales={sucursales} />;
}
