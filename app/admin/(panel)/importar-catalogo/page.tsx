import { prisma } from "@/lib/prisma";
import { CATALOG, DEFAULT_STOCK } from "@/lib/catalog-import";
import { CATALOG_CATEGORIES } from "@/lib/catalog-categories";
import ImportCatalogForm from "@/components/admin/ImportCatalogForm";

export const dynamic = "force-dynamic";
// La importación crea 127 productos en una transacción; se le da margen
// por si la base de datos de Neon tarda en "despertar".
export const maxDuration = 60;

export default async function ImportarCatalogoPage() {
  const [productCount, orderCount] = await Promise.all([prisma.product.count(), prisma.order.count()]);

  const conPrecio = CATALOG.filter((p) => p.price > 0).length;
  const aCotizar = CATALOG.length - conPrecio;
  const conPdf = CATALOG.filter((p) => p.techSheetUrl).length;
  const marcas = new Set(CATALOG.map((p) => p.brand)).size;

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-2xl font-bold text-brand-ink">Importar catálogo oficial</h1>
      <p className="mb-8 text-sm text-brand-ink-soft">
        Reemplaza todos los productos del sitio por el catálogo técnico de Epoxy Depot
        (EpoxyDepot_Catalogo_Dashboard.xlsx, consulta 07/10/2026).
      </p>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-brand-line bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-ink">Se va a cargar</h2>
          <ul className="space-y-1.5 text-sm text-brand-ink-soft">
            <li><strong className="text-brand-ink">{CATALOG.length}</strong> productos con foto</li>
            <li><strong className="text-brand-ink">{conPrecio}</strong> con precio · {aCotizar} se muestran como “a cotizar”</li>
            <li><strong className="text-brand-ink">{conPdf}</strong> con ficha técnica PDF oficial</li>
            <li><strong className="text-brand-ink">{CATALOG_CATEGORIES.length}</strong> categorías y {marcas} marcas</li>
            <li>Existencia inicial: {DEFAULT_STOCK} piezas por producto (ajústala después)</li>
          </ul>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-700">Se va a borrar</h2>
          <ul className="space-y-1.5 text-sm text-red-800">
            <li><strong>{productCount}</strong> productos actuales</li>
            <li><strong>{orderCount}</strong> pedidos (de prueba)</li>
            <li>Todas las reseñas, categorías y marcas actuales</li>
          </ul>
          <p className="mt-3 text-xs text-red-700">
            No se tocan clientes, usuarios del panel, cupones, banners ni mensajes.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-brand-line bg-white p-6">
        <ImportCatalogForm />
      </div>
    </div>
  );
}
