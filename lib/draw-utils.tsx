/**
 * Shared canvas drawing utilities for Energy Matrix.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} cy
 * @param {number} r
 * @param {string} fill
 * @param {string} stroke
 * @param {number} lw
 * @return {void}
 */
export function drawOctagon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  fill?: string,
  stroke?: string,
  lw = 1,
) {
  const path = new Path2D();
  const pts = [...Array(8)].map((_, i) => {
    const th = (Math.PI / 4) * i + Math.PI / 8;
    return { x: cx + Math.cos(th) * r, y: cy + Math.sin(th) * r };
  });
  path.moveTo(pts[0].x, pts[0].y);
  pts.forEach((p) => path.lineTo(p.x, p.y));
  path.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill(path);
  }
  if (stroke) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = stroke;
    ctx.stroke(path);
  }
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

/**
 * Draws a black cell on the canvas.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {string} color
 * @param {number} size
 * @param {number} radius
 * @return {void}
 */
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
