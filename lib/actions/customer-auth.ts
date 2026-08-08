"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function registerCustomer(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) {
  if (!data.name || !data.email || !data.password) {
    throw new Error("Faltan campos requeridos");
  }
  if (data.password.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres");
  }

  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) {
    throw new Error("Ya existe una cuenta con ese correo. Intenta iniciar sesión.");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  // Si ya existe un Customer con este correo (por ejemplo, de una compra
  // anterior como invitado), se vincula la cuenta nueva a ese historial
  // en vez de crear un cliente duplicado.
  const existingCustomer = await prisma.customer.findUnique({ where: { email: data.email } });

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      name: data.name,
      role: "CLIENTE",
      customer: existingCustomer
        ? { connect: { id: existingCustomer.id } }
        : { create: { name: data.name, email: data.email, phone: data.phone || null } },
    },
  });

  return { email: user.email };
}
