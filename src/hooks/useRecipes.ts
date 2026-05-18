import { useState, useEffect, useCallback } from "react";

import type { Recipe } from "../types";
import type {
  PaginatedResponse,
  RecipeQueryParams,
  CreateRecipeRequest,
  UpdateRecipeRequest,
} from "../api/types";
import type { UseRecipesResult } from "./types";

import { apiClient } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

export function useRecipes(params: RecipeQueryParams = {}): UseRecipesResult {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient<PaginatedResponse<Recipe>>(
        ENDPOINTS.RECIPES,
        {
          params: params as Record<
            string,
            string | number | boolean | string[]
          >,
        }
      );
      setRecipes(res.data);
      setTotal(res.pagination.total);
    } catch (e: unknown) {
      const msg =
        e !== null && typeof e === "object" && "message" in e
          ? String((e as { message: unknown }).message)
          : "Failed to fetch recipes";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const createRecipe = useCallback(
    async (data: CreateRecipeRequest, token: string): Promise<Recipe> => {
      const res = await apiClient<{ data: Recipe; success: boolean }>(
        ENDPOINTS.RECIPES,
        {
          method: "POST",
          body: data,
          token,
        }
      );
      setRecipes((prev) => [res.data, ...prev]);
      return res.data;
    },
    []
  );

  const updateRecipe = useCallback(
    async (
      id: string,
      data: UpdateRecipeRequest,
      token: string
    ): Promise<Recipe> => {
      const res = await apiClient<{ data: Recipe; success: boolean }>(
        ENDPOINTS.RECIPE(id),
        {
          method: "PUT",
          body: data,
          token,
        }
      );
      setRecipes((prev) => prev.map((r) => (r.id === id ? res.data : r)));
      return res.data;
    },
    []
  );

  const deleteRecipe = useCallback(
    async (id: string, token: string): Promise<void> => {
      await apiClient(ENDPOINTS.RECIPE(id), { method: "DELETE", token });
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    },
    []
  );

  return {
    recipes,
    loading,
    error,
    total,
    refetch: fetchRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
  };
}
