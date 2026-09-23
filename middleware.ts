import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { canAccessAdminPath, STAFF_ROLES } from "@/lib/permissions";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role as string | undefined;

    if (!role || !STAFF_ROLES.includes(role as (typeof STAFF_ROLES)[number])) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    if (!canAccessAdminPath(role, req.nextUrl.pathname)) {
      // Rol de staff válido pero sin permiso para esta sección: lo mandamos
      // al dashboard con un aviso, en vez del login genérico.
      const url = new URL("/admin", req.url);
      url.searchParams.set("sinacceso", "1");
      return NextResponse.redirect(url);
    }
  },
  {
    callbacks: {
      // Solo exige que exista sesión aquí; el chequeo de rol específico
      // pasa arriba, para poder redirigir a /admin/login en vez del 403
      // genérico que da "authorized: false".
      authorized: ({ token }) => !!token,
    },
    pages: { signIn: "/admin/login" },
  }
);

export const config = {
  // Protege todo /admin excepto la propia página de login.
  matcher: ["/admin/((?!login).*)"],
};
