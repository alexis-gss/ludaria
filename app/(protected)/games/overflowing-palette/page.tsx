"use client";

import type { ReactNode } from "react";

import DifficultyPage from "@/components/games/DifficultyPage";
import { LEVELS_BY_DIFFICULTY } from "@/lib/overflowing-palette/global";
import { GAMES } from "@/lib/utils";

export default function OverflowingPalette(): ReactNode {
  return (
    <DifficultyPage name={GAMES[0].title} levels={LEVELS_BY_DIFFICULTY} />
  );
}
