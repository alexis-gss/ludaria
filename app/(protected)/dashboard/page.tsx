"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { PuzzleType, DifficultyType } from "@prisma/client";

import { ExpandingColumn } from "@/components/ExpandingColumn";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DIFFICULTIES, GAMES } from "@/lib/utils";

export default function DashboardPage() {
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [overallProgress, setOverallProgress] = useState(0);

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

        const newProgress: Record<string, number> = {};

        for (const game of GAMES) {
          let totalCompleted = 0;
          let totalLevels = 0;

          for (const diff of DIFFICULTIES) {
            const lvl = data[game.type]?.[diff] ?? 0;
            totalCompleted += lvl;

            const levelsCount =
              (await import(`@/lib/${game.slug}/global`)).LEVELS_BY_DIFFICULTY[
                diff
              ]?.length ?? 0;
            totalLevels += levelsCount;
          }

          newProgress[game.slug] = totalLevels
            ? Math.round((totalCompleted / totalLevels) * 100)
            : 0;
        }
        setProgress(newProgress);

        // Calcul de la progression globale
        const totalPercent = Object.values(newProgress).reduce(
          (acc, val) => acc + val,
          0
        );
        const avgPercent = GAMES.length
          ? Math.round(totalPercent / GAMES.length)
          : 0;
        setOverallProgress(avgPercent);
      } catch (err) {
        console.error("Erreur lors de la récupération des progressions :", err);
      }
    };

    fetchProgress();
  }, []);

  return (
    <main className="max-w-7xl mx-auto min-h-screen p-6 pt-18 flex flex-col justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center pt-6 mb-8"
      >
        <h1 className="text-4xl font-extrabold mb-2">
          Welcome to your dashboard!
        </h1>
        <p className="text-gray-400 text-lg">
          Track your progress in all your puzzles and unlock new challenges.
        </p>
      </motion.div>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full md:w-2/3 mb-12"
      >
        <p className="text-center text-sm text-gray-400 mb-2">
          Overall progress {overallProgress}%
        </p>
        <Progress
          value={overallProgress}
          className="h-5 bg-black/20 dark:bg-white/20 [&>div]:transition-all [&>div]:duration-300"
        />
      </motion.section>
      <div
        className="
          flex flex-col lg:flex-row
          w-full h-auto lg:h-[500px]
          overflow-hidden rounded-2xl shadow-lg
        "
      >
        {GAMES.map((game, gameIndex) => (
          <ExpandingColumn
            key={game.id}
            index={gameIndex}
            accent="bg-purple-500/10"
            borderBreakpoint="lg"
            onClick={() => router.push(`/games/${game.slug}`)}
          >
            {() => (
              <>
                <h2 className="flex justify-center items-center text-2xl lg:text-3xl font-bold mb-2 whitespace-nowrap">
                  <game.icon className="text-purple-500 mt-1 mr-2 shrink-0" />
                  {game.title}
                </h2>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: 0.2 + gameIndex * 0.25 + 0.5,
                    duration: 0.6,
                  }}
                  className="flex items-center justify-between mt-auto w-[20rem]"
                >
                  <Progress
                    value={progress[game.slug] ?? 0}
                    className="h-3 bg-black/20 dark:bg-white/20 [&>div]:transition-all [&>div]:duration-300"
                  />
                  <span className="text-xs ms-2">
                    {progress[game.slug] ?? 0}%
                  </span>
                </motion.div>
                <motion.div className="text-sm w-[20rem] h-[10rem] mx-auto mt-3">
                  {/* eslint-disable-next-line react/no-danger */}
                  <div dangerouslySetInnerHTML={{ __html: game.description }} />
                </motion.div>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-4 font-semibold cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/games/${game.slug}`);
                  }}
                >
                  Play
                </Button>
              </>
            )}
          </ExpandingColumn>
        ))}
      </div>
    </main>
  );
}
