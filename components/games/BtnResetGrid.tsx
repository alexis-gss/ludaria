"use client";

import { RefreshCcwIcon } from "lucide-react";
import { useEffect, useRef, useCallback } from "react";
import { isDesktop } from "react-device-detect";

import { useSound } from "@/components/SoundProvider";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ResetButtonProps {
  onClick: () => void;
  shortcut?: string;
  label?: string;
}

export default function BtnResetGrid({
  onClick,
  shortcut = "R",
  label = "Reset the grid",
}: ResetButtonProps) {
  const { muted } = useSound();
  const soundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    soundRef.current = new Audio("/sounds/reset.mp3");
  }, []);

  const handleClick = useCallback(() => {
    if (!muted && soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(() => {});
    }
    onClick();
  }, [muted, onClick]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const isEditable =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        target?.isContentEditable ||
        target?.getAttribute("role") === "textbox";
      if (isEditable) return;
      if (e.key.toLowerCase() === shortcut.toLowerCase()) {
        e.preventDefault();
        handleClick();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcut, handleClick]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="relative w-12 h-12 rounded-full cursor-pointer"
          onClick={handleClick}
        >
          <RefreshCcwIcon />
          {isDesktop && shortcut ? (
            <Kbd className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2">
              {shortcut}
            </Kbd>
          ) : null}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
