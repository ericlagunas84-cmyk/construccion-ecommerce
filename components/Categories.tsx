import Link from "next/link";
import { getCategories } from "@/lib/data/catalog";

export default async function Categories() {
  const categories = await getCategories();

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 max-w-xl">
        <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-brand-orange">
          Categorías
        </span>
        <h2 className="text-3xl font-700 text-brand-ink">Compra por línea de producto</h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/catalogo?cat=${cat.slug}`}
            className="group rounded-lg border border-brand-line bg-white p-6 transition hover:border-brand-blue hover:shadow-md"
          >
            <div className="mb-5 flex h-32 items-center justify-center rounded-md bg-brand-blue-light text-xs font-mono text-brand-ink-soft">
              foto 800×600
            </div>
            <h3 className="mb-1.5 font-display text-lg font-600 text-brand-ink">
              {cat.name}
            </h3>
            <p className="mb-4 text-sm text-brand-ink-soft">{cat.description}</p>
            <span className="text-sm font-semibold text-brand-blue group-hover:text-brand-orange">
              Ver productos ({cat.productCount}) →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
