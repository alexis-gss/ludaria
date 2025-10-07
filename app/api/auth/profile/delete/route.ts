import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { currentPassword, confirm } = body ?? {};

    if (typeof currentPassword !== "string" || typeof confirm !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const fullUser = await prisma.users.findUnique({
      where: { id: current.id },
      select: { id: true, password: true, email: true },
    });

    if (!fullUser || !fullUser.password) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const match = await bcrypt.compare(currentPassword, fullUser.password);
    if (!match) {
      return NextResponse.json({ error: "Current password incorrect" }, { status: 403 });
    }

    const okConfirm =
      confirm.trim() === fullUser.email || confirm.trim().toUpperCase() === "DELETE";
    if (!okConfirm) {
      return NextResponse.json({ error: "Confirmation invalid" }, { status: 400 });
    }

    await prisma.users.delete({ where: { id: current.id } });

    // Build response and set a short-lived cookie to allow the deleted-account page access
    const res = NextResponse.json({ success: true });

    // clear auth cookie if any (adjust name if different)
    try {
      res.cookies.set("token", "", { maxAge: 0, path: "/" });
    } catch {
      // Ignore cookie clearing errors.
    }

    // set a one-time short-lived flag so the deleted-account page can be shown only to the deleter
    res.cookies.set("account_deleted", "1", {
      maxAge: 10, // seconds
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
