"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";

import type { LevelDef, Offset } from "@/types/energy-matrix";

import { drawOctagon } from "@/components/games/energy-matrix/draw-utils";

import Selectors from "@/components/games/energy-matrix/Selectors";

const rotate = (offsets: Offset[], t = 1) => {
  let res = offsets.map((o) => ({ ...o }));
  for (let i = 0; i < ((t % 4) + 4) % 4; i++)
    res = res.map(({ x, y }) => ({ x: y, y: -x }));
  return res;
};
const add = (a: Offset, b: Offset) => ({ x: a.x + b.x, y: a.y + b.y });

interface CanvasGridProps {
  level: LevelDef;
  onShapesChange?: (remaining: number) => void;
  onWin?: () => void;
}

export default function CanvasGrid({
  level,
  onShapesChange,
  onWin,
}: CanvasGridProps) {
  const canvas = useRef<HTMLCanvasElement>(null);

  const [available, setAvailable] = useState(
    level.shapes.map((s) => ({ ...s })),
  );
  const [sel, setSel] = useState(0);
  const [rot, setRot] = useState(0);
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [hover, setHover] = useState<Offset | null>(null);
  const [msg, setMsg] = useState("");

  // Refs pour la boucle rAF — évite de recréer draw à chaque state change
  const availableRef = useRef(available);
  const selRef = useRef(sel);
  const rotRef = useRef(rot);
  const placedRef = useRef(placed);
  const hoverRef = useRef(hover);

  useEffect(() => {
    availableRef.current = available;
  }, [available]);
  useEffect(() => {
    selRef.current = sel;
  }, [sel]);
  useEffect(() => {
    rotRef.current = rot;
  }, [rot]);
  useEffect(() => {
    placedRef.current = placed;
  }, [placed]);
  useEffect(() => {
    hoverRef.current = hover;
  }, [hover]);

  const cell = 22,
    pad = 0,
    gap = 8;

  const target = useMemo(
    () => Object.fromEntries(level.targets.map((t) => [`${t.x},${t.y}`, true])),
    [level.targets],
  );
  const targetRef = useRef(target);
  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  const grid2px = (p: Offset) => ({
    x: pad + cell + p.x * (cell * 2 + gap),
    y: pad + cell + p.y * (cell * 2 + gap),
  });

  const px2grid = useCallback(
    (px: number, py: number): Offset | null => {
      const rect = canvas.current?.getBoundingClientRect();
      if (!rect) return null;
      const x = px - rect.left,
        y = py - rect.top;
      const gx = Math.round((x - pad - cell) / (cell * 2 + gap));
      const gy = Math.round((y - pad - cell) / (cell * 2 + gap));
      if (gx < 0 || gy < 0 || gx >= level.grid.cols || gy >= level.grid.rows)
        return null;
      return { x: gx, y: gy };
    },
    [level.grid.cols, level.grid.rows],
  );

  // draw lit tout depuis les refs — dépendances vides, jamais recréée
  const draw = useCallback(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const available = availableRef.current;
    const sel = selRef.current;
    const rot = rotRef.current;
    const placed = placedRef.current;
    const hover = hoverRef.current;
    const target = targetRef.current;

    ctx.clearRect(0, 0, c.width, c.height);

    const time = Date.now() / 500;
    const pulse = (Math.sin(time) + 1) / 2;

    for (let y = 0; y < level.grid.rows; y++)
      for (let x = 0; x < level.grid.cols; x++) {
        const key = `${x},${y}`;
        const p = grid2px({ x, y });
        const isTarget = !!target[key];
        const isPlaced = !!placed[key];
        drawOctagon(
          ctx,
          p.x,
          p.y,
          cell,
          isPlaced ? placed[key] : isTarget ? "#111827" : "#0f172a",
          "#0b1220",
        );

        if (isTarget && !isPlaced) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, cell * 1.1 + pulse * 2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(99,102,241,${0.3 + 0.3 * pulse})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

    const shape = available[sel];
    if (hover && shape) {
      const offs = rotate(shape.offsets, rot);
      let invalid = false;
      for (const o of offs) {
        const pos = add(hover, o);
        if (
          pos.x < 0 ||
          pos.y < 0 ||
          pos.x >= level.grid.cols ||
          pos.y >= level.grid.rows ||
          placed[`${pos.x},${pos.y}`]
        )
          invalid = true;
      }
      for (const o of offs) {
        const pos = add(hover, o);
        if (
          pos.x < 0 ||
          pos.y < 0 ||
          pos.x >= level.grid.cols ||
          pos.y >= level.grid.rows
        )
          continue;
        const p = grid2px(pos);
        drawOctagon(
          ctx,
          p.x,
          p.y,
          cell,
          invalid ? "rgba(255,0,0,0.25)" : "rgba(255,255,255,0.3)",
          invalid ? "#7f1d1d" : shape.color,
          invalid ? 0.5 : 1.5,
        );
      }
    }
  }, [level]); // level ne change pas pendant une partie

  function handleReset() {
    setAvailable(level.shapes);
    onShapesChange?.(level.shapes.length);
    setSel(0);
    setRot(0);
    setPlaced({});
    setMsg("");
  }

  // Boucle rAF — ne se réabonne qu'au montage
  useEffect(() => {
    let id: number;
    const frame = () => {
      draw();
      id = requestAnimationFrame(frame);
    };
    id = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const move = (e: MouseEvent) => setHover(px2grid(e.clientX, e.clientY));
    const leave = () => setHover(null);
    const click = (e: MouseEvent) => {
      const g = px2grid(e.clientX, e.clientY);
      if (!g) return;
      const shape = availableRef.current[selRef.current];
      if (!shape) return;
      const offs = rotate(shape.offsets, rotRef.current);

      for (const o of offs) {
        const p = add(g, o);
        const k = `${p.x},${p.y}`;
        if (
          p.x < 0 ||
          p.y < 0 ||
          p.x >= level.grid.cols ||
          p.y >= level.grid.rows ||
          placedRef.current[k]
        ) {
          setMsg("Placement invalide");
          setTimeout(() => setMsg(""), 1000);
          return;
        }
      }

      const next = { ...placedRef.current };
      offs.forEach((o) => {
        const p = add(g, o);
        next[`${p.x},${p.y}`] = shape.color;
      });
      setPlaced(next);
      const nextAvailable = availableRef.current.filter(
        (_, i) => i !== selRef.current,
      );
      setAvailable(nextAvailable);
      setSel(0);
      setRot(0);
      // Schedule after React has processed state updates — never call a parent
      // setState inside a child setState setter (triggers the "update during render" error)
      setTimeout(() => onShapesChange?.(nextAvailable.length), 0);
    };;

    c.addEventListener("mousemove", move);
    c.addEventListener("mouseleave", leave);
    c.addEventListener("click", click);
    return () => {
      c.removeEventListener("mousemove", move);
      c.removeEventListener("mouseleave", leave);
      c.removeEventListener("click", click);
    };
  }, [px2grid, level.grid.cols, level.grid.rows]);

  useEffect(() => {
    const all = Object.keys(targetRef.current).every(
      (k) => placedRef.current[k],
    );
    if (all) {
      setMsg("🎉 Gagné !");
      setTimeout(() => onWin?.(), 300);
    } else if (!available.length) setMsg("Perdu — plus de formes");
  }, [placed, available, onWin]);

  return (
    <>
      <canvas ref={canvas} width={305} height={305} />
      <Selectors
        available={available}
        selected={sel}
        onRotate={() => setRot((r) => (r + 1) % 4)}
        onSelectShape={(i) => setSel(i)}
        onReset={handleReset}
      />
      <div className="mt-3 text-gray-300 text-sm text-center">{msg}</div>
    </>
  );
}
