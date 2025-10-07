import { DifficultyType, PuzzleType } from "@prisma/client";
import clsx from "clsx";
import { BoxesIcon, CableIcon, PaintbrushIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

import type { Game } from "@/types/global";
import type { ClassValue } from "clsx";

export const DIFFICULTIES: DifficultyType[] = [
  DifficultyType.easy,
  DifficultyType.medium,
  DifficultyType.hard,
];

export const GAMES: Game[] = [
  {
    id: 1,
    slug: "overflowing-palette",
    icon: PaintbrushIcon,
    title: "Overflowing Palette",
    subtitle: "Déplace — assemble — triomphe",
    description: `Dive into a vibrant tapestry of colors! This puzzle game offers a variety of levels with a ${highlightingText("grid of colored blocks")} that you must transform into a ${highlightingText("single shade")}. With a limited number of moves, choose the right color combination and watch the grid transform! ${highlightingText("Every choice is strategic")}: a single click can repaint everything… or ruin it all!`,
    type: PuzzleType.overflowing_palette,
  },
  {
    id: 2,
    slug: "energy-matrix",
    icon: BoxesIcon,
    title: "Energy Matrix",
    subtitle: "Réorganise la grille",
    description: `Reconnect the grid’s energy! This puzzle challenges you to fill a grid of gray circles using ${highlightingText("predefined shapes")}. Place them strategically to cover every space without wasting your resources. Some ${highlightingText("shapes")} cover multiple circles at once — it’s up to you to find the perfect combination!`,
    type: PuzzleType.energy_matrix,
  },
  {
    id: 3,
    slug: "signals-console",
    icon: CableIcon,
    title: "Signals Console",
    subtitle: "Réorganise la grille",
    description: `Become a master of connections! This puzzle challenges you to ${highlightingText("connect the circles")} of the same color ${highlightingText("without crossing the lines")}. Every connection counts, and a single misstep ${highlightingText("can be costly")}. Think carefully, plan ahead, and weave a harmonious network to win the game!`,
    type: PuzzleType.signals_console,
  },
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  outputWidth: number,
  outputHeight: number,
): Promise<File> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
  });

  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Impossible d'obtenir le contexte 2D");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputWidth,
    outputHeight,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) throw new Error("Erreur lors du crop de l’image");
      resolve(new File([blob], "avatar.png", { type: "image/png" }));
    }, "image/png");
  });
}

/**
 * Highlights a given text.
 * @param {string} text
 * @return {string}
 */
export function highlightingText(text: string): string {
  return `<span class='text-purple-500 italic font-semibold'>${text}</span>`;
}

/**
 * Draws a rounded rectangle on the canvas.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} size
 * @param {number} radius
 * @return {void}
 */
export const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  radius: number,
): void => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + size - radius, y);
  ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
  ctx.lineTo(x + size, y + size - radius);
  ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
  ctx.lineTo(x + radius, y + size);
  ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

export const drawBlackCell = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  size: number,
  radius: number,
) => {
  ctx.fillStyle = color;
  drawRoundedRect(ctx, x, y, size, radius);
  ctx.fill();
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 8);
  ctx.lineTo(x + size - 8, y + size - 8);
  ctx.moveTo(x + size - 8, y + 8);
  ctx.lineTo(x + 8, y + size - 8);
  ctx.stroke();
  ctx.restore();
};
