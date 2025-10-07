import crypto from "crypto";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { email } = await req.json();
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Génère un token unique et une date d’expiration (10 minutes)
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 10);

  await prisma.users.update({
    where: { email },
    data: { resetToken, resetTokenExpiry }
  });

  // Prépare le lien (mets bien NEXT_PUBLIC_APP_URL dans .env)
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/(public)/reset-password?token=${resetToken}`;

  // Configure le mailer (adapter selon .env)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Support" <${process.env.EMAIL_ADDRESS}>`,
    to: email,
    subject: "Réinitialisation du mot de passe",
    html: `<p>Clique ici pour réinitialiser ton mot de passe :</p><a href="${resetUrl}">${resetUrl}</a>`,
  });

  return NextResponse.json({ message: "Email envoyé !" });
}
