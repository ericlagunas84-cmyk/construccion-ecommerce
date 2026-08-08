"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      redirect: false,
    });

    setLoading(false);
    if (res?.error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }
    router.push("/cuenta");
  }

  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
        <h1 className="mb-2 text-2xl font-700 text-brand-ink">Inicia sesión</h1>
        <p className="mb-8 text-sm text-brand-ink-soft">Accede a tu cuenta para ver tus pedidos.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Correo</label>
            <input name="email" type="email" required className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Contraseña</label>
            <input name="password" type="password" required className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
          </div>

          {error && <p className="text-xs font-medium text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-brand-orange py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-ink-soft">
          ¿Aún no tienes cuenta?{" "}
          <Link href="/registro" className="font-semibold text-brand-blue hover:text-brand-orange">
            Regístrate
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
