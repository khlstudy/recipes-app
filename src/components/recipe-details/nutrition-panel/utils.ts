import type { NutritionItem } from "./types";

export const NUTRITION_ITEMS: NutritionItem[] = [
  {
    key: "calories",
    label: "Calories",
    unit: "kcal",
    dailyValue: 2000,
    accent: "primary",
  },
  {
    key: "protein",
    label: "Protein",
    unit: "g",
    dailyValue: 50,
    accent: "category",
  },
  {
    key: "carbs",
    label: "Carbs",
    unit: "g",
    dailyValue: 275,
    accent: "admin",
  },
  {
    key: "fat",
    label: "Fat",
    unit: "g",
    dailyValue: 78,
    accent: "secondary",
  },
];

export const calcPercent = (value: number, dailyValue: number): number =>
  Math.min(100, Math.round((value / dailyValue) * 100));
