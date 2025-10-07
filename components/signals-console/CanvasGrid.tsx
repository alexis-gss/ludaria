"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { LevelDef } from "@/types/signals-console";

import { COLOR_HEX } from "@/lib/signals-console/global";
import { drawBlackCell, drawRoundedRect } from "@/lib/utils";

interface GridProps {
  level: LevelDef;
  paths: Path[];
  onPathsChange: (paths: Path[]) => void;
  onSegmentsChange: (used: number) => void;
  onWin: () => void;
}

type Cell = [number, number];

export type Path = {
  color: string;
  cells: Cell[];
  id: string;
  complete: boolean;
};

type CellValue = string;

const CELL_SIZE = 40;
const GAP = 4;
const RADIUS = 4;
const STEP = CELL_SIZE + GAP;

const cellKey = (r: number, c: number) => `${r},${c}`;

const cellColor = (v: CellValue | null): string | null => {
  if (!v) return null;
  const key = v.startsWith("only-") ? v.slice(5) : v;
  return COLOR_HEX[key] ?? null;
};

const isWall = (v: CellValue) => v === "black";
const isRestricted = (v: CellValue) =>
  typeof v === "string" && v.startsWith("only-");
const isEndpoint = (v: CellValue) => !!v && !isWall(v) && !isRestricted(v);

const canTraverse = (v: CellValue, color: string): boolean => {
  if (isWall(v)) return false;
  if (isRestricted(v)) return cellColor(v) === color;
  if (isEndpoint(v)) return cellColor(v) === color;
  return true;
};

const center = (r: number, c: number) => ({
  x: c * STEP + CELL_SIZE / 2,
  y: r * STEP + CELL_SIZE / 2,
});

