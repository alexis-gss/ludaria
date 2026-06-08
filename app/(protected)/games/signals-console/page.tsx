"use client";

import type { ReactNode } from "react";

import DifficultyPage from "@/components/games/DifficultyPage";
import { LEVELS_BY_DIFFICULTY } from "@/lib/signals-console/global";
import { GAMES } from "@/lib/utils";

export default function SignalsConsole(): ReactNode {
  return (
    <DifficultyPage name={GAMES[2].title} levels={LEVELS_BY_DIFFICULTY} />
  );
}
