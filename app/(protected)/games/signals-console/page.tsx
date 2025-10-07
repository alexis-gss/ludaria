"use client";

import type { ReactNode } from "react";

import DifficultyPage from "@/components/games/DifficultyPage";
import { LEVELS_BY_DIFFICULTY } from "@/lib/signals-console/global";

export default function SignalsConsole(): ReactNode {
  return (
    <DifficultyPage name="Signals console" levels={LEVELS_BY_DIFFICULTY} />
  );
}
