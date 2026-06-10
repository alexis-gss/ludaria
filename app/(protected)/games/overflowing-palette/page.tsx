"use client";

import type { ReactNode } from "react";

import DifficultyPage from "@/components/games/DifficultyPage";
import { LEVELS_BY_DIFFICULTY } from "@/lib/overflowing-palette/variables";
import { GAMES } from "@/lib/variables";

export default function OverflowingPalette(): ReactNode {
  return (
    <DifficultyPage name={GAMES[0].title} levels={LEVELS_BY_DIFFICULTY} />
  );
}
