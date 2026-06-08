"use client";

import { PuzzleType } from "@prisma/client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";

import type { CellColor } from "@/types/overflowing-palette";
import type { DifficultyType } from "@prisma/client";

import BtnResetGrid from "@/components/games/BtnResetGrid";
import CanvasGrid from "@/components/games/overflowing-palette/CanvasGrid";
import ColorSelector from "@/components/games/overflowing-palette/ColorSelector";
import EndLevelModal from "@/components/games/overflowing-palette/EndLevelModal";
import LevelInfo from "@/components/games/overflowing-palette/LevelInfo";
import OverlayTuto from "@/components/games/OverlayTuto";
import {
  LEVELS_BY_DIFFICULTY,
  TUTOS_BY_DIFFICULTY,
} from "@/lib/overflowing-palette/global";
import { GAMES } from "@/lib/utils";

export default function OverflowingPaletteLevelPage() {
  const { difficulty, level } = useParams();
  const router = useRouter();

  const slug = GAMES[0].slug;
  const diff = difficulty as DifficultyType;
  const levelNum = Number(level);

  const levels = LEVELS_BY_DIFFICULTY[diff] || [];
  const levelDef = levels.find((l) => l.id === levelNum);

  const [grid, setGrid] = useState<CellColor[][]>(
    levelDef ? levelDef.grid.map((r) => [...r]) : []
  );
  const [selectedColor, setSelectedColor] = useState<CellColor>("blue");
  const [movesLeft, setMovesLeft] = useState<number>(levelDef ? levelDef.moves : 0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  const [celebrate, setCelebrate] = useState<boolean>(false);
  const [movesUsed, setMovesUsed] = useState<number>(0);
  const animatingRef = useRef(false);

  // Overlays tuto.
  const [info, setInfo] = useState<boolean>(false);
  const [steps, setSteps] = useState<number>(1);
  const overlays = TUTOS_BY_DIFFICULTY[diff];
  const overlay = overlays[steps as keyof typeof overlays];

  const handleReset = useCallback(() => {
    if (!levelDef) return;
    setGrid(levelDef.grid.map((r) => [...r]));
    setMovesLeft(levelDef.moves);
    setGameOver(false);
    setWon(false);
    setCelebrate(false);
    setMovesUsed(0);
  }, [levelDef]);

  // ✅ Sécurisation et réinitialisation de la grille
  useEffect(() => {
    if (!levels.length || !levelDef) {
      router.push(`/games/overflowing-palette/${diff}`);
      return;
    }
    setGrid(levelDef.grid.map((r) => [...r]));
    setMovesLeft(levelDef.moves);
  }, [levels.length, levelDef, diff, router]);

  // 🔐 Vérifie que l’utilisateur a débloqué le niveau
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch("/api/progression", { cache: "no-store" });
        if (!res.ok) return;

        const data: Record<
          PuzzleType,
          Record<DifficultyType, number>
        > = await res.json();
        const progressionLevel = data.overflowing_palette?.[diff];
        if (levelNum === 1) {
          setInfo(true);
        }
        if (levelNum > progressionLevel + 1) {
          router.push(`/games/overflowing-palette/${diff}`);
        }
      } catch (err) {
        console.error("Erreur récupération progression:", err);
      }
    };
    fetchProgress();
  }, [diff, levelNum, router]);

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const animateFloodFill = async (
    g: CellColor[][],
    sr: number,
    sc: number,
    newColor: CellColor
  ) => {
    animatingRef.current = true;
    const rows = g.length;
    const cols = g[0].length;
    const oldColor = g[sr][sc];
    if (oldColor === newColor) {
      animatingRef.current = false;
      return g;
    }

    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const visited = new Set<string>();
    const queue: [number, number, number][] = [[sr, sc, 0]];
    const waves: Map<number, [number, number][]> = new Map();

    while (queue.length) {
      const item = queue.shift();
      if (!item) continue;
      const [r, c, d] = item;
      const key = `${r}-${c}`;
      if (visited.has(key)) continue;
      visited.add(key);

      if (r < 0 || c < 0 || r >= rows || c >= cols) continue;
      if (g[r][c] !== oldColor || g[r][c] === "black") continue;

      if (!waves.has(d)) waves.set(d, []);
      const wave = waves.get(d);
      if (wave) wave.push([r, c]);

      for (const [dr, dc] of dirs) queue.push([r + dr, c + dc, d + 1]);
    }

    const waveDelay = 50;
    const maxWave = Math.max(...waves.keys());

    for (let d = 0; d <= maxWave; d++) {
      const cells = waves.get(d) || [];
      cells.forEach(([r, c]) => {
        g[r][c] = newColor;
      });
      setGrid(g.map((r) => [...r]));
      await delay(waveDelay);
    }

    animatingRef.current = false;
    return g;
  };

  const allTarget = (g: CellColor[][]) =>
    levelDef &&
    g
      .flat()
      .filter((c) => c !== "black")
      .every((c) => c === levelDef.target);

  const handleCellClick = async (r: number, c: number) => {
    if (!levelDef || gameOver || movesLeft <= 0 || animatingRef.current) return;

    const remaining = movesLeft - 1;
    const used = movesUsed + 1;
    setMovesLeft(remaining);
    setMovesUsed(used);

    const g = grid.map((r) => [...r]);

    await animateFloodFill(g, r, c, selectedColor);

    const UNFREEZE_AFTER = levelDef.unfreezeAfter ?? 0;
    const UNFREEZE_COLOR = levelDef.unfreezeColor ?? "yellow";
    if (UNFREEZE_AFTER > 0 && used >= UNFREEZE_AFTER) {
      for (let i = 0; i < g.length; i++) {
        for (let j = 0; j < g[i].length; j++) {
          if (g[i][j] === "frozen") g[i][j] = UNFREEZE_COLOR;
        }
      }
    }
    setGrid(g);

    if (allTarget(g)) {
      setTimeout(() => {
        setWon(true);
        setGameOver(true);
        setCelebrate(true);
      }, 300);

      // ✅ POST vers la nouvelle route /api/progression
      try {
        await fetch("/api/progression", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: PuzzleType.overflowing_palette,
            difficulty: diff,
            level: levelDef.id,
          }),
        });
      } catch (err) {
        console.error("Erreur sauvegarde progression :", err);
      }
      return;
    }

    if (remaining <= 0) {
      setTimeout(() => {
        setGameOver(true);
        setWon(false);
      }, 300);
    }
  };

  if (!levelDef) return null;

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center">
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
          movesLeft={movesLeft}
          target={levelDef.target}
          difficulty={diff}
          onClick={() => {
            setInfo(true);
            setSteps(1);
          }}
        />
        <CanvasGrid
          grid={grid}
          onCellClick={handleCellClick}
          celebrate={celebrate}
          animating={animatingRef.current}
        />
        <ColorSelector
          selectedColor={selectedColor}
          onSelect={setSelectedColor}
          difficulty={diff}
        >
          <BtnResetGrid onClick={handleReset} />
        </ColorSelector>
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
      </div>
    </main>
  );
}
