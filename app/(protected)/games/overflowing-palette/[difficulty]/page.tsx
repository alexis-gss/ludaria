"use client";

import type { ReactNode } from "react";

import LevelsPage from "@/components/games/LevelsPage";
import { LEVELS_BY_DIFFICULTY } from "@/lib/overflowing-palette/global";
import { GAMES } from "@/lib/utils";

export default function OverflowingPaletteDifficultyPage(): ReactNode {
  return (
    <LevelsPage name={GAMES[0].title} targetLevels={LEVELS_BY_DIFFICULTY} />
  );
}