export default function CanvasGrid({
  level,
  paths,
  onPathsChange,
  onSegmentsChange,
  onWin,
}: GridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<Cell[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const cols = 8;
  const rows = 10;
  const gridW = cols * STEP - GAP;
  const gridH = rows * STEP - GAP;

  const pathsRef = useRef(paths);
  const currentPathRef = useRef(currentPath);
  const isDrawingRef = useRef(isDrawing);
  const activeColorRef = useRef(activeColor);

  useEffect(() => {
    pathsRef.current = paths;
  }, [paths]);
  useEffect(() => {
    currentPathRef.current = currentPath;
  }, [currentPath]);
  useEffect(() => {
    isDrawingRef.current = isDrawing;
  }, [isDrawing]);
  useEffect(() => {
    activeColorRef.current = activeColor;
  }, [activeColor]);

  useEffect(() => {
    if (!canvasRef.current) return;
    let animationFrame: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = gridW * 2;
      canvas.height = gridH * 2;
      ctx.scale(2, 2);
      ctx.clearRect(0, 0, gridW, gridH);

      const paths = pathsRef.current;
      const currentPath = currentPathRef.current;
      const isDrawing = isDrawingRef.current;
      const activeColor = activeColorRef.current;
      const now = performance.now();
      const pulse = (Math.sin(now / 400) + 1) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const v = level.grid[r][c] as CellValue;
          const x = c * STEP;
          const y = r * STEP;
          const color = cellColor(v);

          if (isWall(v)) {
            drawBlackCell(ctx, x, y, COLOR_HEX["black"], CELL_SIZE, RADIUS);
          } else if (isRestricted(v) && color) {
            ctx.save();
            ctx.globalAlpha = 0.25;
            ctx.fillStyle = color;
            drawRoundedRect(ctx, x, y, CELL_SIZE, RADIUS);
            ctx.fill();
            ctx.restore();

            ctx.save();
            ctx.globalAlpha = 0.6;
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            drawRoundedRect(ctx, x, y, CELL_SIZE, RADIUS);
            ctx.stroke();
            ctx.restore();

            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = color;
            ctx.beginPath();
            const cx = x + CELL_SIZE / 2;
            const cy = y + CELL_SIZE / 2;
            const d = 7;
            ctx.moveTo(cx, cy - d);
            ctx.lineTo(cx + d, cy);
            ctx.lineTo(cx, cy + d);
            ctx.lineTo(cx - d, cy);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          } else {
            ctx.fillStyle = "rgba(255,255,255,0.05)";
            drawRoundedRect(ctx, x, y, CELL_SIZE, RADIUS);
            ctx.fill();
          }
        }
      }

      paths.forEach((p) => {
        if (p.cells.length < 2) return;
        ctx.strokeStyle = p.complete ? p.color : "rgba(150,150,150,0.45)";
        ctx.lineWidth = p.complete ? CELL_SIZE * 0.4 : CELL_SIZE * 0.25;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        p.cells.forEach(([r, c], i) => {
          const { x, y } = center(r, c);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      });

      if (isDrawing && activeColor && currentPath.length > 0) {
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = CELL_SIZE * 0.35;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        currentPath.forEach(([r, c], i) => {
          const { x, y } = center(r, c);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      const connectedCells = new Set<string>();
      paths.forEach((p) => {
        if (!p.complete || p.cells.length < 2) return;
        const first = p.cells[0];
        const last = p.cells[p.cells.length - 1];
        if (first) connectedCells.add(cellKey(first[0], first[1]));
        if (last) connectedCells.add(cellKey(last[0], last[1]));
      });

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const v = level.grid[r][c] as CellValue;
          if (!isEndpoint(v)) continue;

          const color = cellColor(v);
          if (!color) continue;
          const { x: cx, y: cy } = center(r, c);
          const connected = connectedCells.has(cellKey(r, c));

          if (connected) {
            ctx.save();
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(cx, cy, CELL_SIZE / 3 + 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else {
            ctx.save();
            ctx.globalAlpha = 0.25 + 0.2 * pulse;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(cx, cy, CELL_SIZE / 3 + 4 + pulse * 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.arc(cx, cy, CELL_SIZE / 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrame = requestAnimationFrame(render);
    };

    animationFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrame);
  }, [cols, rows, gridW, gridH, level]);

  const getCellFromEvent = useCallback(
    (e: React.MouseEvent | React.TouchEvent): Cell | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();

      const clientX =
        "touches" in e
          ? e.touches[0]?.clientX
          : (e as React.MouseEvent).clientX;
      const clientY =
        "touches" in e
          ? e.touches[0]?.clientY
          : (e as React.MouseEvent).clientY;
      if (clientX === undefined || clientY === undefined) return null;

      const r = Math.floor((clientY - rect.top) / STEP);
      const c = Math.floor((clientX - rect.left) / STEP);
      if (r < 0 || c < 0 || r >= rows || c >= cols) return null;
      return [r, c];
    },
    [cols, rows],
  );

  const startDraw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const cell = getCellFromEvent(e);
      if (!cell) return;
      const [r, c] = cell;
      const v = level.grid[r][c] as CellValue;

      if (!isEndpoint(v)) return;
      const color = cellColor(v);
      if (!color) return;
      const clickedKey = cellKey(r, c);

      onPathsChange(
        pathsRef.current.filter((p) => {
          const first = p.cells[0];
          const last = p.cells[p.cells.length - 1];
          if (!first || !last) return true;
          return (
            p.color !== color ||
            (cellKey(first[0], first[1]) !== clickedKey &&
              cellKey(last[0], last[1]) !== clickedKey)
          );
        }),
      );

      setIsDrawing(true);
      setActiveColor(color);
      setCurrentPath([[r, c]]);
    },
    [getCellFromEvent, level.grid, onPathsChange],
  );

  const moveDraw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawingRef.current || !activeColorRef.current) return;
      const cell = getCellFromEvent(e);
      if (!cell) return;

      let segmentsToReport = -1;

      setCurrentPath((prev) => {
        const last = prev[prev.length - 1];
        if (!last) return prev;

        let [r, c] = cell;
        const [lr, lc] = last;

        if (r !== lr && c !== lc) {
          if (Math.abs(r - lr) > Math.abs(c - lc)) c = lc;
          else r = lr;
        }
        if (r === lr && c === lc) return prev;

        const v = level.grid[r][c] as CellValue;
        const active = activeColorRef.current;
        if (!active) return prev;

        if (!canTraverse(v, active)) {
          setIsDrawing(false);
          setActiveColor(null);
          return [];
        }

        const idx = prev.findIndex(([pr, pc]) => pr === r && pc === c);
        const newCell: Cell = [r, c];
        const updatedPath =
          idx !== -1 ? prev.slice(0, idx + 1) : [...prev, newCell];

        const committed = pathsRef.current.reduce(
          (acc, p) => acc + Math.max(0, p.cells.length - 1),
          0,
        );
        segmentsToReport = committed + Math.max(0, updatedPath.length - 1); // 👈

        return updatedPath;
      });

      if (segmentsToReport >= 0) {
        queueMicrotask(() => onSegmentsChange(segmentsToReport));
      }
    },
    [getCellFromEvent, level.grid, onSegmentsChange],
  );

  const checkWin = useCallback(
    (currentPaths: Path[]) => {
      const byColor = new Map<string, Cell[]>();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const v = level.grid[r][c] as CellValue;
          if (!isEndpoint(v)) continue;
          const color = cellColor(v);
          if (!color) continue;
          byColor.set(color, [...(byColor.get(color) ?? []), [r, c]]);
        }
      }

      const allConnected = [...byColor.entries()].every(([color, eps]) =>
        eps.every((ep) =>
          currentPaths.some((p) => {
            const first = p.cells[0];
            const last = p.cells[p.cells.length - 1];
            if (!first || !last) return false;
            return (
              p.complete &&
              p.color === color &&
              (cellKey(first[0], first[1]) === cellKey(ep[0], ep[1]) ||
                cellKey(last[0], last[1]) === cellKey(ep[0], ep[1]))
            );
          }),
        ),
      );

      if (allConnected) setTimeout(onWin, 300);
    },
    [cols, rows, level.grid, onWin],
  );

  const endDraw = useCallback(() => {
    if (!isDrawingRef.current || !activeColorRef.current) return;

    const prev = currentPathRef.current;
    const active = activeColorRef.current;

    setIsDrawing(false);
    setActiveColor(null);
    setCurrentPath([]);

    if (prev.length < 2) return;

    const last = prev[prev.length - 1];
    if (!last) return;
    const lastCellValue = level.grid[last[0]][last[1]] as CellValue;

    const isComplete =
      isEndpoint(lastCellValue) && cellColor(lastCellValue) === active;

    const newPath: Path = {
      color: active,
      cells: prev,
      id: crypto.randomUUID(),
      complete: isComplete,
    };
    const newPathSet = new Set(prev.map(([r, c]) => cellKey(r, c)));

    const filtered = pathsRef.current.filter(
      (p) => !p.cells.some(([r, c]) => newPathSet.has(cellKey(r, c))),
    );
    const nextPaths = [...filtered, newPath];
    onPathsChange(nextPaths);
    const totalSegments = nextPaths.reduce(
      (acc, p) => acc + Math.max(0, p.cells.length - 1),
      0,
    );
    onSegmentsChange(totalSegments);
    if (isComplete) checkWin(nextPaths);
  }, [level.grid, checkWin, onPathsChange, onSegmentsChange]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: gridW, height: gridH }}
      className="touch-none select-none cursor-pointer"
      onMouseDown={startDraw}
      onMouseMove={moveDraw}
      onMouseUp={endDraw}
      onMouseLeave={endDraw}
      onTouchStart={startDraw}
      onTouchMove={moveDraw}
      onTouchEnd={endDraw}
    />
  );
}
