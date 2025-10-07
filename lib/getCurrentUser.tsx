import { cookies } from "next/headers";

import { getUserFromToken } from "@/lib/auth";

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
