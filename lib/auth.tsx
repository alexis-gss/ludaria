import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

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
