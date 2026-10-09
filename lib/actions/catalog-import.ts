"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { replaceCatalog } from "@/lib/catalog-import";

export type ImportResult =
  | { ok: false; message: string }
  | {
      ok: true;
      deletedOrders: number;
      deletedProducts: number;
      createdProducts: number;
      createdCategories: number;
      createdBrands: number;
    };

export async function importCatalogAction(confirmacion: string): Promise<ImportResult> {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return { ok: false, message: "Solo un administrador general puede reemplazar el catálogo." };
  }

  if (confirmacion.trim().toUpperCase() !== "BORRAR") {
    return { ok: false, message: "Escribe BORRAR para confirmar." };
  }

  try {
    const result = await replaceCatalog(prisma);
    revalidatePath("/", "layout");
    return { ok: true, ...result };
  } catch (err) {
    console.error("Error al importar catálogo", err);
    return {
      ok: false,
      message: "No se pudo completar la importación. No se borró nada; intenta de nuevo en un minuto.",
    };
  }
}
