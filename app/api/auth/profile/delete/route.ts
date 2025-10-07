import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { clearAuthCookie, getCurrentUser } from "@/lib/auth";
import { sendAccountDeletedEmail } from "@/lib/mailer";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const { currentPassword, confirm } = body ?? {};

    if (typeof currentPassword !== "string" || typeof confirm !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const fullUser = await prisma.users.findUnique({
      where: { id: current.id },
      select: { id: true, password: true, email: true, pseudo: true },
    });

    if (!fullUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const match = await bcrypt.compare(currentPassword, fullUser.password);
    if (!match) {
      return NextResponse.json({ error: "Current password incorrect" }, { status: 403 });
    }

    if (confirm.trim() !== fullUser.email) {
      return NextResponse.json({ error: "Confirmation invalid" }, { status: 400 });
    }

    await prisma.users.delete({ where: { id: current.id } });

    // Send farewell email before we lose the address (non-blocking)
    sendAccountDeletedEmail(fullUser.email, fullUser.pseudo).catch((err) =>
      console.error("Account deleted email error:", err),
    );

    const res = NextResponse.json({ success: true });
    clearAuthCookie(res);
    res.cookies.set("account_deleted", "1", {
      maxAge: 10,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res;
  } catch (err) {
    console.error("Account delete error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
