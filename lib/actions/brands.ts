"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("No autenticado");
}

export async function createBrand(formData: FormData) {
  await requireSession();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("El nombre es requerido");

  const existing = await prisma.brand.findUnique({ where: { name } });
  if (existing) throw new Error("Ya existe esa marca");

  await prisma.brand.create({ data: { name } });
  revalidatePath("/admin/marcas");
  revalidatePath("/catalogo");
}

export async function deleteBrand(name: string) {
  await requireSession();
  const productCount = await prisma.product.count({ where: { brandName: name } });
  if (productCount > 0) {
    throw new Error(`No se puede eliminar: hay ${productCount} producto(s) de esta marca.`);
  }
  await prisma.brand.delete({ where: { name } });
  revalidatePath("/admin/marcas");
  revalidatePath("/catalogo");
}
