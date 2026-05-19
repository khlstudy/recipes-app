import type { Recipe } from "../../../types/index";
import { ICONS_PATH, RECIPE_ICON_IDS } from "../../common/recipe-card/utils";

export const CELL_VARIANTS = {
  text: "text",
  difficultyPill: "difficultyPill",
} as const;

export type CellVariant = (typeof CELL_VARIANTS)[keyof typeof CELL_VARIANTS];

export interface CellData {
  value: string | number;
  unit?: string;
}

export interface RowConfig {
  key: string;
  text: string;
  iconId?: string;
  alt?: boolean;
  variant?: CellVariant;
  getCellData: (_recipe: Recipe) => CellData;
}

export const ROWS: RowConfig[] = [
  {
    key: "cookingTime",
    text: "Cooking time",
    iconId: RECIPE_ICON_IDS.clock,
    getCellData: (recipe) => ({ value: recipe.cookingTime, unit: " min" }),
  },
  {
    key: "difficulty",
    text: "Difficulty",
    iconId: RECIPE_ICON_IDS.medium,
    alt: true,
    variant: CELL_VARIANTS.difficultyPill,
    getCellData: (recipe) => ({ value: recipe.difficulty }),
  },
  {
    key: "rating",
    text: "Rating",
    iconId: RECIPE_ICON_IDS.star,
    getCellData: (recipe) => ({
      value: recipe.rating.value.toFixed(1),
      unit: " / 5.0",
    }),
  },
  {
    key: "calories",
    text: "Calories",
    alt: true,
    getCellData: (recipe) => ({
      value: recipe.nutrition.calories,
      unit: " kcal",
    }),
  },
  {
    key: "protein",
    text: "Protein",
    getCellData: (recipe) => ({ value: recipe.nutrition.protein, unit: "g" }),
  },
  {
    key: "carbs",
    text: "Carbs",
    alt: true,
    getCellData: (recipe) => ({ value: recipe.nutrition.carbs, unit: "g" }),
  },
  {
    key: "fat",
    text: "Fat",
    getCellData: (recipe) => ({ value: recipe.nutrition.fat, unit: "g" }),
  },
  {
    key: "servings",
    text: "Servings",
    alt: true,
    getCellData: (recipe) => ({ value: recipe.servings }),
  },
  {
    key: "ingredients",
    text: "Ingredients",
    getCellData: (recipe) => ({ value: recipe.ingredients.length }),
  },
];

export const iconSrc = (id: string): string => `${ICONS_PATH}${id}`;
