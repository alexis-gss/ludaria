"use client";

import { Lock, Check } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { LevelDef as LevelDefEnergyMatrix } from "@/types/energy-matrix";
import type { LevelDef as LevelDefOverflowingPalette } from "@/types/overflowing-palette";
import type { LevelDef as LevelDefSignalsConsole } from "@/types/signals-console";
import type { DifficultyType, PuzzleType } from "@prisma/client";

import BtnBackTo, { DeepPageEnum } from "@/components/games/BtnBackTo";
import BtnResetProgress from "@/components/games/BtnResetProgress";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import str from "@/hooks/use-string";

export default function LevelsPage({
  name,
  targetLevels,
}: {
  name: string;
  targetLevels: Record<
    DifficultyType,
    | LevelDefOverflowingPalette[]
    | LevelDefEnergyMatrix[]
    | LevelDefSignalsConsole[]
  >;
}) {
  const slug = str(name).slug().value();
  const { difficulty } = useParams();
  const router = useRouter();
  const diff = difficulty as DifficultyType;

  const levels = targetLevels[diff] || [];
  const [unlocked, setUnlocked] = useState<number>(1);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch("/api/progression", { cache: "no-store" });
        if (!res.ok) throw new Error("Erreur réseau");

        const data: Record<
          PuzzleType,
          Record<DifficultyType, number>
        > = await res.json();

        const gameKey = str(name).snakeCase().value() as PuzzleType;
        const maxLevel = data[gameKey]?.[diff] ?? 0;

        setUnlocked(maxLevel + 1);
        setCompletedLevels(Array.from({ length: maxLevel }, (_, i) => i + 1));
      } catch (err) {
        console.error("Erreur récupération progression:", err);
        setUnlocked(1);
        setCompletedLevels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [diff, name]);

  const handleClick = (id: number, locked: boolean) => {
    if (!locked) router.push(`/games/${slug}/${diff}/${id}`);
  };

  const completedCount = completedLevels.length;
  const progress = levels.length
    ? Math.round((completedCount / levels.length) * 100)
    : 0;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-500 animate-pulse">Loading…</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto min-h-screen p-6 pt-18 flex flex-col items-center justify-center">
      <div className="text-center pt-6 mb-8">
        <div className="flex flex-col md:flex-row justify-center items-center gap-2 mb-8">
          <BtnBackTo deepPage={DeepPageEnum.DIFFICULTIES} slug={slug} />
          <BtnResetProgress difficulty={diff} />
        </div>
        <h1 className="text-2xl font-bold capitalize">{diff}</h1>
      </div>
      {/* Progress bar */}
      <div className="relative w-full md:w-1/2 mx-auto mt-4 mb-8">
        <p
          className="absolute inset-0 flex items-center justify-center font-semibold text-white pointer-events-none mb-1 z-10"
          style={{ mixBlendMode: "difference" }}
        >
          <span className="md:hidden">{progress}%</span>
          <span className="hidden md:inline">
            Progression : {completedCount}/{levels.length} niveaux ({progress}%)
          </span>
        </p>
        <Progress value={progress} className="h-6" />
      </div>
      {/* Levels grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10 justify-items-center gap-4 w-full">
        {levels.map((lvl) => {
          const locked = lvl.id > unlocked;
          const isCompleted = completedLevels.includes(lvl.id);
          return (
            <Button
              key={lvl.id}
              onClick={() => handleClick(lvl.id, locked)}
              disabled={locked}
              className={`relative flex flex-col items-center justify-center w-28 h-28 transition-all shadow-lg
                ${!locked && "cursor-pointer hover:scale-105 focus:scale-105"}
                ${isCompleted ? "bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 text-white dark:text-white/70" : ""}
                ${!locked && !isCompleted && "text-black bg-white hover:bg-black/10 dark:text-white/70 dark:bg-white/20 dark:hover:bg-white/10"}
              `}
            >
              <span className="font-semibold text-lg">Level {lvl.id}</span>
              {"moves" in lvl && (
                <span className="text-sm">({lvl.moves} moves)</span>
              )}
              {locked ? (
                <Lock className="absolute bottom-2 right-2 w-5 h-5 text-gray-400" />
              ) : isCompleted ? (
                <Check className="absolute bottom-2 right-2 w-5 h-5" />
              ) : null}
            </Button>
          );
        })}
      </div>
    </main>
  );
}
