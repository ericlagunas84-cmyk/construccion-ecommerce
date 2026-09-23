"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireStaffSession() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("No autenticado");
  return session;
}

// Escapa un valor para una celda CSV: si contiene coma, comillas o salto de
// línea, se envuelve en comillas dobles y se duplican las comillas internas.
function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers.map(csvCell).join(",")];
  for (const row of rows) {
    lines.push(row.map(csvCell).join(","));
  }
  return lines.join("\n");
}

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

export async function exportProductsCsv() {
  await requireStaffSession();

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const csv = toCsv(
    ["SKU", "Nombre", "Categoría", "Marca", "Precio", "Stock", "Disponibilidad", "Visible", "Destacado", "Vendidos"],
    products.map((p: (typeof products)[number]) => [
      p.sku,
      p.name,
      p.category?.name ?? p.categorySlug,
      p.brandName,
      Number(p.price),
      p.stock,
      p.availability,
      p.visible ? "Sí" : "No",
      p.featured ? "Sí" : "No",
      p.soldCount,
    ])
  );

  return { csv, filename: `productos-${todayStamp()}.csv` };
}

export async function exportOrdersCsv() {
  await requireStaffSession();

  const orders = await prisma.order.findMany({
    include: { customer: true, sucursal: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  const csv = toCsv(
    ["Folio", "Cliente", "Correo", "Fecha", "Entrega", "Artículos", "Subtotal", "Descuento", "Envío", "Total", "Estado"],
    orders.map((o: (typeof orders)[number]) => [
      o.number,
      o.customer.name,
      o.customer.email,
      o.createdAt.toISOString().slice(0, 10),
      o.deliveryMethod === "DOMICILIO" ? "Domicilio" : (o.sucursal?.name ?? "Sucursal"),
      o.items.reduce((sum: number, i: (typeof o.items)[number]) => sum + i.qty, 0),
      Number(o.subtotal),
      Number(o.discount),
      Number(o.shipping),
      Number(o.total),
      o.status,
    ])
  );

  return { csv, filename: `pedidos-${todayStamp()}.csv` };
}

export async function exportCustomersCsv() {
  await requireStaffSession();

  const customers = await prisma.customer.findMany({
    include: { orders: true, addresses: true },
    orderBy: { createdAt: "desc" },
  });

  const csv = toCsv(
    ["Nombre", "Correo", "Teléfono", "Direcciones", "Pedidos", "Total comprado", "Registrado"],
    customers.map((c: (typeof customers)[number]) => {
      const totalSpent = c.orders
        .filter((o: (typeof c.orders)[number]) => o.status !== "CANCELADO")
        .reduce((sum: number, o: (typeof c.orders)[number]) => sum + Number(o.total), 0);
      return [
        c.name,
        c.email,
        c.phone ?? "",
        c.addresses.length,
        c.orders.length,
        totalSpent.toFixed(2),
        c.createdAt.toISOString().slice(0, 10),
      ];
    })
  );

  return { csv, filename: `clientes-${todayStamp()}.csv` };
}

export async function exportNewsletterCsv() {
  await requireStaffSession();

  const subscribers = await prisma.newsletter.findMany({ orderBy: { createdAt: "desc" } });

  const csv = toCsv(
    ["Correo", "Fecha de registro"],
    subscribers.map((s: (typeof subscribers)[number]) => [s.email, s.createdAt.toISOString().slice(0, 10)])
  );

  return { csv, filename: `newsletter-${todayStamp()}.csv` };
}
