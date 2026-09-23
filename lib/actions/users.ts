"use server";

import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { STAFF_ROLES, type StaffRole } from "@/lib/permissions";

// Solo un ADMIN puede crear, editar o eliminar cuentas de staff y asignar
// roles — es la gestión de roles y permisos que se maneja desde el panel,
// sin tocar código ni la base de datos a mano.
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Solo un administrador general puede gestionar usuarios del panel.");
  }
  return session;
}

function isStaffRole(value: string): value is StaffRole {
  return (STAFF_ROLES as string[]).includes(value);
}

export async function createStaffUser(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "");

  if (!name || !email || !password) {
    throw new Error("Nombre, correo y contraseña son requeridos.");
  }
  if (password.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres.");
  }
  if (!isStaffRole(role) || role === "CLIENTE") {
    throw new Error("Rol inválido.");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Ya existe una cuenta con ese correo.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, passwordHash, role },
  });

  revalidatePath("/admin/usuarios");
}

export async function updateStaffUserRole(id: string, formData: FormData) {
  const session = await requireAdmin();

  const role = String(formData.get("role") ?? "");
  if (!isStaffRole(role) || role === "CLIENTE") {
    throw new Error("Rol inválido.");
  }

  if (session.user?.id === id && role !== "ADMIN") {
    throw new Error("No puedes quitarte a ti mismo el rol de administrador.");
  }

  await prisma.user.update({ where: { id }, data: { role } });
  revalidatePath("/admin/usuarios");
}

export async function deleteStaffUser(id: string) {
  const session = await requireAdmin();

  if (session.user?.id === id) {
    throw new Error("No puedes eliminar tu propia cuenta.");
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return;
  if (target.role === "CLIENTE") {
    throw new Error("Esa cuenta no es de staff.");
  }

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/usuarios");
}
