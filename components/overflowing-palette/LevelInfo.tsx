"use client";

import { motion } from "framer-motion";
import { InfoIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { Color } from "@/types/overflowing-palette";
import type { DifficultyType } from "@prisma/client";

import BtnBackTo, { DeepPageEnum } from "@/components/games/BtnBackTo";
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
  target: Color;
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
  const [, setPrevMoves] = useState(movesLeft);

  // On retient la plus grande valeur observée (typiquement la valeur de départ)
  const maxObservedRef = useRef<number>(movesLeft);

  useEffect(() => {
    setPrevMoves(movesLeft);
    // Si on voit une valeur plus grande (par ex. reset qui remet à la valeur initiale),
    // on met à jour le maximum observé.
    if (movesLeft > maxObservedRef.current) {
      maxObservedRef.current = movesLeft;
    }
  }, [movesLeft]);

  // Ratio entre 0 et 1 (éviter division par zéro)
  const maxVal = Math.max(1, maxObservedRef.current);
  const ratio = Math.max(0, Math.min(1, movesLeft / maxVal));

  // On convertit ratio en teinte HSL : 0 -> rouge (0deg), 1 -> vert (120deg)
  // On inverse si tu veux l’autre sens ; ici ratio élevé = vert (bon), ratio faible = rouge (danger)
  const hue = Math.round(ratio * 120);
  const saturation = 85;
  const lightness = 45;
  const colorCss = `hsl(${hue} ${saturation}% ${lightness}%)`;

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
        <div className="relative flex items-center gap-1">
          <span>Remaining moves:</span>
          <div className="relative w-3 h-6 overflow-hidden">
            <motion.span
              key={movesLeft}
              className="absolute left-0 w-full text-center font-bold"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.12 }}
              style={{ color: colorCss, transition: "color 300ms ease" }}
            >
              {movesLeft}
            </motion.span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <span>Goal:</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`w-6 h-6 rounded ${COLOR_CLASSES[target]}`} />
            </TooltipTrigger>
            <TooltipContent className="text-center">
              Turn all blocks into{" "}
              <div className={`font-bold text-${target}-500`}>
                {str(target).capitalize().value()}
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
