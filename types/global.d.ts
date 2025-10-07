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

export type AnyLevelDef = { id: number; moves?: number };

export type PublicUser = {
  id: number;
  pseudo: string;
  email: string;
  createdAt?: string | null;
  updatedAt?: string | null;
} | null;
