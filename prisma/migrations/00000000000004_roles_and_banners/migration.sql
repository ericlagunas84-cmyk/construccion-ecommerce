-- AlterEnum
-- Agrega los nuevos roles de staff (Almacenista/Logística y Vendedor/
-- Atención al cliente) sin afectar los roles existentes ni los usuarios ya
-- creados, que conservan su rol actual (ADMIN, EMPLEADO o CLIENTE).
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'ALMACENISTA';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'VENDEDOR';

-- CreateEnum
CREATE TYPE "BannerPlacement" AS ENUM ('HERO', 'PROMO');

-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "placement" "BannerPlacement" NOT NULL DEFAULT 'PROMO',
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "imageUrl" TEXT,
    "ctaText" TEXT,
    "ctaUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);
