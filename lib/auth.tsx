import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const login = async (email: string, password: string) => {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1d",
  });
  return { token, user };
};

export const register = async (
  pseudo: string,
  email: string,
  password: string
) => {
  const existing = await prisma.users.findUnique({ where: { email } });
  if (existing) return null;
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.users.create({
    data: { pseudo, email, password: hashed },
  });
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1d",
  });
  return { token, user };
};

export const getUserFromToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded !== "object" || !decoded || !("id" in decoded)) {
      throw new Error("Invalid token payload");
    }

    return await prisma.users.findUnique({ where: { id: decoded.id } });
  } catch {
    return null;
  }
};

export type PublicUser = {
  id: number;
  pseudo: string;
  email: string;
  createdAt?: string | null;
  updatedAt?: string | null;
} | null;

export async function getCurrentUser(): Promise<PublicUser> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const user = await getUserFromToken(token);
  if (!user) return null;

  // Retourner uniquement les champs non sensibles, convertir les Date en ISO
  const { id, pseudo, email, createdAt, updatedAt } = user;
  return {
    id,
    pseudo,
    email,
    createdAt: createdAt ? new Date(createdAt).toISOString() : null,
    updatedAt: updatedAt ? new Date(updatedAt).toISOString() : null,
  };
}
