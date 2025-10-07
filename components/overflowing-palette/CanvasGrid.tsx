"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Color } from "@/types/overflowing-palette";

import { useSound } from "@/components/SoundProvider";
import { COLOR_HEX } from "@/lib/overflowing-palette/global";
import { cn, drawBlackCell } from "@/lib/utils";

interface CanvasGridProps {
  grid: Color[][];
  onCellClick: (r: number, c: number) => void;
  animating?: boolean;
  celebrate?: boolean;
}

interface AnimatedCell {
  r: number;
  c: number;
  startTime: number;
  duration: number;
}

export default function CanvasGrid({
  grid,
  onCellClick,
  animating,
  celebrate,
}: CanvasGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { muted } = useSound();
  const [hoverCell, setHoverCell] = useState<{ r: number; c: number } | null>(
    null
  );

  const soundRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback(() => {
    if (muted || !soundRef.current) return;
    soundRef.current.currentTime = 0;
    soundRef.current.play().catch(() => {});
  }, [muted]);

  const CELL_SIZE = 40;
  const GAP = 4;
  const RADIUS = 4;

  const localAnimatedCells = useRef<AnimatedCell[]>([]);

  const isColorable = (color: Color) => color !== "black" && color !== "frozen";

  const triggerAnimation = (r: number, c: number) => {
    if (!isColorable(grid[r][c])) return;
    localAnimatedCells.current.push({
      r,
      c,
      startTime: performance.now(),
      duration: 300,
    });
  };

  const handleClick = (r: number, c: number) => {
    onCellClick(r, c);
    playSound();
    triggerAnimation(r, c);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / (CELL_SIZE + GAP));
    const row = Math.floor(y / (CELL_SIZE + GAP));
    if (
      row < grid.length &&
      col < grid[0].length &&
      isColorable(grid[row][col])
    ) {
      handleClick(row, col);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / (CELL_SIZE + GAP));
    const row = Math.floor(y / (CELL_SIZE + GAP));
    if (row < grid.length && col < grid[0].length) {
      setHoverCell({ r: row, c: col });
    } else {
      setHoverCell(null);
    }
  };

  const handleMouseLeave = () => setHoverCell(null);

  useEffect(() => {
    soundRef.current = new Audio("/sounds/click.mp3");
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    let animationFrame: number;

    const render = () => {
      if (!ctx || !canvasRef.current) return;
      const width = grid[0].length * (CELL_SIZE + GAP) - GAP;
      const height = grid.length * (CELL_SIZE + GAP) - GAP;

      canvasRef.current.width = width * 2;
      canvasRef.current.height = height * 2;
      ctx.scale(2, 2);
      ctx.clearRect(0, 0, width, height);

      const now = performance.now();
      const newAnimatedCells: AnimatedCell[] = [];

      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
          const color = grid[r][c];
          const baseX = c * (CELL_SIZE + GAP);
          const baseY = r * (CELL_SIZE + GAP);

          // Skip animations for non-colorable cells
          let scale = 1;
          if (isColorable(color)) {
            const animIndex = localAnimatedCells.current.findIndex(
              (a) => a.r === r && a.c === c
            );
            if (animIndex >= 0) {
              const anim = localAnimatedCells.current[animIndex];
              const progress = (now - anim.startTime) / anim.duration;
              if (progress < 1) {
                scale = 1 + 0.2 * Math.sin(progress * Math.PI);
                newAnimatedCells.push(anim);
              }
            }

            if (hoverCell && hoverCell.r === r && hoverCell.c === c) {
              scale = Math.max(scale, 1.1);
            }

            if (celebrate) {
              scale = Math.max(scale, 1 + 0.2 * Math.sin(now / 300));
            }
          }

          const size = CELL_SIZE * scale;
          const offset = (CELL_SIZE - size) / 2;

          // Draw rounded rectangle
          const radius = RADIUS;
          if (color === "black") {
            drawBlackCell(
              ctx,
              baseX,
              baseY,
              COLOR_HEX["black"],
              CELL_SIZE,
              RADIUS,
            );
          } else {
            ctx.fillStyle = COLOR_HEX[color] || "#000000";
            ctx.beginPath();
            ctx.moveTo(baseX + offset + radius, baseY + offset);
            ctx.lineTo(baseX + offset + size - radius, baseY + offset);
            ctx.quadraticCurveTo(
              baseX + offset + size,
              baseY + offset,
              baseX + offset + size,
              baseY + offset + radius,
            );
            ctx.lineTo(baseX + offset + size, baseY + offset + size - radius);
            ctx.quadraticCurveTo(
              baseX + offset + size,
              baseY + offset + size,
              baseX + offset + size - radius,
              baseY + offset + size,
            );
            ctx.lineTo(baseX + offset + radius, baseY + offset + size);
            ctx.quadraticCurveTo(
              baseX + offset,
              baseY + offset + size,
              baseX + offset,
              baseY + offset + size - radius,
            );
            ctx.lineTo(baseX + offset, baseY + offset + radius);
            ctx.quadraticCurveTo(
              baseX + offset,
              baseY + offset,
              baseX + offset + radius,
              baseY + offset,
            );
            ctx.closePath();
            ctx.fill();
          }
        }
      }

      localAnimatedCells.current = newAnimatedCells;
      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrame);
  }, [grid, hoverCell, celebrate]);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("touch-none select-none cursor-pointer", {
        "pointer-events-none": animating,
      })}
      style={{
        width: grid[0]?.length * (CELL_SIZE + GAP) - GAP,
        height: grid.length * (CELL_SIZE + GAP) - GAP,
      }}
    />
  );
}
