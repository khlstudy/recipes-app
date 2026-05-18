import { useState, useCallback, useEffect } from "react";

import type { Recipe } from "../types";
import type { UseFavoritesResult } from "./types";

import { apiClient } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

export function useFavorites(userId: string | null): UseFavoritesResult {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      return;
    }
    setLoading(true);
    apiClient<{ data: Recipe[] }>(ENDPOINTS.USER_FAVORITES(userId))
      .then((res) => setFavorites(res.data))
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  }, [userId]);

  const toggle = useCallback(
    async (recipeId: string, token: string): Promise<void> => {
      if (!userId) return;
      const isCurrentlyFavorite = favorites.some((r) => r.id === recipeId);

      // Optimistic update
      if (isCurrentlyFavorite) {
        setFavorites((prev) => prev.filter((r) => r.id !== recipeId));
      }

      try {
        if (isCurrentlyFavorite) {
          await apiClient(ENDPOINTS.USER_FAVORITE(userId, recipeId), {
            method: "DELETE",
            token,
          });
        } else {
          await apiClient<{ data: Recipe[] }>(
            ENDPOINTS.USER_FAVORITES(userId),
            {
              method: "POST",
              body: { recipeId },
              token,
            }
          );
          // Refetch to get full recipe objects
          const res = await apiClient<{ data: Recipe[] }>(
            ENDPOINTS.USER_FAVORITES(userId)
          );
          setFavorites(res.data);
        }
      } catch {
        // Revert optimistic update on error
        const res = await apiClient<{ data: Recipe[] }>(
          ENDPOINTS.USER_FAVORITES(userId)
        );
        setFavorites(res.data);
      }
    },
    [userId, favorites]
  );

  const favoriteIds = new Set(favorites.map((r) => r.id));
  const isFavorite = useCallback(
    (recipeId: string) => favoriteIds.has(recipeId),
    [favoriteIds]
  );

  return { favorites, favoriteIds, loading, toggle, isFavorite };
}
