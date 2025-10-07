"use client";

import type { ReactNode } from "react";

import DifficultyPage from "@/components/games/DifficultyPage";
import { LEVELS_BY_DIFFICULTY } from "@/lib/energy-matrix/global";

export default function EnergyMatrix(): ReactNode {
  return <DifficultyPage name="Energy matrix" levels={LEVELS_BY_DIFFICULTY} />;
}
