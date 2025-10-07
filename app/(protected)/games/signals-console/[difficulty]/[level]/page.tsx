"use client";

import { PuzzleType } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import type { DifficultyType } from "@prisma/client";

import BtnResetGrid from "@/components/games/BtnResetGrid";
import OverlayTuto from "@/components/games/OverlayTuto";
import CanvasGrid, { type Path } from "@/components/signals-console/CanvasGrid";
import EndLevelModal from "@/components/signals-console/EndLevelModal";
import LevelInfo from "@/components/signals-console/LevelInfo";
import {
  LEVELS_BY_DIFFICULTY,
  TUTOS_BY_DIFFICULTY,
} from "@/lib/signals-console/global";

export default function SignalsConsoleLevelPage() {
  const slug = "signals-console";
  const { level, difficulty } = useParams();
  const levelNum = Number(level);
  const router = useRouter();
  const diff = difficulty as DifficultyType;
  const difficultyLevels = LEVELS_BY_DIFFICULTY[diff];

  const [steps, setSteps] = useState<number>(1);
  const overlays = TUTOS_BY_DIFFICULTY[diff];
  const overlay = overlays[steps as keyof typeof overlays];
  const [info, setInfo] = useState<boolean>(false);
  const [levelDef] = useState(() =>
    difficultyLevels.find((l) => l.id === Number(level)),
  );
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  const [paths, setPaths] = useState<Path[]>([]);
  const [segmentsUsed, setSegmentsUsed] = useState<number>(0);

  // 🔐 Vérifie que l'utilisateur a débloqué le niveau
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch("/api/progression", { cache: "no-store" });
        if (!res.ok) return;
        const data: Record<
          PuzzleType,
          Record<DifficultyType, number>
        > = await res.json();
        const progressionLevel = data.signals_console?.[diff];
        if (levelNum === 1) setInfo(true);
        if (levelNum > progressionLevel + 1) {
          router.push(`/games/signals-console/${diff}`);
        }
      } catch (err) {
        console.error("Erreur récupération progression:", err);
      }
    };
    fetchProgress();
  }, [diff, levelNum, router]);

  const handleReset = useCallback(() => {
    setPaths([]);
    setWon(false);
    setGameOver(false);
    setSegmentsUsed(0);
  }, []);

  const handleWin = async () => {
    setWon(true);
    setGameOver(true);
    // ✅ POST vers la nouvelle route /api/progression
    try {
      await fetch("/api/progression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: PuzzleType.signals_console,
          difficulty: diff,
          level: levelDef?.id,
        }),
      });
    } catch (err) {
      console.error("Erreur sauvegarde progression :", err);
    }
  };

  const handleSegmentsChange = useCallback(
    (used: number) => {
      setSegmentsUsed(used);
      if (levelDef && used > levelDef.moves) {
        setWon(false);
        setGameOver(true);
      }
    },
    [levelDef],
  );

  if (!levelDef) return null;

  return (
    <main className="max-w-7xl mx-auto min-h-screen p-6 pt-18 flex flex-col items-center justify-center">
      {info && overlay ? (
        <OverlayTuto
          {...overlay}
          steps={steps}
          maxSteps={Object.keys(overlays).length}
          onClick={() => setSteps(steps + 1)}
        />
      ) : null}
      <LevelInfo
        slug={slug}
        level={levelDef.id}
        difficulty={diff}
        onClick={() => {
          setInfo(true);
          setSteps(1);
        }}
        maxSegments={levelDef.moves}
        segmentsUsed={segmentsUsed}
      />
      <CanvasGrid
        level={levelDef}
        paths={paths}
        onPathsChange={setPaths}
        onWin={handleWin}
        onSegmentsChange={handleSegmentsChange}
      />
      <div className="mt-8">
        <BtnResetGrid onClick={handleReset} shortcut="R" />
      </div>
      {gameOver ? (
        <EndLevelModal
          slug={slug}
          won={won}
          onRetry={handleReset}
          onNext={() => {
            if (won && levelDef.id < difficultyLevels.length)
              router.push(`/games/${slug}/${diff}/${levelDef.id + 1}`);
          }}
        />
      ) : null}
    </main>
  );
}
