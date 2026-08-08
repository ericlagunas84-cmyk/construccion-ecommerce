import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "ConstruExpress — Polvos, herramientas, epóxicos e impermeabilizantes",
  description:
    "Materiales y herramientas de construcción con entrega rápida. Cemento, epóxicos, impermeabilizantes y más de 100 herramientas en stock.",
  openGraph: {
    title: "ConstruExpress",
    description:
      "Materiales y herramientas de construcción con entrega rápida.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-body bg-brand-paper text-brand-ink antialiased">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
