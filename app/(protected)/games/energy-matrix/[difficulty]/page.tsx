"use client";

import type { ReactNode } from "react";

import LevelsPage from "@/components/games/LevelsPage";
import { LEVELS_BY_DIFFICULTY } from "@/lib/energy-matrix/global";
import { GAMES } from "@/lib/utils";

export default function EnergyMatrixDifficultyPage(): ReactNode {
  return (
    <LevelsPage name={GAMES[1].title} targetLevels={LEVELS_BY_DIFFICULTY} />
  );
}
