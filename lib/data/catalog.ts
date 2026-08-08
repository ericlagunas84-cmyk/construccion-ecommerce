import { prisma } from "@/lib/prisma";
import type { Product, Category, Brand, Availability } from "@/lib/types";
import type { Product as PrismaProduct, Category as PrismaCategory } from "@prisma/client";

const availabilityMap: Record<string, Availability> = {
  DISPONIBLE: "disponible",
  POCAS_PIEZAS: "pocas-piezas",
  AGOTADO: "agotado",
};

// Prisma devuelve Decimal para los campos numéricos con precisión fija;
// se convierten a number aquí, en la frontera entre el servidor y los
// componentes de cliente, ya que Decimal no es serializable entre ambos.
function toProduct(
  p: PrismaProduct & { category?: PrismaCategory; specs?: { label: string; value: string }[] }
): Product {
  return {
    sku: p.sku,
    slug: p.slug,
    name: p.name,
    category: p.categorySlug,
    categoryName: p.category?.name,
    brand: p.brandName,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
    availability: availabilityMap[p.availability] ?? "disponible",
    featured: p.featured,
    shortDescription: p.shortDescription,
    description: p.description,
    specs: p.specs?.map((s: { label: string; value: string }) => ({ label: s.label, value: s.value })) ?? [],
    hasTechSheet: p.hasTechSheet,
    techSheetUrl: p.techSheetUrl ?? undefined,
    imageUrl: p.imageUrl ?? undefined,
    soldCount: p.soldCount,
    createdAt: p.createdAt.toISOString(),
  };
}

export async function getCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { visible: true } } } } },
  });
  return categories.map((c: (typeof categories)[number]) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    productCount: c._count.products,
  }));
}

export async function getBrands(): Promise<Brand[]> {
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  return brands.map((b: (typeof brands)[number]) => ({ name: b.name }));
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { featured: true, visible: true },
    include: { category: true, specs: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
  return products.map(toProduct);
}

export async function getAllProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { visible: true },
    include: { category: true, specs: true },
    orderBy: { createdAt: "desc" },
  });
  return products.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const p = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, specs: true },
  });
  if (!p || !p.visible) return null;
  return toProduct(p);
}

export async function getRelatedProducts(product: Product, count = 4): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { categorySlug: product.category, slug: { not: product.slug }, visible: true },
    include: { category: true, specs: true },
    take: count,
  });
  return products.map(toProduct);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const products = await prisma.product.findMany({ where: { visible: true }, select: { slug: true } });
  return products.map((p: { slug: string }) => p.slug);
}

export async function getSucursales() {
  return prisma.sucursal.findMany({ orderBy: { name: "asc" } });
}
