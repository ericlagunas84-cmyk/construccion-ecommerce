import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/data/catalog";

export default async function FeaturedProducts() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <section className="bg-brand-blue-light/50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-brand-orange">
              Destacados
            </span>
            <h2 className="text-3xl font-bold text-brand-ink">Productos destacados</h2>
          </div>
          <Link href="/catalogo" className="hidden text-sm font-semibold text-brand-blue hover:text-brand-orange md:block">
            Ver catálogo completo →
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((p) => (
            <ProductCard key={p.sku} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
