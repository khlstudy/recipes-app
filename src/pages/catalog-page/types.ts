import type { Recipe } from "../../types";

export type Difficulty = Recipe["difficulty"];

export type SortKey = "rating" | "cookingTime" | "calories";

export interface CatalogFilters {
  diet: string[];
  difficulty: Difficulty[];
  maxTime: number;
  ingredients: string[];
}

export interface FacetOption {
  key: string;
  label: string;
}

export interface SortOption {
  key: SortKey;
  label: string;
}
