"use client";

import type { ReactNode } from "react";

import LevelsPage from "@/components/games/LevelsPage";
import { LEVELS_BY_DIFFICULTY } from "@/lib/signals-console/global";

export default function SignalsConsoleDifficultyPage(): ReactNode {
  return (
    <LevelsPage name="Signals console" targetLevels={LEVELS_BY_DIFFICULTY} />
  );
}
