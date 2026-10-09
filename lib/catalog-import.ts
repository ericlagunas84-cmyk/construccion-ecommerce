import { randomUUID } from "crypto";
import type { PrismaClient } from "@prisma/client";
import catalogo from "./data/catalogo-epoxydepot.json";
import { CATALOG_CATEGORIES } from "./catalog-categories";

// Catálogo oficial de Epoxy Depot generado a partir de
// "EpoxyDepot_Catalogo_Dashboard.xlsx" (127 productos, consulta 07/10/2026)
// más precio, fotos y categoría publicados en epoxydepot.mx.
export type CatalogItem = {
  sku: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  codigoInterno: string | null;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  inStock: boolean;
  imageUrl: string | null;
  gallery: string[];
  techSheetUrl: string | null;
  manufacturerUrl: string | null;
  tags: string[];
  specs: { label: string; value: string }[];
  featured: boolean;
  internalNotes: string;
};

export const CATALOG: CatalogItem[] = catalogo as CatalogItem[];

// El archivo no trae inventario. Se carga esta existencia inicial para que
// el checkout permita comprar; el admin la ajusta por producto en el panel.
export const DEFAULT_STOCK = 100;

function productRows() {
  return CATALOG.map((p, index) => ({
    id: randomUUID(),
    sku: p.sku,
    slug: p.slug,
    name: p.name,
    codigoInterno: p.codigoInterno,
    shortDescription: p.shortDescription,
    description: p.description,
    categorySlug: p.category,
    brandName: p.brand,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    stock: p.inStock ? DEFAULT_STOCK : 0,
    availability: p.inStock ? ("DISPONIBLE" as const) : ("AGOTADO" as const),
    featured: p.featured,
    visible: true,
    hasTechSheet: Boolean(p.techSheetUrl),
    techSheetUrl: p.techSheetUrl,
    imageUrl: p.imageUrl,
    gallery: p.gallery,
    manufacturerUrl: p.manufacturerUrl,
    internalNotes: p.internalNotes,
    tags: p.tags,
    // Fechas escalonadas para que "Más recientes" respete el orden del archivo.
    createdAt: new Date(Date.UTC(2026, 9, 7, 12, 0, CATALOG.length - index)),
  }));
}

/**
 * Borra TODO el catálogo (pedidos de prueba, reseñas, productos, categorías y
 * marcas) y carga el catálogo oficial. Corre en una sola transacción: si algo
 * falla, no se borra nada.
 */
export async function replaceCatalog(prisma: PrismaClient) {
  const products = productRows();
  const specs = products.flatMap((row, i) =>
    CATALOG[i].specs.map((s) => ({ id: randomUUID(), productId: row.id, label: s.label, value: s.value }))
  );
  const brands = Array.from(new Set(CATALOG.map((p) => p.brand))).sort();

  return prisma.$transaction(
    async (tx) => {
      const deletedOrders = await tx.order.deleteMany({}); // sus partidas se borran en cascada
      await tx.review.deleteMany({});
      await tx.coupon.updateMany({ data: { usedCount: 0 } });
      const deletedProducts = await tx.product.deleteMany({}); // specs en cascada
      await tx.category.deleteMany({});
      await tx.brand.deleteMany({});

      await tx.category.createMany({
        data: CATALOG_CATEGORIES.map((c, i) => ({
          slug: c.slug,
          name: c.name,
          description: c.description,
          sortOrder: i,
          visible: true,
        })),
      });
      await tx.brand.createMany({ data: brands.map((name) => ({ name })) });
      await tx.product.createMany({ data: products });
      await tx.productSpec.createMany({ data: specs });

      return {
        deletedOrders: deletedOrders.count,
        deletedProducts: deletedProducts.count,
        createdProducts: products.length,
        createdCategories: CATALOG_CATEGORIES.length,
        createdBrands: brands.length,
      };
    },
    { maxWait: 10_000, timeout: 60_000 }
  );
}

/**
 * Versión no destructiva para el seed: crea categorías, marcas y productos
 * que falten, sin tocar pedidos ni productos existentes.
 */
export async function upsertCatalog(prisma: PrismaClient) {
  for (const [i, c] of CATALOG_CATEGORIES.entries()) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, sortOrder: i },
      create: { slug: c.slug, name: c.name, description: c.description, sortOrder: i },
    });
  }
  for (const name of new Set(CATALOG.map((p) => p.brand))) {
    await prisma.brand.upsert({ where: { name }, update: {}, create: { name } });
  }
  const existing = new Set(
    (await prisma.product.findMany({ select: { sku: true } })).map((p: { sku: string }) => p.sku)
  );
  const rows = productRows().filter((r) => !existing.has(r.sku));
  for (const row of rows) {
    const item = CATALOG.find((p) => p.sku === row.sku)!;
    await prisma.product.create({
      data: { ...row, specs: { create: item.specs } },
    });
  }
  return rows.length;
}
