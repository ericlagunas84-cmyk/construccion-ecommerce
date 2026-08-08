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
    if (!productBySku.has(item.sku)) {
      throw new Error(`Producto no encontrado: ${item.sku}`);
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

  // Refleja la venta en el contador de más vendidos de cada producto,
  // para que el dashboard y "más vendidos" del catálogo se mantengan
  // reales sin depender de un job aparte.
  for (const item of input.items) {
    await prisma.product.update({
      where: { sku: item.sku },
      data: { soldCount: { increment: item.qty } },
    });
  }

  return { orderNumber: order.number };
}
