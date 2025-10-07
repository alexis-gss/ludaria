import crypto from "crypto";

import { NextResponse } from "next/server";

import { sendResetPasswordEmail } from "@/lib/mailer";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { email } = body ?? {};

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.users.findUnique({ where: { email: normalizedEmail } });

  // Always respond 200 to prevent user enumeration
  if (!user) {
    return NextResponse.json({ success: true });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 10); // 10 min

  await prisma.users.update({
    where: { email: normalizedEmail },
    data: { resetToken, resetTokenExpiry },
  });

  await sendResetPasswordEmail(normalizedEmail, user.pseudo, resetToken);

  return NextResponse.json({ success: true });
}
