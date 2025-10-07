import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import type { PublicUser } from "@/types/global";

import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

// Cookie helpers.

const COOKIE_NAME = "token";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24, // 1 day
};

export function setAuthCookie(
  res: { cookies: { set: Function } },
  token: string,
) {
  res.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
}

export function clearAuthCookie(res: { cookies: { set: Function } }) {
  res.cookies.set(COOKIE_NAME, "", { ...COOKIE_OPTIONS, maxAge: 0 });
}

// Token.

export function signToken(id: number, email: string) {
  return jwt.sign({ id, email }, JWT_SECRET!, { expiresIn: "1d" });
}

export async function getUserFromToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!);
    if (typeof decoded !== "object" || !decoded || !("id" in decoded))
      return null;
    return await prisma.users.findUnique({ where: { id: decoded.id } });
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<PublicUser> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const user = await getUserFromToken(token);
  if (!user) return null;

  return toPublicUser(user);
}

// Auth actions.

export async function login(email: string, password: string) {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;
  const token = signToken(user.id, user.email);
  return { token, user: toPublicUser(user) };
}

export async function register(
  pseudo: string,
  email: string,
  password: string,
) {
  const existing = await prisma.users.findUnique({ where: { email } });
  if (existing) return null;
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.users.create({
    data: { pseudo, email, password: hashed },
  });
  const token = signToken(user.id, user.email);
  return { token, user: toPublicUser(user) };
}

// Utils.

export function toPublicUser(user: {
  id: number;
  pseudo: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}): PublicUser {
  return {
    id: user.id,
    pseudo: user.pseudo,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
