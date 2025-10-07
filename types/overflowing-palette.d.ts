export type Color = "blue" | "red" | "green" | "yellow" | "purple" | "black" | "frozen";

export type LevelDef = {
  id: number;
  moves: number;
  target: Color;
  grid: Color[][];
  unfreezeAfter?: number;
  unfreezeColor?: Color;
};
