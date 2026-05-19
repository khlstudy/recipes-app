import type { CellVariant } from "../recipe-comparison-table/utils";

export type CellType = "cell" | "headerCell" | "mobileValue";

export interface RecipeTableCellProps {
  value: string | number;
  unit?: string;
  iconId?: string;
  variant?: CellVariant;
  type?: CellType;
}
