import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { getPasswordRules } from "@/lib/validation/password";

export async function PATCH(req: Request) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { currentPassword, newPassword } = body ?? {};

    if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // load full user including hashed password
    const fullUser = await prisma.users.findUnique({
      where: { id: current.id },
      select: { id: true, password: true },
    });

    if (!fullUser || !fullUser.password) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const match = await bcrypt.compare(currentPassword, fullUser.password);
    if (!match) {
      return NextResponse.json({ error: "Current password incorrect" }, { status: 403 });
    }

    // Use shared validation utility (server-side we don’t check confirmation)
    const rules = getPasswordRules(newPassword);
    const ok = rules.length && rules.upper && rules.lower && rules.digit && rules.special;
    if (!ok) {
      return NextResponse.json(
        { error: "New password does not meet requirements", details: rules },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where: { id: current.id },
      data: { password: hashed },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Password change error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}