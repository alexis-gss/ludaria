"use client";

import { motion } from "framer-motion";

import type { ShapeDef } from "@/types/energy-matrix";

import { drawOctagon } from "@/lib/draw-utils";

interface SelectorsProps {
  available: ShapeDef[];
  selected: number;
  onRotate: () => void;
  onSelectShape?: (index: number) => void;
  onReset: () => void;
}

export default function Selectors({
  available,
  selected,
  onRotate,
  onSelectShape,
  onReset,
}: SelectorsProps) {
  const drawMiniShape = (canvas: HTMLCanvasElement, shape: ShapeDef) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const minX = Math.min(...shape.offsets.map((o) => o.x));
    const minY = Math.min(...shape.offsets.map((o) => o.y));
    const size = 8;

    shape.offsets.forEach((o) => {
      const x = (o.x - minX) * (size * 2 + 3) + size + 2;
      const y = (o.y - minY) * (size * 2 + 3) + size + 2;
      drawOctagon(ctx, x, y, size, shape.color, "#0b1220");
    });
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-center gap-3 mb-5 flex-wrap">
        <motion.button
          whileTap={{ rotate: 90, scale: 0.95 }}
          whileHover={{ backgroundColor: "rgb(99,102,241)" }}
          onClick={onRotate}
          className="px-3 py-1 rounded bg-indigo-600 text-white shadow-md transition"
        >
          ↻ Rotation
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ backgroundColor: "rgb(239,68,68)" }}
          onClick={onReset}
          className="px-3 py-1 rounded bg-red-600 text-white shadow-sm transition"
        >
          ⟲ Reset
        </motion.button>
      </div>
      <div className="flex justify-center gap-4 flex-wrap">
        {available.map((shape, i) => (
          <motion.div
            key={shape.id}
            onClick={() => onSelectShape?.(i)}
            className={`relative p-2 border rounded-xl cursor-pointer bg-slate-800 transition-colors
              ${
          i === selected
            ? "border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.6)]"
            : "border-slate-700 hover:border-slate-500"
          }`}
            whileHover={{ scale: 1.08 }}
          >
            <canvas
              width={60}
              height={60}
              ref={(ref) => {
                if (ref) drawMiniShape(ref, shape);
              }}
            />
            {i === selected && (
              <motion.div
                className="absolute inset-0 rounded-xl border border-indigo-400/60 pointer-events-none"
                animate={{ opacity: [0.3, 0.9, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
