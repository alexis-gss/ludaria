"use client";

import { motion } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { isDesktop } from "react-device-detect";

import type { Color } from "@/types/overflowing-palette";
import type { DifficultyType } from "@prisma/client";

import { Kbd } from "@/components/ui/kbd";
import { COLOR_CLASSES } from "@/lib/overflowing-palette/global";
import { DIFFICULTIES } from "@/lib/utils";

interface ColorSelectorProps {
  selectedColor: Color;
  onSelect: (c: Color) => void;
  difficulty: DifficultyType;
  children?: React.ReactNode;
}

type ColorMapEntry = { keyLabel: string; code: string; color: Color };

export default function ColorSelector({
  selectedColor,
  onSelect,
  difficulty,
  children,
}: ColorSelectorProps) {
  const COLOR_MAP = useMemo<ColorMapEntry[]>(() => {
    const map: ColorMapEntry[] = [
      { keyLabel: "Q", code: "KeyQ", color: "blue" },
      { keyLabel: "S", code: "KeyS", color: "red" },
      { keyLabel: "D", code: "KeyD", color: "green" },
    ];

    // Jaune disponible à partir de 'moyen' (DIFFICULTIES[1])
    if (difficulty === DIFFICULTIES[1] || difficulty === DIFFICULTIES[2]) {
      map.push({ keyLabel: "F", code: "KeyF", color: "yellow" });
    }

    // Violet uniquement pour 'difficile' (DIFFICULTIES[2])
    if (difficulty === DIFFICULTIES[2]) {
      map.push({ keyLabel: "G", code: "KeyG", color: "purple" });
    }

    return map;
  }, [difficulty]);

  const [muted, setMuted] = useState(false);

  const soundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    soundRef.current = new Audio("/sounds/change.mp3");
  }, []);

  // Charger la préférence mute depuis localStorage (client-only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("palette_muted") === "true";
    setMuted(saved);
  }, []);

  // Memoized playSound
  const playSound = useCallback(() => {
    if (muted || !soundRef.current) return;
    soundRef.current.currentTime = 0;
    soundRef.current.play().catch(() => {});
  }, [muted]);

  // Memoized handleSelect
  const handleSelect = useCallback(
    (color: Color) => {
      onSelect(color);
      playSound();
    },
    [onSelect, playSound] // stable
  );

  // Gestion du clavier
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const isEditable =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        target?.isContentEditable ||
        target?.getAttribute("role") === "textbox";
      if (isEditable) return;

      // Priorité au code (touche physique) — robuste entre AZERTY/QWERTY
      const byCode = COLOR_MAP.find((m) => m.code === e.code);
      if (byCode) {
        e.preventDefault();
        handleSelect(byCode.color);
        return;
      }

      // Fallback : tenter d’utiliser le caractère tapé (utile pour layouts particuliers)
      if (typeof e.key === "string" && e.key.length === 1) {
        const keyChar = e.key.toLowerCase();
        const byKeyLabel = COLOR_MAP.find(
          (m) => m.keyLabel.toLowerCase() === keyChar
        );
        if (byKeyLabel) {
          e.preventDefault();
          handleSelect(byKeyLabel.color);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSelect, COLOR_MAP]);

  return (
    <div className="flex gap-3 mt-8 justify-center items-center">
      {COLOR_MAP.map(({ keyLabel, color }) => (
        <motion.button
          key={color}
          onClick={() => handleSelect(color)}
          className={`
            relative rounded-full flex flex-col items-center justify-center cursor-pointer transition-all w-12 h-12
            ${COLOR_CLASSES[color]}
            ${selectedColor === color ? "scale-110 ring-2" : ""}
          `}
          whileTap={{ scale: 0.9 }}
          aria-pressed={selectedColor === color}
          title={`Couleur ${color} (touche ${keyLabel})`}
        >
          {/* Chevron animé au-dessus du bouton sélectionné */}
          {selectedColor === color && (
            <motion.div
              className="absolute -top-5"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ChevronDownIcon className="w-4 h-4" />
            </motion.div>
          )}

          {isDesktop ? <Kbd className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2">
            {keyLabel}
          </Kbd> : null}
        </motion.button>
      ))}
      {children}
    </div>
  );
}
