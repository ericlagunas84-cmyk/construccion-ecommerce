import { prisma } from "@/lib/prisma";

// Devuelve los banners activos de una ubicación, respetando ventana de
// fechas (startsAt/endsAt) cuando se definieron, ordenados por sortOrder.
export async function getActiveBanners(placement: "HERO" | "PROMO") {
  const now = new Date();

  const banners = await prisma.banner.findMany({
    where: {
      placement,
      active: true,
      OR: [{ startsAt: null }, { startsAt: { lte: now } }],
    },
    orderBy: { sortOrder: "asc" },
  });

  // El filtro de endsAt se aplica en memoria: Prisma no permite combinar
  // fácilmente "endsAt is null OR endsAt >= now" con el OR de startsAt en
  // el mismo where sin anidar AND/OR, así que se resuelve aquí para
  // mantener la consulta simple y legible.
  return banners.filter((b) => !b.endsAt || b.endsAt >= now);
}
