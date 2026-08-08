import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    if (role !== "ADMIN" && role !== "EMPLEADO") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
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
