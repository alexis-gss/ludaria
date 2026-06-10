"use client";

import { PuzzleType } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import type { DifficultyType } from "@prisma/client";

import CanvasGrid from "@/components/games/energy-matrix/CanvasGrid";
import EndLevelModal from "@/components/games/EndLevelModal";
import LevelInfo from "@/components/games/LevelInfo";
import OverlayTuto from "@/components/games/OverlayTuto";
import { useProgressionGuard } from "@/hooks/use-progression-guard";
import { useSaveProgression } from "@/hooks/use-save-progression";
import {
  LEVELS_BY_DIFFICULTY,
  TUTOS_BY_DIFFICULTY,
} from "@/lib/energy-matrix/global";
import { GAMES } from "@/lib/utils";

export default function EnergyMatrixLevelPage() {
  const { difficulty, level } = useParams();
  const router = useRouter();

  const [info, setInfo] = useState(false);
  const [steps, setSteps] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const slug = GAMES[1].slug;
  const diff = difficulty as DifficultyType;
  const levelNum = Number(level);
  const levels = LEVELS_BY_DIFFICULTY[diff] || [];
  const levelDef = levels.find((l) => l.id === levelNum);
  const overlays = TUTOS_BY_DIFFICULTY[diff];
  const overlay = overlays[steps as keyof typeof overlays];

  const [remainingShapes, setRemainingShapes] = useState(
    levelDef ? levelDef.shapes.length : 0,
  );

  useProgressionGuard({
    puzzleType: PuzzleType.energy_matrix,
    diff,
    levelNum,
    onUnlocked: () => setInfo(true),
  });

  const saveProgression = useSaveProgression({
    puzzleType: PuzzleType.energy_matrix,
    diff,
    levelId: levelDef?.id,
  });

  const handleReset = useCallback(() => {
    if (!levelDef) return;
    setRemainingShapes(levelDef.shapes.length);
    setWon(false);
    setGameOver(false);
  }, [levelDef]);

  const handleWin = useCallback(async () => {
    setWon(true);
    setGameOver(true);
    await saveProgression();
  }, [saveProgression]);

  const handleShapesChange = useCallback((n: number) => {
    setRemainingShapes(n);
  }, []);

  if (!levelDef) return null;

  return (
    <main className="max-w-7xl mx-auto min-h-screen p-6 pt-18 flex flex-col items-center justify-center">
      {info && overlay ? (
        <OverlayTuto
          {...overlay}
          steps={steps}
          maxSteps={Object.keys(overlays).length}
          onClick={() => setSteps((s) => s + 1)}
        />
      ) : null}
      <div className="max-w-7xl mx-auto p-6 pt-18">
        <LevelInfo
          slug={slug}
          level={levelDef.id}
          difficulty={diff}
          counter={remainingShapes}
          counterLabel="Remaining shapes:"
          onClick={() => {
            setInfo(true);
            setSteps(1);
          }}
        />
        <CanvasGrid
          level={levelDef}
          onShapesChange={handleShapesChange}
          onWin={handleWin}
        />
      </div>
      {gameOver ? (
        <EndLevelModal
          slug={slug}
          won={won}
          onRetry={handleReset}
          onNext={() => {
            if (won && levelDef.id < levels.length)
              router.push(`/games/${slug}/${diff}/${levelDef.id + 1}`);
          }}
        />
      ) : null}
    </main>
  );
}
