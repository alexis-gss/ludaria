"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import type { DifficultyType } from "@prisma/client";

import Grid from "@/components/games/energy-matrix/Grid";
import LevelInfo from "@/components/games/energy-matrix/LevelInfo";
import OverlayTuto from "@/components/games/OverlayTuto";
import {
  LEVELS_BY_DIFFICULTY,
  TUTOS_BY_DIFFICULTY,
} from "@/lib/energy-matrix/global";
import { GAMES } from "@/lib/utils";

export default function EnergyMatrixLevelPage() {
  const { difficulty, level } = useParams();

  const [info, setInfo] = useState<boolean>(false);
  const [steps, setSteps] = useState<number>(1);

  const slug = GAMES[1].slug;
  const diff = difficulty as DifficultyType;
  const levelNum = Number(level);
  const levels = LEVELS_BY_DIFFICULTY[diff] || [];
  const levelDef = levels.find((l) => l.id === levelNum);
  const overlays = TUTOS_BY_DIFFICULTY[diff];
  const overlay = overlays[steps as keyof typeof overlays];

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
      <div className="max-w-7xl mx-auto p-6 pt-18">
        <LevelInfo
          slug={slug}
          level={levelDef.id}
          difficulty={diff}
          onClick={() => {
            setInfo(true);
            setSteps(1);
          }}
        />
        <Grid level={levelDef} />
      </div>
    </main>
  );
}
