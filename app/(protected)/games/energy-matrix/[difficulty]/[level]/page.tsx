"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import type { DifficultyType } from "@prisma/client";

import LevelInfo from "@/components/energy-matrix/LevelInfo";
import OverlayTuto from "@/components/games/OverlayTuto";
import {
  LEVELS_BY_DIFFICULTY,
  TUTOS_BY_DIFFICULTY,
} from "@/lib/energy-matrix/global";

export default function EnergyMatrixLevelPage() {
  const slug = "energy-matrix";
  const { difficulty, level } = useParams();
  const diff = difficulty as DifficultyType;
  const levelNum = Number(level);

  const levels = LEVELS_BY_DIFFICULTY[diff] || [];
  const levelDef = levels.find((l) => l.id === levelNum);

  // Overlays tuto.
  const [info, setInfo] = useState(false);
  const [steps, setSteps] = useState(1);
  const overlays = TUTOS_BY_DIFFICULTY[diff];
  const overlay = overlays[steps as keyof typeof overlays];

  if (!levelDef) return null;

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center">
      {info && overlay ? (
        <OverlayTuto
          {...overlay}
          onClick={() => setSteps(steps + 1)}
          steps={steps}
          maxSteps={Object.keys(overlays).length}
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
      </div>
      {/* <Grid level={level} /> */}
    </main>
  );
}
