// El SessionProvider ya se aplica en el layout raíz (app/layout.tsx),
// que envuelve todo el sitio, panel administrativo incluido.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
