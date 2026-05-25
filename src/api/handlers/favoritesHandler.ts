import type { Recipe } from "../../types";
import type { ApiResponse } from "../types";

import { recipesHandler } from "./recipesHandler";
import { usersHandler } from "./usersHandler";

function getFavoritesCollection(userId: string) {
  const { data: collections } = usersHandler.getCollections(userId);
  const col = collections.find((c) => c.name === "Favorites" && c.isDefault);
  if (!col)
    throw {
      success: false,
      message: "Favorites collection not found",
      code: "NOT_FOUND",
      statusCode: 404,
    };
  return col;
}

export const favoritesHandler = {
  getFavorites(userId: string): ApiResponse<Recipe[]> {
    const col = getFavoritesCollection(userId);
    const store = recipesHandler.getStore();
    const recipes = col.recipeIds
      .map((id) => store.find((r) => r.id === id))
      .filter(Boolean) as Recipe[];
    return { data: recipes, success: true };
  },

  add(
    userId: string,
    body: { recipeId: string }
  ): ApiResponse<{ recipeId: string }> {
    const col = getFavoritesCollection(userId);
    if (!col.recipeIds.includes(body.recipeId)) {
      usersHandler.updateCollection(userId, col.id, {
        recipeIds: [...col.recipeIds, body.recipeId],
      });
    }
    return { data: { recipeId: body.recipeId }, success: true };
  },

  remove(userId: string, recipeId: string): ApiResponse<Record<string, never>> {
    const col = getFavoritesCollection(userId);
    usersHandler.updateCollection(userId, col.id, {
      recipeIds: col.recipeIds.filter((id) => id !== recipeId),
    });
    return { data: {}, success: true };
  },

  clear(userId: string): ApiResponse<Record<string, never>> {
    const col = getFavoritesCollection(userId);
    usersHandler.updateCollection(userId, col.id, { recipeIds: [] });
    return { data: {}, success: true };
  },
};
