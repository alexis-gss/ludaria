import { NextResponse } from "next/server";

import { register } from "@/lib/auth";

export async function POST(req: Request) {
  const { pseudo, email, password } = await req.json();
  const result = await register(pseudo, email, password);
  if (!result) return NextResponse.json({ error: "Email already used" }, { status: 409 });
  return NextResponse.json({ token: result.token, user: result.user });
}
