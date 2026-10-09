-- AlterTable
-- Campos para el catálogo técnico de Epoxy Depot: galería de fotos,
-- enlace a la ficha web del fabricante y notas internas del panel admin.
ALTER TABLE "Product" ADD COLUMN "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Product" ADD COLUMN "manufacturerUrl" TEXT;
ALTER TABLE "Product" ADD COLUMN "internalNotes" TEXT;
