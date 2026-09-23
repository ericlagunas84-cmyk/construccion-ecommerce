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

export async function createCoupon(formData: FormData) {
  await requireStaffSession();

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const type = String(formData.get("type") ?? "PORCENTAJE");
  const value = Number(formData.get("value"));
  const minPurchaseRaw = formData.get("minPurchase");
  const maxUsesRaw = formData.get("maxUses");
  const expiresAtRaw = String(formData.get("expiresAt") ?? "");

  if (!code || !value || value <= 0) {
    throw new Error("Código y valor son requeridos.");
  }
  if (type !== "PORCENTAJE" && type !== "FIJO") {
    throw new Error("Tipo de descuento inválido.");
  }
  if (type === "PORCENTAJE" && value > 100) {
    throw new Error("Un descuento porcentual no puede ser mayor a 100%.");
  }

  const existing = await prisma.coupon.findUnique({ where: { code } });
  if (existing) {
    throw new Error("Ya existe un cupón con ese código.");
  }

  await prisma.coupon.create({
    data: {
      code,
      type,
      value,
      minPurchase: minPurchaseRaw ? Number(minPurchaseRaw) : null,
      maxUses: maxUsesRaw ? Number(maxUsesRaw) : null,
      expiresAt: expiresAtRaw ? new Date(expiresAtRaw) : null,
    },
  });

  revalidatePath("/admin/cupones");
}

export async function toggleCouponActive(id: string, current: boolean) {
  await requireStaffSession();
  await prisma.coupon.update({ where: { id }, data: { active: !current } });
  revalidatePath("/admin/cupones");
}

export async function deleteCoupon(id: string) {
  await requireStaffSession();

  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) return;
  if (coupon.usedCount > 0) {
    throw new Error("No se puede eliminar: este cupón ya tiene usos registrados. Desactívalo en su lugar.");
  }

  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/admin/cupones");
}

// Valida un código de cupón contra un subtotal dado y regresa el monto de
// descuento a aplicar. Se usa desde el checkout, no desde el panel — se
// recalcula siempre en el servidor para no confiar en nada que mande el
// cliente.
export async function validateCoupon(code: string, subtotal: number) {
  const coupon = await prisma.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });

  if (!coupon) throw new Error("Cupón no válido.");
  if (!coupon.active) throw new Error("Este cupón ya no está activo.");
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new Error("Este cupón ya venció.");
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) throw new Error("Este cupón ya alcanzó su límite de usos.");
  if (coupon.minPurchase && subtotal < Number(coupon.minPurchase)) {
    throw new Error(`Este cupón requiere una compra mínima de $${Number(coupon.minPurchase).toLocaleString("es-MX")}.`);
  }

  const discount =
    coupon.type === "PORCENTAJE" ? Math.round(subtotal * (Number(coupon.value) / 100) * 100) / 100 : Number(coupon.value);

  return { couponId: coupon.id, discount: Math.min(discount, subtotal) };
}
