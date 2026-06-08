"use client";

import type { ReactNode } from "react";

import LevelsPage from "@/components/games/LevelsPage";
import { LEVELS_BY_DIFFICULTY } from "@/lib/signals-console/global";
import { GAMES } from "@/lib/utils";

export default function SignalsConsoleDifficultyPage(): ReactNode {
  return (
    <LevelsPage name={GAMES[2].title} targetLevels={LEVELS_BY_DIFFICULTY} />
  );
}
