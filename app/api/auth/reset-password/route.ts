import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { token, password } = await req.json();
  if (!token || !password) {
    return NextResponse.json({ error: "Token et mot de passe obligatoires" }, { status: 400 });
  }

  const user = await prisma.users.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gte: new Date() }
    },
  });

  if (!user) return NextResponse.json({ error: "Lien de réinitialisation invalide ou expiré" }, { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  await prisma.users.update({
    where: { id: user.id },
    data: {
      password: hashed,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return NextResponse.json({ message: "Mot de passe modifié !" });
}
