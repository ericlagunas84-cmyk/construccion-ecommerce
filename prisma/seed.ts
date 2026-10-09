import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sucursales as seedSucursales } from "../lib/mock-data";
import { upsertCatalog } from "../lib/catalog-import";

const prisma = new PrismaClient();

async function main() {
  console.log("Sembrando sucursales…");
  for (const s of seedSucursales) {
    await prisma.sucursal.upsert({
      where: { id: s.id },
      update: { name: s.name, address: s.address, hours: s.hours },
      create: { id: s.id, name: s.name, address: s.address, hours: s.hours },
    });
  }

  console.log("Sembrando catálogo oficial de Epoxy Depot…");
  const created = await upsertCatalog(prisma);
  console.log(`  ${created} productos nuevos (los que ya existían no se tocan).`);

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
