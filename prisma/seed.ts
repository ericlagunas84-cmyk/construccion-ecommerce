import { PrismaClient, Role, OrderStatus, DeliveryMethod, Availability } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  categories as seedCategories,
  brands as seedBrands,
  products as seedProducts,
  sucursales as seedSucursales,
} from "../lib/mock-data";

const prisma = new PrismaClient();

const availabilityMap: Record<string, Availability> = {
  disponible: "DISPONIBLE",
  "pocas-piezas": "POCAS_PIEZAS",
  agotado: "AGOTADO",
};

async function main() {
  console.log("Sembrando categorías…");
  for (const c of seedCategories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: { slug: c.slug, name: c.name, description: c.description },
    });
  }

  console.log("Sembrando marcas…");
  for (const b of seedBrands) {
    await prisma.brand.upsert({
      where: { name: b.name },
      update: {},
      create: { name: b.name },
    });
  }

  console.log("Sembrando sucursales…");
  const sucursalRecords = [];
  for (const s of seedSucursales) {
    const rec = await prisma.sucursal.upsert({
      where: { id: s.id },
      update: { name: s.name, address: s.address, hours: s.hours },
      create: { id: s.id, name: s.name, address: s.address, hours: s.hours },
    });
    sucursalRecords.push(rec);
  }

  console.log("Sembrando productos…");
  for (const p of seedProducts) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        sku: p.sku,
        slug: p.slug,
        name: p.name,
        shortDescription: p.shortDescription,
        description: p.description,
        categorySlug: p.category,
        brandName: p.brand,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        availability: availabilityMap[p.availability],
        featured: p.featured,
        hasTechSheet: p.hasTechSheet,
        techSheetUrl: p.techSheetUrl ?? null,
        imageUrl: p.imageUrl ?? null,
        soldCount: p.soldCount,
        createdAt: new Date(p.createdAt),
        specs: { create: p.specs.map((s) => ({ label: s.label, value: s.value })) },
      },
    });
  }

  console.log("Creando usuario administrador…");
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@epoxydepot.mx" },
    update: {},
    create: {
      email: "admin@epoxydepot.mx",
      passwordHash: adminPassword,
      name: "Administrador",
      role: Role.ADMIN,
    },
  });

  console.log("Creando cliente y pedidos de ejemplo…");
  const demoCustomer = await prisma.customer.upsert({
    where: { email: "cliente.demo@example.com" },
    update: {},
    create: {
      name: "Jorge Ramírez",
      email: "cliente.demo@example.com",
      phone: "5555550123",
    },
  });

  const cemento = await prisma.product.findUnique({ where: { sku: "CEM-4050" } });
  const taladro = await prisma.product.findUnique({ where: { sku: "TAL-1120" } });
  const impermeabilizante = await prisma.product.findUnique({ where: { sku: "IMP-2210" } });

  if (cemento && taladro && impermeabilizante) {
    const existingOrders = await prisma.order.count();
    if (existingOrders === 0) {
      await prisma.order.create({
        data: {
          number: "CE-000001",
          customerId: demoCustomer.id,
          status: OrderStatus.ENTREGADO,
          deliveryMethod: DeliveryMethod.DOMICILIO,
          subtotal: Number(cemento.price) * 4,
          shipping: 0,
          total: Number(cemento.price) * 4,
          createdAt: new Date("2026-01-20"),
          items: { create: [{ productId: cemento.id, qty: 4, unitPrice: cemento.price }] },
        },
      });
      await prisma.order.create({
        data: {
          number: "CE-000002",
          customerId: demoCustomer.id,
          status: OrderStatus.PREPARANDO,
          deliveryMethod: DeliveryMethod.SUCURSAL,
          sucursalId: sucursalRecords[0].id,
          subtotal: Number(taladro.price),
          shipping: 0,
          total: Number(taladro.price),
          createdAt: new Date("2026-02-02"),
          items: { create: [{ productId: taladro.id, qty: 1, unitPrice: taladro.price }] },
        },
      });

      await prisma.order.create({
        data: {
          number: "CE-000003",
          customerId: demoCustomer.id,
          status: OrderStatus.PENDIENTE,
          deliveryMethod: DeliveryMethod.DOMICILIO,
          subtotal: Number(impermeabilizante.price),
          shipping: 0,
          total: Number(impermeabilizante.price),
          createdAt: new Date(),
          items: {
            create: [{ productId: impermeabilizante.id, qty: 1, unitPrice: impermeabilizante.price }],
          },
        },
      });
    }
  }

  console.log("Seed completo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
