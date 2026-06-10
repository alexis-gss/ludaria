export type Color = "blue" | "red" | "green" | "yellow" | "purple" | "black" | "frozen";

export interface LevelDef {
  id: number;
  grid: { rows: number; cols: number };
  targets: Offset[];
  shapes: ShapeDef[];
};

export type Offset = { x: number; y: number };

export type ShapeDef = {
  id: string;
  name?: string;
  color: string;
  offsets: Offset[];
};
