import { NextResponse } from "next/server";

import type { PuzzleType, DifficultyType } from "@prisma/client";

import { getCurrentUser } from "@/lib/getCurrentUser";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") as PuzzleType | null;
    const difficulty = searchParams.get("difficulty") as DifficultyType | null;

    // Si aucun type → toutes les progressions
    if (!type) {
      const progressions = await prisma.progressions.findMany({ where: { userId: user.id } });
      const result: Record<PuzzleType, Record<DifficultyType, number>> = {
        overflowing_palette: { easy: 0, medium: 0, hard: 0 },
        energy_matrix: { easy: 0, medium: 0, hard: 0 },
        signals_console: { easy: 0, medium: 0, hard: 0 },
      };
      progressions.forEach((p) => {
        if (!result[p.type]) result[p.type] = { easy: 0, medium: 0, hard: 0 };
        result[p.type][p.difficulty] = p.level;
      });
      return NextResponse.json(result);
    }

    // Si type fourni mais pas difficulty → toutes les difficultés du jeu
    if (!difficulty) {
      const progressions = await prisma.progressions.findMany({ where: { userId: user.id, type } });
      const result: Record<DifficultyType, number> = { easy: 0, medium: 0, hard: 0 };
      progressions.forEach((p) => (result[p.difficulty] = p.level));
      return NextResponse.json({ [type]: result });
    }

    // Si type + difficulty → niveau précis
    const progression = await prisma.progressions.findUnique({
      where: { userId_type_difficulty: { userId: user.id, type, difficulty } },
    });

    return NextResponse.json({ [type]: { [difficulty]: progression?.level ?? 0 } });
  } catch (err) {
    console.error("Erreur récupération progression :", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { type, difficulty, level } = await req.json();

    if (!type || !difficulty || typeof level !== "number") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const existing = await prisma.progressions.findFirst({
      where: { userId: user.id, type, difficulty },
    });

    let progression;
    if (existing) {
      const newLevel = Math.max(existing.level, level);
      progression = await prisma.progressions.update({
        where: { id: existing.id },
        data: { level: newLevel },
      });
    } else {
      progression = await prisma.progressions.create({
        data: { userId: user.id, type, difficulty, level },
      });
    }

    return NextResponse.json({ success: true, progression });
  } catch (err) {
    console.error("Erreur sauvegarde progression :", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
