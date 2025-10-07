import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";

// Uses the httpOnly cookie — no need for an Authorization header anymore
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json(user);
}
