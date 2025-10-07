import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { sendPasswordChangedEmail } from "@/lib/mailer";
import prisma from "@/lib/prisma";
import { getPasswordRules } from "@/lib/validations";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { token, password } = body ?? {};

  if (typeof token !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const rules = getPasswordRules(password);
  const ok = rules.length && rules.upper && rules.lower && rules.digit && rules.special;
  if (!ok) {
    return NextResponse.json(
      { error: "Password does not meet requirements", details: rules },
      { status: 400 },
    );
  }

  const user = await prisma.users.findFirst({
    where: { resetToken: token, resetTokenExpiry: { gte: new Date() } },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid or expired reset link" },
      { status: 400 },
    );
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.users.update({
    where: { id: user.id },
    data: { password: hashed, resetToken: null, resetTokenExpiry: null },
  });

  sendPasswordChangedEmail(user.email, user.pseudo).catch((err) =>
    console.error("Password changed email error:", err),
  );

  return NextResponse.json({ success: true });
}
