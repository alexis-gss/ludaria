import { NextResponse } from "next/server";

import type { DifficultyType, PuzzleType } from "@prisma/client";

import { getCurrentUser } from "@/lib/getCurrentUser";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, difficulty } = await req.json();

    if (!type) {
      return NextResponse.json({ error: "Missing puzzle type" }, { status: 400 });
    }

    // 🧹 Si une difficulté précise est passée → suppression ciblée
    if (difficulty) {
      await prisma.progressions.deleteMany({
        where: {
          userId: user.id,
          type: type as PuzzleType,
          difficulty: difficulty as DifficultyType,
        },
      });
    } else {
      // 🔥 Sinon, supprimer toutes les progressions du type
      await prisma.progressions.deleteMany({
        where: {
          userId: user.id,
          type: type as PuzzleType,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors du reset de progression:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
