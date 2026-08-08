-- AlterTable: campos para imagen de producto y ficha técnica en PDF
ALTER TABLE "Product" ADD COLUMN "techSheetUrl" TEXT;
ALTER TABLE "Product" ADD COLUMN "imageUrl" TEXT;
