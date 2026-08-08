"use server";

import { prisma } from "@/lib/prisma";
import type { CartItem } from "@/lib/cart-context";

export type CheckoutInput = {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  contact: { name: string; lastName: string; email: string; phone: string };
  deliveryMethod: "domicilio" | "sucursal";
  address?: { street: string; colonia: string; city: string; state: string; postalCode: string };
  sucursalId?: string;
};

async function nextOrderNumber() {
  const count = await prisma.order.count();
  return `CE-${String(count + 1).padStart(6, "0")}`;
}

export async function createOrder(input: CheckoutInput) {
  if (input.items.length === 0) {
    throw new Error("El carrito está vacío");
  }

  const fullName = `${input.contact.name} ${input.contact.lastName}`.trim();

  // Busca al cliente por correo o lo crea (checkout como invitado, sin
  // cuenta — el modelo Customer.userId queda null en ese caso).
  const customer = await prisma.customer.upsert({
    where: { email: input.contact.email },
    update: { name: fullName, phone: input.contact.phone },
    create: { name: fullName, email: input.contact.email, phone: input.contact.phone },
  });

  if (input.deliveryMethod === "domicilio" && input.address) {
    await prisma.address.create({
      data: {
        customerId: customer.id,
        street: input.address.street,
        colonia: input.address.colonia,
        city: input.address.city,
        state: input.address.state,
        postalCode: input.address.postalCode,
        isDefault: true,
      },
    });
  }

  // Valida existencia y precio real de cada producto contra la base de
  // datos — nunca confiar en el precio que venga del cliente/carrito.
  const productSkus = input.items.map((i) => i.sku);
  const products = await prisma.product.findMany({ where: { sku: { in: productSkus } } });
  type ProductRow = (typeof products)[number];
  const productBySku = new Map<string, ProductRow>(
    products.map((p: ProductRow): [string, ProductRow] => [p.sku, p])
  );

  for (const item of input.items) {
    const product = productBySku.get(item.sku);
    if (!product) {
      throw new Error(`Producto no encontrado: ${item.sku}`);
    }
    if (product.availability === "AGOTADO" || product.stock < item.qty) {
      throw new Error(
        `"${product.name}" ya no tiene suficiente stock disponible (quedan ${product.stock}). Ajusta la cantidad en tu carrito.`
      );
    }
  }

  const number = await nextOrderNumber();
  const realSubtotal = input.items.reduce((sum, item) => {
    const product = productBySku.get(item.sku)!;
    return sum + Number(product.price) * item.qty;
  }, 0);
  const realTotal = realSubtotal + input.shipping;

  const order = await prisma.order.create({
    data: {
      number,
      customerId: customer.id,
      status: "PENDIENTE",
      deliveryMethod: input.deliveryMethod === "domicilio" ? "DOMICILIO" : "SUCURSAL",
      sucursalId: input.deliveryMethod === "sucursal" ? input.sucursalId : null,
      subtotal: realSubtotal,
      shipping: input.shipping,
      total: realTotal,
      items: {
        create: input.items.map((item) => ({
          productId: productBySku.get(item.sku)!.id,
          qty: item.qty,
          unitPrice: productBySku.get(item.sku)!.price,
        })),
      },
    },
  });

  // Refleja la venta en el contador de más vendidos y descuenta el stock
  // real de cada producto — si se agota, lo marca automáticamente como
  // AGOTADO para que no se pueda seguir comprando hasta reabastecerlo.
  for (const item of input.items) {
    const product = productBySku.get(item.sku)!;
    const newStock = product.stock - item.qty;
    await prisma.product.update({
      where: { sku: item.sku },
      data: {
        soldCount: { increment: item.qty },
        stock: newStock,
        availability: newStock <= 0 ? "AGOTADO" : newStock <= 5 ? "POCAS_PIEZAS" : "DISPONIBLE",
      },
    });
  }

  return { orderNumber: order.number };
}
