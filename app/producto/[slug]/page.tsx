import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { money } from "@/lib/format";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/catalog";
import AddToCart from "@/components/AddToCart";

// Sin esto, Next.js solo generaría páginas para los productos que existían
// en la base de datos al momento del build en Vercel — un producto nuevo
// (como IMPAC) no aparecería hasta el siguiente deploy.
export const dynamic = "force-dynamic";

const availabilityLabel = {
  disponible: "Disponible",
  "pocas-piezas": "Pocas piezas — se agota pronto",
  agotado: "Agotado temporalmente",
};

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  const related = await getRelatedProducts(product);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <nav className="mb-6 text-xs text-brand-ink-soft">
          <Link href="/" className="hover:text-brand-blue">Inicio</Link> /{" "}
          <Link href="/catalogo" className="hover:text-brand-blue">Catálogo</Link> /{" "}
          <span className="text-brand-ink">{product.name}</span>
        </nav>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Galería */}
          <div>
            <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-brand-blue-light text-xs font-mono text-brand-ink-soft">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                "foto principal 1200×1200 — clic para zoom"
              )}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex aspect-square items-center justify-center rounded-md border border-brand-line bg-brand-blue-light text-[10px] font-mono text-brand-ink-soft"
                >
                  foto {i}
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-brand-orange">
              {product.brand}
            </span>
            <h1 className="mb-2 text-2xl font-bold text-brand-ink md:text-3xl">{product.name}</h1>
            <p className="mb-4 font-mono text-xs text-brand-ink-soft">SKU {product.sku}</p>

            <div className="mb-4 flex items-baseline gap-3 font-mono">
              <span className="text-3xl font-medium text-brand-ink">{money(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-base text-brand-ink-soft line-through">
                  {money(product.compareAtPrice)}
                </span>
              )}
            </div>

            <p
              className={`mb-6 inline-block rounded px-2.5 py-1 text-xs font-medium ${
                product.availability === "disponible"
                  ? "bg-emerald-50 text-emerald-700"
                  : product.availability === "pocas-piezas"
                  ? "bg-orange-50 text-brand-orange"
                  : "bg-brand-line text-brand-ink-soft"
              }`}
            >
              {availabilityLabel[product.availability]}
            </p>

            <p className="mb-8 text-sm leading-relaxed text-brand-ink-soft">
              {product.description}
            </p>

            <AddToCart product={product} disabled={product.availability === "agotado"} />

            {product.hasTechSheet && (
              <a
                href={product.techSheetUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:text-brand-orange"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v11.4l-3.6-3.6L7 12.2l5 5 5-5-1.4-1.4-3.6 3.6V3zM5 19h14v2H5z" />
                </svg>
                Descargar ficha técnica (PDF)
              </a>
            )}
          </div>
        </div>

        {/* Especificaciones y características */}
        <div className="mt-16 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-lg font-bold text-brand-ink">Especificaciones</h2>
            <dl className="divide-y divide-brand-line border-y border-brand-line text-sm">
              {product.specs.map((s) => (
                <div key={s.label} className="flex justify-between py-3">
                  <dt className="text-brand-ink-soft">{s.label}</dt>
                  <dd className="font-medium text-brand-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="mb-4 text-lg font-bold text-brand-ink">Descripción completa</h2>
            <p className="text-sm leading-relaxed text-brand-ink-soft">{product.description}</p>
          </div>
        </div>

        {/* Relacionados */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-6 text-2xl font-bold text-brand-ink">Productos relacionados</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.sku} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
