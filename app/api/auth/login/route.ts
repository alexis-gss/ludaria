import { NextResponse } from "next/server";

import { clearAuthCookie, login, setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { email, password } = body ?? {};

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const result = await login(email.trim().toLowerCase(), password);
  if (!result) {
    // Generic message — don't reveal whether email or password is wrong
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ user: result.user });
  setAuthCookie(res, result.token);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  clearAuthCookie(res);
  return res;
}
