"use client";

import { notFound } from "next/navigation";

import type { ReactNode } from "react";

import LevelsPage from "@/components/games/LevelsPage";
import { LEVELS_BY_DIFFICULTY } from "@/lib/overflowing-palette/variables";
import { GAMES } from "@/lib/variables";

const game = GAMES.find((game) => game.slug === "overflowing-palette");

export default function DifficultyPage(): ReactNode {
  if (!game) notFound();

  return <LevelsPage name={game.title} targetLevels={LEVELS_BY_DIFFICULTY} />;
}
