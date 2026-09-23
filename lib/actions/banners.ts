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

export async function createBanner(formData: FormData) {
  await requireStaffSession();

  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const placement = String(formData.get("placement") ?? "PROMO");
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const ctaText = String(formData.get("ctaText") ?? "").trim();
  const ctaUrl = String(formData.get("ctaUrl") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const startsAtRaw = String(formData.get("startsAt") ?? "");
  const endsAtRaw = String(formData.get("endsAt") ?? "");

  if (!title) {
    throw new Error("El título es requerido.");
  }
  if (placement !== "HERO" && placement !== "PROMO") {
    throw new Error("Ubicación inválida.");
  }

  await prisma.banner.create({
    data: {
      title,
      subtitle: subtitle || null,
      placement,
      imageUrl: imageUrl || null,
      ctaText: ctaText || null,
      ctaUrl: ctaUrl || null,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      startsAt: startsAtRaw ? new Date(startsAtRaw) : null,
      endsAt: endsAtRaw ? new Date(endsAtRaw) : null,
    },
  });

  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function toggleBannerActive(id: string, current: boolean) {
  await requireStaffSession();
  await prisma.banner.update({ where: { id }, data: { active: !current } });
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function deleteBanner(id: string) {
  await requireStaffSession();
  await prisma.banner.delete({ where: { id } });
  revalidatePath("/admin/banners");
  revalidatePath("/");
}
