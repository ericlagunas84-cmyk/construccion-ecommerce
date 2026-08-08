"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function submitContactMessage(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  website?: string; // campo trampa (honeypot) — invisible para personas, los bots sí lo llenan
}) {
  // Si el campo trampa viene lleno, es casi seguro un bot — se ignora en
  // silencio (no delatamos que detectamos el bot, solo no guardamos nada).
  if (data.website) return;

  if (!data.name || !data.email || !data.message) {
    throw new Error("Faltan campos requeridos");
  }

  await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
    },
  });
}
export async function toggleMessageRead(id: string, current: boolean) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("No autenticado");

  await prisma.contactMessage.update({ where: { id }, data: { read: !current } });
  revalidatePath("/admin/mensajes");
}
