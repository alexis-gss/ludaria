import { NextResponse } from "next/server";

import { login } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const result = await login(email, password);
  if (!result) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  // Set cookie (optionnel) ou retour token.
  return NextResponse.json({ token: result.token, user: result.user });
}
