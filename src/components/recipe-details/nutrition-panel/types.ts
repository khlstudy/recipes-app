import type { Nutrition } from "../../../types";

export interface NutritionItem {
  key: keyof Nutrition;
  label: string;
  unit: string;
  dailyValue: number;
  accent: "primary" | "secondary" | "category" | "admin";
}

export interface NutritionPanelProps {
  nutrition: Nutrition;
}
