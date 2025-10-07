"use client";

import { DifficultyType } from "@prisma/client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

import type { LevelDef as LevelDefEnergyMatrix } from "@/types/energy-matrix";
import type { LevelDef as LevelDefOverflowingPalette } from "@/types/overflowing-palette";
import type { LevelDef as LevelDefSignalsConsole } from "@/types/signals-console";
import type { PuzzleType } from "@prisma/client";

import { ExpandingColumn } from "@/components/ExpandingColumn";
import BtnBackTo from "@/components/games/BtnBackTo";
import BtnResetProgress from "@/components/games/BtnResetProgress";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import str from "@/hooks/use-string";
import { cn } from "@/lib/utils";

const DIFFICULTY_META = [
  {
    key: DifficultyType.easy,
    label: "Easy",
    accent: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-400",
    bar: "[&>div]:bg-green-500",
    emoji: "🟢",
  },
  {
    key: DifficultyType.medium,
    label: "Medium",
    accent: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
    bar: "[&>div]:bg-yellow-500",
    emoji: "🟡",
  },
  {
    key: DifficultyType.hard,
    label: "Hard",
    accent: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    bar: "[&>div]:bg-red-500",
    emoji: "🔴",
  },
] as const;

export default function DifficultyPage({
  name,
  levels,
}: {
  name: string;
  levels: Record<
    DifficultyType,
    | LevelDefEnergyMatrix[]
    | LevelDefOverflowingPalette[]
    | LevelDefSignalsConsole[]
  >;
}) {
  const router = useRouter();
  const slug = str(name).slug().value();

  const difficulties = useMemo(() => DIFFICULTY_META, []);

  const [progress, setProgress] = useState<Record<DifficultyType, number>>({
    [DifficultyType.easy]: 0,
    [DifficultyType.medium]: 0,
    [DifficultyType.hard]: 0,
  });
  const [completed, setCompleted] = useState<Record<DifficultyType, boolean>>({
    [DifficultyType.easy]: false,
    [DifficultyType.medium]: false,
    [DifficultyType.hard]: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const fetchProgressions = async () => {
      try {
        const res = await fetch("/api/progression", { cache: "no-store" });
        if (!res.ok) return;
        const data: Record<
          PuzzleType,
          Record<DifficultyType, number>
        > = await res.json();

        const gameKey = str(name).snakeCase().value() as PuzzleType;

        const newProgress = { ...progress };
        const newCompleted = { ...completed };

        difficulties.forEach((d) => {
          const level = data[gameKey]?.[d.key] ?? 0;
          const totalLevels = levels[d.key]?.length ?? 0;
          newProgress[d.key] = Math.min(level, totalLevels);
          newCompleted[d.key] = level >= totalLevels;
        });

        setProgress(newProgress);
        setCompleted(newCompleted);
      } catch (err) {
        console.error("Erreur récupération progressions :", err);
      }
    };
    fetchProgressions();
  }, [mounted, difficulties, completed, progress, name, levels]);

  if (!mounted) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6">
        <p className="text-gray-500 animate-pulse">Loading…</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto min-h-screen p-6 pt-18 flex flex-col items-center justify-center gap-10">
      <div className="text-center pt-6 mb-8">
        <div className="flex flex-col md:flex-row justify-center items-center gap-2 mb-8">
          <BtnBackTo />
          <BtnResetProgress />
        </div>
        <h1 className="text-4xl font-extrabold mb-2">{name}</h1>
        <p className="text-gray-400 text-lg">
          Choose your difficulty level and complete all the levels!
        </p>
      </div>
      {/* Expanding columns */}
      <div className="flex flex-col md:flex-row w-full h-auto md:h-64 overflow-hidden rounded-2xl shadow-lg">
        {difficulties.map((d, i) => {
          const total = levels[d.key]?.length ?? 0;
          const done = progress[d.key];
          const pct = total ? Math.round((done / total) * 100) : 0;

          return (
            <ExpandingColumn
              key={d.key}
              index={i}
              accent={d.accent}
              borderBreakpoint="lg"
              onClick={() => router.push(`/games/${slug}/${d.key}`)}
            >
              {() => (
                <>
                  <p className="text-3xl mb-1">{d.emoji}</p>
                  <h2 className={cn("text-2xl font-bold mb-3", d.text)}>
                    {d.label}
                  </h2>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
                    className="w-40 mx-auto"
                  >
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>
                        {done} / {total} niveaux
                      </span>
                      <span>{pct}%</span>
                    </div>
                    <Progress
                      value={pct}
                      className={cn(
                        "h-2 bg-black/20 dark:bg-white/20 [&>div]:transition-all [&>div]:duration-300",
                        d.bar,
                      )}
                    />
                    {completed[d.key] ? (
                      <motion.p
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs mt-2 text-green-400 font-semibold"
                      >
                        🎉 Terminé !
                      </motion.p>
                    ) : null}
                  </motion.div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-4 font-semibold cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/games/${slug}/${d.key}`);
                    }}
                  >
                    View levels
                  </Button>
                </>
              )}
            </ExpandingColumn>
          );
        })}
      </div>
    </main>
  );
}
