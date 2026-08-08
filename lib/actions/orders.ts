"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@prisma/client";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("No autenticado");

  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin/pedidos");
}
