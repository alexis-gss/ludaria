import { NextResponse } from "next/server";

import { register, setAuthCookie } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { pseudo, email, password } = body ?? {};

  if (
    typeof pseudo !== "string" || !pseudo.trim() ||
    typeof email !== "string" || !email.includes("@") ||
    typeof password !== "string"
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const result = await register(pseudo.trim(), email.trim().toLowerCase(), password);
  if (!result) {
    return NextResponse.json({ error: "Email already used" }, { status: 409 });
  }

  // Send welcome email (non-blocking — don't fail registration if mail fails)
  sendWelcomeEmail(result.user!.email!, result.user!.pseudo!).catch((err) =>
    console.error("Welcome email error:", err),
  );

  const res = NextResponse.json({ user: result.user }, { status: 201 });
  setAuthCookie(res, result.token);
  return res;
}
