"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface DynamicCounterProps {
  number: number;
  label?: string;
}

export default function DynamicCounter({
  number,
  label = "Remaining moves:",
}: DynamicCounterProps) {
  const [, setPrevMoves] = useState(number);
  const maxObservedRef = useRef<number>(number);

  useEffect(() => {
    setPrevMoves(number);
    if (number > maxObservedRef.current) {
      maxObservedRef.current = number;
    }
  }, [number]);

  const maxVal = Math.max(1, maxObservedRef.current);
  const ratio = Math.max(0, Math.min(1, number / maxVal));
  const hue = Math.round(ratio * 120);
  const colorCss = `hsl(${hue} 85% 45%)`;

  const digits = String(number).length;
  const width = `${digits * 0.75}rem`;

  return (
    <div className="relative flex items-center gap-1">
      <span>{label}</span>
      <div className="relative overflow-hidden h-6" style={{ width }}>
        <motion.span
          key={number}
          className="absolute left-0 w-full text-center font-bold"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.12 }}
          style={{ color: colorCss, transition: "color 300ms ease" }}
        >
          {number}
        </motion.span>
      </div>
    </div>
  );
}
