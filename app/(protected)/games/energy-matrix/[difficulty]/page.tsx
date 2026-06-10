"use client";

import type { ReactNode } from "react";

import LevelsPage from "@/components/games/LevelsPage";
import { LEVELS_BY_DIFFICULTY } from "@/lib/energy-matrix/global";
import { GAMES } from "@/lib/utils";

const game = GAMES.find((g) => g.slug === "energy-matrix")!;

export default function DifficultyPage(): ReactNode {
  return <LevelsPage name={game.title} targetLevels={LEVELS_BY_DIFFICULTY} />;
}
