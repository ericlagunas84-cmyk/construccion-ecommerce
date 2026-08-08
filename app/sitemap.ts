import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXTAUTH_URL || "https://epoxydepot.mx";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/catalogo`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/quienes-somos`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/preguntas-frecuentes`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contacto`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacidad`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/terminos`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/devoluciones`, changeFrequency: "yearly", priority: 0.2 },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      where: { visible: true },
      select: { slug: true, updatedAt: true },
    });
    productPages = products.map((p: { slug: string; updatedAt: Date }) => ({
      url: `${BASE_URL}/producto/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    // Si la base de datos no responde al momento del build, el sitemap
    // simplemente sale con las páginas estáticas — no rompe el deploy.
  }

  return [...staticPages, ...productPages];
}
