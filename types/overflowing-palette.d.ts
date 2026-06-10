export type CellColor = "blue" | "red" | "green" | "yellow" | "purple" | "black" | "frozen";

export interface LevelDef {
  id: number;
  moves: number;
  target: CellColor;
  grid: CellColor[][];
  unfreezeAfter?: number;
  unfreezeColor?: CellColor;
};
