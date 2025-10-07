"use client";

import { MoveRightIcon, RefreshCcwIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import BtnBackTo, { DeepPageEnum } from "@/components/games/BtnBackTo";
import { useSound } from "@/components/SoundProvider";
import { Button } from "@/components/ui/button";

const victoryMessages = [
  "🎉 Nailed it — the colors obey you now!",
  "🌈 You painted that level perfectly!",
  "💪 Flawless clicks, color champ!",
  "🔥 That was smoother than a rainbow fade!",
  "🎨 Colors had no chance this time!",
];

const defeatMessages = [
  "😢 Colors won this round…",
  "💥 Well… that escalated quickly",
  "🎯 Not your lucky click…",
  "🤔 Maybe the blocks cheated?",
  "🎨 Close, but not colorful enough",
];

interface EndLevelModalProps {
  slug: string;
  won: boolean;
  onRetry: () => void;
  onNext: () => void;
}

export default function EndLevelModal({ slug, won, onRetry, onNext }: EndLevelModalProps) {
  const [vistoryMessage, setVictoryMessage] = useState(victoryMessages[0]);
  const [defeatMessage, setDefeatMessage] = useState(defeatMessages[0]);
  const { muted } = useSound();

  const sounds = useRef({
    win: null as HTMLAudioElement | null,
    lose: null as HTMLAudioElement | null,
  });

  const playSound = useCallback(
    (type: keyof typeof sounds.current) => {
      if (muted || !sounds.current[type]) return;
      const sound = sounds.current[type];
      if (!sound) return;
      sound.currentTime = 0;
      sound.play().catch(() => {});
    },
    [muted],
  );

  useEffect(() => {
    sounds.current.win = new Audio("/sounds/win.mp3");
    sounds.current.lose = new Audio("/sounds/lose.mp3");
  }, []);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * defeatMessages.length);
    if (won) {
      playSound("win");
      setVictoryMessage(victoryMessages[randomIndex]);
    } else {
      playSound("lose");
      setDefeatMessage(defeatMessages[randomIndex]);
    }
  }, [won, playSound]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <div className="bg-card rounded-xl p-6 w-80 flex flex-col items-center gap-4 shadow-xl">
        <h2 className="text-xl text-center font-bold">
          {won ? vistoryMessage : defeatMessage}
        </h2>

        <div className="flex flex-col gap-3 w-full">
          {won ? (
            <Button type="button" className="cursor-pointer" onClick={onNext}>
              Next level <MoveRightIcon />
            </Button>
          ) : null}

          <Button
            type="button"
            variant={won ? "ghost" : "default"}
            className="cursor-pointer"
            onClick={onRetry}
          >
            <RefreshCcwIcon /> Play again
          </Button>

          <BtnBackTo deepPage={DeepPageEnum.LEVELS} slug={slug} />
        </div>
      </div>
    </div>
  );
}
