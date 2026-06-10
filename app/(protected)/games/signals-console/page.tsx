"use client";

import type { ReactNode } from "react";

import DifficultyPage from "@/components/games/DifficultyPage";
import { LEVELS_BY_DIFFICULTY } from "@/lib/signals-console/variables";
import { GAMES } from "@/lib/variables";

export default function SignalsConsole(): ReactNode {
  return (
    <DifficultyPage name={GAMES[2].title} levels={LEVELS_BY_DIFFICULTY} />
  );
}
