"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireStaffSession() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("No autenticado");
  return session;
}

// Campo señuelo oculto en el formulario público: si un bot lo rellena, la
// reseña se descarta en silencio sin avisarle que fue detectado.
export async function submitReview(data: {
  productSlug: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  website?: string;
}) {
  if (data.website) return; // honeypot

  if (!data.productSlug || !data.customerName || !data.customerEmail || !data.comment) {
    throw new Error("Faltan campos requeridos.");
  }
  if (data.rating < 1 || data.rating > 5) {
    throw new Error("La calificación debe ser de 1 a 5.");
  }

  const product = await prisma.product.findUnique({ where: { slug: data.productSlug } });
  if (!product) throw new Error("Producto no encontrado.");

  await prisma.review.create({
    data: {
      productId: product.id,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      rating: data.rating,
      comment: data.comment,
      approved: false,
    },
  });

  revalidatePath(`/producto/${data.productSlug}`);
}

export async function approveReview(id: string) {
  await requireStaffSession();
  await prisma.review.update({ where: { id }, data: { approved: true } });
  revalidatePath("/admin/resenas");
}

export async function deleteReview(id: string) {
  await requireStaffSession();
  await prisma.review.delete({ where: { id } });
  revalidatePath("/admin/resenas");
}
