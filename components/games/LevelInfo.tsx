"use client";

import { InfoIcon } from "lucide-react";

import type { DifficultyType } from "@prisma/client";

import BtnBackTo, { DeepPageEnum } from "@/components/games/BtnBackTo";
import DynamicCounter from "@/components/games/DynamicCounter";
import { Button } from "@/components/ui/button";

interface LevelInfoBaseProps {
  slug: string;
  level: number;
  difficulty: DifficultyType;
  onClick: () => void;
}

interface LevelInfoWithCounter extends LevelInfoBaseProps {
  counter: number;
  counterLabel?: string;
  /** Extra content rendered to the right of the counter (e.g. goal color swatch) */
  extra?: React.ReactNode;
}

type LevelInfoProps = LevelInfoWithCounter;

export default function LevelInfo({
  slug,
  level,
  difficulty,
  counter,
  counterLabel,
  extra,
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
      <h2 className="text-xl font-bold mt-8">
        Level {level}{" "}
        <span className="text-muted-foreground">({difficulty})</span>
      </h2>
      <div className="flex items-center justify-between gap-2 mt-5 mb-2 relative">
        <DynamicCounter number={counter} label={counterLabel} />
        {extra}
      </div>
    </div>
  );
}
