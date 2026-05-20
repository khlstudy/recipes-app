import type { Recipe } from "../types";
import type { CreateRecipeRequest, UpdateRecipeRequest } from "../api/types";
import type { RequestOptions } from "../api/client";

export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  execute: (_path: string, _opts?: RequestOptions) => Promise<T>;
}

export interface UseRecipesResult {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => void;
  createRecipe: (_data: CreateRecipeRequest, _token: string) => Promise<Recipe>;
  updateRecipe: (
    _id: string,
    _data: UpdateRecipeRequest,
    _token: string
  ) => Promise<Recipe>;
  deleteRecipe: (_id: string, _token: string) => Promise<void>;
}

export interface UseFavoritesResult {
  favorites: Recipe[];
  favoriteIds: Set<string>;
  loading: boolean;
  toggle: (_recipeId: string, _token: string) => Promise<void>;
  isFavorite: (_recipeId: string) => boolean;
}

export interface UseSearchResult {
  query: string;
  setQuery: (_q: string) => void;
  debouncedQuery: string;
  clearQuery: () => void;
}

export interface UseRecentSearchesResult {
  recentSearches: string[];
  addRecentSearch: (_query: string) => void;
  clearRecentSearches: () => void;
}

export interface UseComparisonResult {
  comparisonList: Recipe[];
  toggle: (_recipe: Recipe) => void;
  clear: () => void;
  isInComparison: (_recipeId: string) => boolean;
  isFull: boolean;
}

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiReturn<T> extends ApiState<T> {
  execute: (_fetcher: () => Promise<T>) => Promise<T | null>;
  reset: () => void;
}
