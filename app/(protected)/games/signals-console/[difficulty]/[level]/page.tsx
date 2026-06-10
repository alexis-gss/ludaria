"use client";

import { PuzzleType } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import type { DifficultyType } from "@prisma/client";

import BtnResetGrid from "@/components/games/BtnResetGrid";
import CanvasGrid, { type Path } from "@/components/games/signals-console/CanvasGrid";
import EndLevelModal from "@/components/games/EndLevelModal";
import LevelInfo from "@/components/games/LevelInfo";
import OverlayTuto from "@/components/games/OverlayTuto";
import { useProgressionGuard } from "@/hooks/use-progression-guard";
import { useSaveProgression } from "@/hooks/use-save-progression";
import {
  LEVELS_BY_DIFFICULTY,
  TUTOS_BY_DIFFICULTY,
} from "@/lib/signals-console/global";
import { GAMES } from "@/lib/utils";

export default function SignalsConsoleLevelPage() {
  const { difficulty, level } = useParams();
  const router = useRouter();

  const slug = GAMES[2].slug;
  const diff = difficulty as DifficultyType;
  const levelNum = Number(level);
  const levels = LEVELS_BY_DIFFICULTY[diff] || [];
  const levelDef = levels.find((l) => l.id === levelNum);

  const [info, setInfo] = useState(false);
  const [steps, setSteps] = useState(1);
  const overlays = TUTOS_BY_DIFFICULTY[diff];
  const overlay = overlays[steps as keyof typeof overlays];

  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [paths, setPaths] = useState<Path[]>([]);
  const [segmentsUsed, setSegmentsUsed] = useState(0);

  useProgressionGuard({
    puzzleType: PuzzleType.signals_console,
    diff,
    levelNum,
    onUnlocked: () => setInfo(true),
  });

  const saveProgression = useSaveProgression({
    puzzleType: PuzzleType.signals_console,
    diff,
    levelId: levelDef?.id,
  });

  const handleReset = useCallback(() => {
    setPaths([]);
    setWon(false);
    setGameOver(false);
    setSegmentsUsed(0);
  }, []);

  const handleWin = useCallback(async () => {
    setWon(true);
    setGameOver(true);
    await saveProgression();
  }, [saveProgression]);

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
          onClick={() => setSteps((s) => s + 1)}
        />
      ) : null}
      <LevelInfo
        slug={slug}
        level={levelDef.id}
        difficulty={diff}
        counter={levelDef.moves - segmentsUsed}
        onClick={() => {
          setInfo(true);
          setSteps(1);
        }}
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
            if (won && levelDef.id < levels.length)
              router.push(`/games/${slug}/${diff}/${levelDef.id + 1}`);
          }}
        />
      ) : null}
    </main>
  );
}
