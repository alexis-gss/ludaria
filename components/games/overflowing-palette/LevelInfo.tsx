"use client";

import { InfoIcon } from "lucide-react";

import type { CellColor } from "@/types/overflowing-palette";
import type { DifficultyType } from "@prisma/client";

import BtnBackTo, { DeepPageEnum } from "@/components/games/BtnBackTo";
import RemainingMoves from "@/components/games/RemainingMoves";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import str from "@/hooks/use-string";
import { COLOR_CLASSES } from "@/lib/overflowing-palette/global";

interface LevelInfoProps {
  slug: string;
  level: number;
  movesLeft: number;
  target: CellColor;
  difficulty: DifficultyType;
  onClick: () => void;
}

export default function LevelInfo({
  slug,
  level,
  movesLeft,
  target,
  difficulty,
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
        <RemainingMoves number={movesLeft} />
        <div className="flex items-center justify-center gap-2">
          <span>Goal:</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`w-6 h-6 rounded ${COLOR_CLASSES[target]}`} />
            </TooltipTrigger>
            <TooltipContent className="text-center">
              Turn all blocks into{" "}
              <div className={`font-bold text-${target}-500`}>
                {str(target).upperCase().value()}
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
