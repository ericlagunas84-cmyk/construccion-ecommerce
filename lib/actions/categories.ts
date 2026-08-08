"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireSession() {
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

export async function createCategory(formData: FormData) {
  await requireSession();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!name) throw new Error("El nombre es requerido");

  const slug = slugify(name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) throw new Error("Ya existe una categoría con ese nombre");

  const maxOrder = await prisma.category.aggregate({ _max: { sortOrder: true } });

  await prisma.category.create({
    data: {
      slug,
      name,
      description: description || name,
      sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
    },
  });
  revalidatePath("/admin/categorias");
  revalidatePath("/catalogo");
}

export async function updateCategory(slug: string, formData: FormData) {
  await requireSession();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!name) throw new Error("El nombre es requerido");

  await prisma.category.update({
    where: { slug },
    data: { name, description: description || name },
  });
  revalidatePath("/admin/categorias");
  revalidatePath("/catalogo");
}

export async function toggleCategoryVisible(slug: string, current: boolean) {
  await requireSession();
  await prisma.category.update({ where: { slug }, data: { visible: !current } });
  revalidatePath("/admin/categorias");
  revalidatePath("/catalogo");
}

export async function deleteCategory(slug: string) {
  await requireSession();
  const productCount = await prisma.product.count({ where: { categorySlug: slug } });
  if (productCount > 0) {
    throw new Error(
      `No se puede eliminar: hay ${productCount} producto(s) en esta categoría. Muévelos u ocúltala en vez de eliminarla.`
    );
  }
  await prisma.category.delete({ where: { slug } });
  revalidatePath("/admin/categorias");
  revalidatePath("/catalogo");
}

export async function reorderCategory(slug: string, direction: "up" | "down") {
  await requireSession();
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  const index = categories.findIndex((c: (typeof categories)[number]) => c.slug === slug);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= categories.length) return;

  const a = categories[index];
  const b = categories[swapIndex];
  await prisma.$transaction([
    prisma.category.update({ where: { slug: a.slug }, data: { sortOrder: b.sortOrder } }),
    prisma.category.update({ where: { slug: b.slug }, data: { sortOrder: a.sortOrder } }),
  ]);
  revalidatePath("/admin/categorias");
  revalidatePath("/catalogo");
}
