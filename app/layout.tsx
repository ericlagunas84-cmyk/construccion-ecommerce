import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Epoxy Depot — Herramientas para pisos epóxicos y concreto pulido",
  description:
    "Herramientas especializadas para instalación, pulido y acabado de pisos epóxicos y de concreto. Envíos a todo México.",
  openGraph: {
    title: "Epoxy Depot",
    description:
      "Herramientas especializadas para pisos epóxicos y concreto pulido, con envíos a todo México.",
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
      <head>
        {/* Fuente cargada en el navegador del visitante, no durante el build
            de Vercel — evita el problema anterior de fuentes que rompía el
            despliegue. Jost es la alternativa libre más cercana a Futura
            (Futura en sí es de pago y no está disponible para web). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-brand-paper text-brand-ink antialiased">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
