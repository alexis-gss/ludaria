import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const updates: Partial<{ pseudo: string; email: string }> = {};
  if (Object.prototype.hasOwnProperty.call(body, "pseudo")) {
    updates.pseudo = body.pseudo;
  }
  if (typeof body.email === "string") {
    updates.email = body.email;
  }

  try {
    const updated = await prisma.users.update({
      where: { id: current.id },
      data: updates,
      select: {
        id: true,
        pseudo: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const publicUser = {
      id: updated.id,
      pseudo: updated.pseudo,
      email: updated.email,
      createdAt: updated.createdAt ? new Date(updated.createdAt).toISOString() : null,
      updatedAt: updated.updatedAt ? new Date(updated.updatedAt).toISOString() : null,
    };

    return NextResponse.json(publicUser);
  } catch (err) {
    console.error("Update user error:", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}