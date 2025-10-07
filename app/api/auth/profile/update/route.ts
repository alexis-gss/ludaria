import { NextResponse } from "next/server";

import { getCurrentUser, toPublicUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const updates: Partial<{ pseudo: string; email: string }> = {};

    if (typeof body?.pseudo === "string" && body.pseudo.trim()) {
      updates.pseudo = body.pseudo.trim();
    }
    if (typeof body?.email === "string" && body.email.includes("@")) {
      updates.email = body.email.trim().toLowerCase();
    }

    if (!Object.keys(updates).length) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const updated = await prisma.users.update({
      where: { id: current.id },
      data: updates,
    });

    return NextResponse.json(toPublicUser(updated));
  } catch (err) {
    console.error("Update user error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
