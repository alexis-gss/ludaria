"use client";

import { InfoIcon } from "lucide-react";

import type { DifficultyType } from "@prisma/client";

import BtnBackTo, { DeepPageEnum } from "@/components/games/BtnBackTo";
import { Button } from "@/components/ui/button";

interface LevelInfoProps {
  slug: string;
  level: number;
  difficulty: DifficultyType;
  onClick: () => void;
}

export default function LevelInfo({
  slug,
  level,
  difficulty,
  onClick,
}: LevelInfoProps) {
  return (
    <div className="text-center w-[348px] relative">
      <div>
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
      <h2 className="text-xl font-bold mt-8">
        Level {level}{" "}
        <span className="text-muted-foreground">({difficulty})</span>
      </h2>
    </div>
  );
}
