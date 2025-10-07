export interface LevelDef {
  id: number;
  grid: CellColor[][];
  moves: number;
}

export type CellColor = "red" | "blue" | "green" | "yellow" | "purple" | "black" | "only-red" | "only-blue" | "only-green" | "only-yellow" | "only-purple" | null;
