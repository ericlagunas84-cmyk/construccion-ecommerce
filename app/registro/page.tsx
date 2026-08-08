"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { registerCustomer } from "@/lib/actions/customer-auth";

export default function RegistroPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    try {
      await registerCustomer({
        name: String(form.get("name") ?? ""),
        email,
        phone: String(form.get("phone") ?? ""),
        password,
      });
      // Inicia sesión automáticamente tras registrarse.
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        router.push("/login");
        return;
      }
      router.push("/cuenta");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos crear tu cuenta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
        <h1 className="mb-2 text-2xl font-700 text-brand-ink">Crea tu cuenta</h1>
        <p className="mb-8 text-sm text-brand-ink-soft">
          Guarda tus datos para comprar más rápido y ver tu historial de pedidos.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Nombre completo</label>
            <input name="name" required className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Correo</label>
            <input name="email" type="email" required className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Teléfono (opcional)</label>
            <input name="phone" type="tel" className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Contraseña</label>
            <input name="password" type="password" required minLength={8} className="w-full rounded-md border border-brand-line px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
            <p className="mt-1 text-xs text-brand-ink-soft">Mínimo 8 caracteres.</p>
          </div>

          {error && <p className="text-xs font-medium text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-brand-orange py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark disabled:opacity-60"
          >
            {loading ? "Creando cuenta…" : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-ink-soft">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-brand-blue hover:text-brand-orange">
            Inicia sesión
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
