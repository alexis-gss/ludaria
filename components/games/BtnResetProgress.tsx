"use client";

import { PuzzleType } from "@prisma/client";
import { RefreshCcwIcon } from "lucide-react";
import { useState } from "react";

import type { DifficultyType} from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { highlightingText } from "@/lib/utils";

interface BtnResetProgressProps {
  difficulty?: DifficultyType;
}

export default function BtnResetProgress({
  difficulty,
}: BtnResetProgressProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const label = difficulty
    ? "Reset levels progress"
    : "Reset all difficulty progress";

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await fetch("/api/progression/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: PuzzleType.overflowing_palette,
          difficulty: difficulty ?? null,
        }),
      });

      location.reload();
    } catch (err) {
      console.error("Error when resetting progress:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer flex items-center gap-2 transition-all duration-300"
          type="button"
          variant="ghost"
        >
          <RefreshCcwIcon className={loading ? "animate-spin" : ""} />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] border-none">
        <DialogHeader>
          <DialogTitle>Confirm reset</DialogTitle>
          <DialogDescription
            dangerouslySetInnerHTML={{
              __html: difficulty
                ? `Do you really want to reset the progress of the current difficulty ${highlightingText(difficulty)} ?`
                : "Do you really want to reset all progress ?",
            }}
          />
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button
            className="cursor-pointer transition-all duration-300 border-none"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer transition-all duration-300 border-none"
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Resetting…" : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
