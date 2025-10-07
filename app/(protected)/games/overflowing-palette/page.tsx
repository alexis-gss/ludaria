"use client";

import type { ReactNode } from "react";

import DifficultyPage from "@/components/games/DifficultyPage";
import { LEVELS_BY_DIFFICULTY } from "@/lib/overflowing-palette/global";

export default function OverflowingPalette(): ReactNode {
  return (
    <DifficultyPage name="Overflowing palette" levels={LEVELS_BY_DIFFICULTY} />
  );
}
