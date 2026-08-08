"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("No autenticado");
  return session;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProduct(formData: FormData) {
  await requireAdminSession();

  const name = String(formData.get("name") ?? "").trim();
  const sku = String(formData.get("sku") ?? "").trim();
  const shortDescription = String(formData.get("shortDescription") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categorySlug = String(formData.get("category") ?? "");
  const brandName = String(formData.get("brand") ?? "");
  const price = Number(formData.get("price"));
  const compareAtPriceRaw = formData.get("compareAtPrice");
  const stock = Number(formData.get("stock") ?? 0);
  const featured = formData.get("featured") === "on";
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();

  if (!name || !sku || !categorySlug || !brandName || !price) {
    throw new Error("Faltan campos requeridos");
  }

  await prisma.product.create({
    data: {
      sku,
      slug: slugify(name),
      name,
      shortDescription: shortDescription || name,
      description: description || shortDescription || name,
      categorySlug,
      brandName,
      price,
      compareAtPrice: compareAtPriceRaw ? Number(compareAtPriceRaw) : null,
      stock,
      availability: stock > 0 ? "DISPONIBLE" : "AGOTADO",
      featured,
      visible: true,
      imageUrl: imageUrl || null,
    },
  });

  revalidatePath("/admin/productos");
  redirect("/admin/productos");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdminSession();

  const name = String(formData.get("name") ?? "").trim();
  const shortDescription = String(formData.get("shortDescription") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categorySlug = String(formData.get("category") ?? "");
  const brandName = String(formData.get("brand") ?? "");
  const price = Number(formData.get("price"));
  const compareAtPriceRaw = formData.get("compareAtPrice");
  const stock = Number(formData.get("stock") ?? 0);
  const featured = formData.get("featured") === "on";
  const visible = formData.get("visible") === "on";
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();

  if (!name || !categorySlug || !brandName || !price) {
    throw new Error("Faltan campos requeridos");
  }

  await prisma.product.update({
    where: { id },
    data: {
      name,
      shortDescription: shortDescription || name,
      description: description || shortDescription || name,
      categorySlug,
      brandName,
      price,
      compareAtPrice: compareAtPriceRaw ? Number(compareAtPriceRaw) : null,
      stock,
      availability: stock > 0 ? "DISPONIBLE" : "AGOTADO",
      featured,
      visible,
      imageUrl: imageUrl || null,
    },
  });

  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
  redirect("/admin/productos");
}

export async function deleteProduct(id: string) {
  await requireAdminSession();
  const orderItemCount = await prisma.orderItem.count({ where: { productId: id } });
  if (orderItemCount > 0) {
    throw new Error(
      `No se puede eliminar: este producto tiene ${orderItemCount} pedido(s) asociado(s), y borrarlo perdería ese historial. Usa "Ocultar" en su lugar para quitarlo del sitio sin afectar los pedidos.`
    );
  }
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/productos");
}

export async function toggleFeatured(id: string, current: boolean) {
  await requireAdminSession();
  await prisma.product.update({ where: { id }, data: { featured: !current } });
  revalidatePath("/admin/productos");
}

export async function toggleVisible(id: string, current: boolean) {
  await requireAdminSession();
  await prisma.product.update({ where: { id }, data: { visible: !current } });
  revalidatePath("/admin/productos");
}

export async function duplicateProduct(id: string) {
  await requireAdminSession();
  const original = await prisma.product.findUniqueOrThrow({ where: { id } });
  const copyName = `${original.name} (copia)`;
  await prisma.product.create({
    data: {
      sku: `${original.sku}-COPY-${Date.now().toString().slice(-5)}`,
      slug: `${slugify(copyName)}-${Date.now().toString().slice(-5)}`,
      name: copyName,
      shortDescription: original.shortDescription,
      description: original.description,
      categorySlug: original.categorySlug,
      brandName: original.brandName,
      price: original.price,
      compareAtPrice: original.compareAtPrice,
      stock: 0,
      availability: "AGOTADO",
      featured: false,
      visible: false,
    },
  });
  revalidatePath("/admin/productos");
}
