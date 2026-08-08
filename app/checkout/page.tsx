import CheckoutForm from "@/components/CheckoutForm";
import { getSucursales } from "@/lib/data/catalog";

export default async function CheckoutPage() {
  const sucursales = await getSucursales();
  return <CheckoutForm sucursales={sucursales} />;
}
