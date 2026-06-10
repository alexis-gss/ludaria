import { useEffect } from "react";
import { useRouter } from "next/navigation";

import type { DifficultyType, PuzzleType } from "@prisma/client";

interface UseProgressionGuardOptions {
  puzzleType: PuzzleType;
  diff: DifficultyType;
  levelNum: number;
  onUnlocked?: () => void;
}

/**
 * Fetches the user's progression and redirects if the requested level
 * has not been unlocked yet. Calls onUnlocked when levelNum === 1.
 */
export function useProgressionGuard({
  puzzleType,
  diff,
  levelNum,
  onUnlocked,
}: UseProgressionGuardOptions) {
  const router = useRouter();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch("/api/progression", { cache: "no-store" });
        if (!res.ok) return;

        const data: Record<
          PuzzleType,
          Record<DifficultyType, number>
        > = await res.json();
        const progressionLevel = data[puzzleType]?.[diff] ?? 0;

        if (levelNum === 1) onUnlocked?.();
        if (levelNum > progressionLevel + 1) {
          // Derive game slug from PuzzleType (underscores → hyphens)
          const slug = puzzleType.replace(/_/g, "-");
          router.push(`/games/${slug}/${diff}`);
        }
      } catch (err) {
        console.error("Erreur récupération progression:", err);
      }
    };

    fetchProgress();
  }, [diff, levelNum, puzzleType, router, onUnlocked]);
}
