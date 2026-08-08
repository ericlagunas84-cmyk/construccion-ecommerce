"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@prisma/client";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("No autenticado");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) throw new Error("Pedido no encontrado");

  // Si se cancela un pedido que no estaba cancelado antes, regresa el
  // stock de cada producto — evita que un pedido cancelado deje
  // inventario "atorado" como si se hubiera vendido de verdad.
  if (status === "CANCELADO" && order.status !== "CANCELADO") {
    for (const item of order.items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) continue;
      const newStock = product.stock + item.qty;
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: newStock,
          availability: newStock <= 0 ? "AGOTADO" : newStock <= 5 ? "POCAS_PIEZAS" : "DISPONIBLE",
          soldCount: { decrement: item.qty },
        },
      });
    }
  }

  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin/pedidos");
  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
}
