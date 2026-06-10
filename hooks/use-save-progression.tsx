import { useCallback } from "react";

import type { DifficultyType, PuzzleType } from "@prisma/client";

interface UseSaveProgressionOptions {
  puzzleType: PuzzleType;
  diff: DifficultyType;
  levelId: number | undefined;
}

/**
 * Returns a stable callback that POSTs the completed level to /api/progression.
 */
export function useSaveProgression({
  puzzleType,
  diff,
  levelId,
}: UseSaveProgressionOptions) {
  return useCallback(async () => {
    try {
      await fetch("/api/progression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: puzzleType,
          difficulty: diff,
          level: levelId,
        }),
      });
    } catch (err) {
      console.error("Erreur sauvegarde progression:", err);
    }
  }, [puzzleType, diff, levelId]);
}
