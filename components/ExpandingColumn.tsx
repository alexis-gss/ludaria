"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import type { ReactNode} from "react";

import { cn } from "@/lib/utils";

interface ExpandingColumnProps {
  index: number;
  accent?: string;
  borderBreakpoint?: "lg" | "md";
  onClick?: () => void;
  children: ReactNode | ((hovered: boolean) => ReactNode);
}

export function ExpandingColumn({
  index,
  accent = "bg-purple-500/10",
  borderBreakpoint = "lg",
  onClick,
  children,
}: ExpandingColumnProps) {
  const [hovered, setHovered] = useState(false);
  const flexValue = hovered ? 3 : 1;

  const borderClass =
    borderBreakpoint === "lg"
      ? { "border-t lg:border-t-0 lg:border-l": index >= 1 }
      : { "border-t md:border-t-0 md:border-l": index >= 1 };

  return (
    <motion.div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        "bg-white/70 dark:bg-black/50 transition-colors duration-300 py-8",
        onClick && "cursor-pointer",
        borderClass,
      )}
      style={{ flex: flexValue }}
      animate={{ flex: flexValue }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <motion.div
        className={cn("absolute inset-0", accent)}
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="relative z-10 text-center px-6 will-change-transform"
        animate={{ scale: hovered ? 1.05 : 1, opacity: hovered ? 1 : 0.85 }}
        transition={{ duration: 0.3 }}
      >
        {typeof children === "function" ? children(hovered) : children}
      </motion.div>
    </motion.div>
  );
}
