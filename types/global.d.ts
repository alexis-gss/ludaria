import type { PuzzleType } from "@prisma/client";
import type { LucideIcon } from "lucide-react";

export type Game = {
  id: number;
  slug: string;
  icon: LucideIcon;
  title: string;
  description: string;
  type: PuzzleType;
};

export type Tuto = {
  width: string,
  height: string,
  top: string,
  left?: string,
  content: string,
  borderRadius?: number;
  overlayColor?: string;
};

/** Minimal shape shared by all game LevelDef types */
export type AnyLevelDef = { id: number; moves?: number };
