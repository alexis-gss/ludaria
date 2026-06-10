/**
 * Shared canvas drawing utilities for Energy Matrix.
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
