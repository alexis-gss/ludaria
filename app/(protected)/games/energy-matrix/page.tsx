"use client";

import type { ReactNode } from "react";

import DifficultyPage from "@/components/games/DifficultyPage";
import { LEVELS_BY_DIFFICULTY } from "@/lib/energy-matrix/global";
import { GAMES } from "@/lib/utils";

export default function EnergyMatrix(): ReactNode {
  return (
    <DifficultyPage name={GAMES[1].title} levels={LEVELS_BY_DIFFICULTY} />
  );
}
