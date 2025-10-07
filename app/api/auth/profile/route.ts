import { NextResponse } from "next/server";

import { getUserFromToken } from "@/lib/auth";

export async function GET(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const user = await getUserFromToken(token);
  if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  return NextResponse.json(user);
}
