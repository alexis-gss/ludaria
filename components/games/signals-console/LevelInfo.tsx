"use client";

import { InfoIcon } from "lucide-react";

import type { DifficultyType } from "@prisma/client";

import BtnBackTo, { DeepPageEnum } from "@/components/games/BtnBackTo";
import RemainingMoves from "@/components/games/RemainingMoves";
import { Button } from "@/components/ui/button";

interface LevelInfoProps {
  slug: string;
  level: number;
  difficulty: DifficultyType;
  maxSegments: number;
  segmentsUsed: number;
  onClick: () => void;
}

export default function LevelInfo({
  slug,
  level,
  difficulty,
  maxSegments,
  segmentsUsed,
  onClick,
}: LevelInfoProps) {
  return (
    <div className="text-center w-[348px] relative">
      <div className="flex gap-2 w-fit mx-auto">
        <BtnBackTo deepPage={DeepPageEnum.LEVELS} slug={slug} />
        <Button
          type="button"
          variant="ghost"
          className="cursor-pointer"
          onClick={onClick}
        >
          <InfoIcon /> Tuto
        </Button>
      </div>
      <h2 className="text-xl font-bold mt-8 mb-5">
        Level {level}{" "}
        <span className="text-muted-foreground">({difficulty})</span>
      </h2>
      <div className="flex items-center justify-between gap-2 mt-5 mb-2 relative">
        <RemainingMoves number={maxSegments - segmentsUsed} />
      </div>
    </div>
  );
}
