"use client";

import type { ReactNode } from "react";

import LevelsPage from "@/components/games/LevelsPage";
import { LEVELS_BY_DIFFICULTY } from "@/lib/overflowing-palette/global";

export default function OverflowingPaletteDifficultyPage(): ReactNode {
  return (
    <LevelsPage
      name="Overflowing palette"
      targetLevels={LEVELS_BY_DIFFICULTY}
    />
  );
}
