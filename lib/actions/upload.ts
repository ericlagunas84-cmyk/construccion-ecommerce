"use server";

import { getServerSession } from "next-auth";
import { put } from "@vercel/blob";
import { authOptions } from "@/lib/auth";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function uploadProductImage(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("No autenticado");

  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("No se recibió ningún archivo");
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Formato no permitido. Usa JPG, PNG, WEBP o AVIF.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("La imagen pesa más de 5 MB. Comprímela e intenta de nuevo.");
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-").toLowerCase();
  const key = `productos/${Date.now()}-${safeName}`;

  const blob = await put(key, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return { url: blob.url };
}
