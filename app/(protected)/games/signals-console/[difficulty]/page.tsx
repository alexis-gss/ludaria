"use client";

import type { ReactNode } from "react";

import LevelsPage from "@/components/games/LevelsPage";
import { LEVELS_BY_DIFFICULTY } from "@/lib/signals-console/global";
import { GAMES } from "@/lib/utils";

const game = GAMES.find((g) => g.slug === "signals-console")!;

export default function DifficultyPage(): ReactNode {
  return <LevelsPage name={game.title} targetLevels={LEVELS_BY_DIFFICULTY} />;
}
