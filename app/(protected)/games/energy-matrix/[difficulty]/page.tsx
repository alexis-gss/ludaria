"use client";

import type { ReactNode } from "react";

import LevelsPage from "@/components/games/LevelsPage";
import { LEVELS_BY_DIFFICULTY } from "@/lib/energy-matrix/global";

export default function EnergyMatrixDifficultyPage(): ReactNode {
  return (
    <LevelsPage name="Energy matrix" targetLevels={LEVELS_BY_DIFFICULTY} />
  );
}
