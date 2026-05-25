import type { Recipe, Comment } from "../../types";
import type {
  ApiResponse,
  PaginatedResponse,
  RecipeQueryParams,
  CreateRecipeRequest,
  UpdateRecipeRequest,
  AddCommentRequest,
} from "../types";

import recipesData from "../../data/recipes.json";
import { applyFilters, searchRecipes } from "../../utils/recommendations";

const USER_RECIPES_STORAGE_KEY = "user_recipes_overlay";

const loadUserRecipes = (): Recipe[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(USER_RECIPES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Recipe[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const persistUserRecipes = (recipes: Recipe[]): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      USER_RECIPES_STORAGE_KEY,
      JSON.stringify(recipes)
    );
  } catch {
    // storage quota or disabled — silently ignore in mock layer
  }
};

export const RECIPES_CHANGED_EVENT = "recipes:changed";

const notifyRecipesChanged = (): void => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(RECIPES_CHANGED_EVENT));
};

const baseStore = recipesData as Recipe[];
let userRecipes: Recipe[] = loadUserRecipes();
let store: Recipe[] = [...userRecipes, ...baseStore];

const syncUserRecipes = (next: Recipe[]): void => {
  userRecipes = next;
  store = [...userRecipes, ...baseStore];
  persistUserRecipes(userRecipes);
  notifyRecipesChanged();
};

// Comments are stored separately so Recipe stays a pure data record
const commentsStore: Record<string, Comment[]> = {};

function getComments(recipeId: string): Comment[] {
  return commentsStore[recipeId] ?? [];
}

function applyQueryParams(
  recipes: Recipe[],
  params: RecipeQueryParams
): PaginatedResponse<Recipe> {
  let result = [...recipes];

  if (params.search) result = searchRecipes(result, params.search);
  if (params.diet?.length) result = applyFilters(result, { diet: params.diet });
  if (params.difficulty?.length)
    result = applyFilters(result, {
      difficulty: params.difficulty as ("easy" | "medium" | "hard")[],
    });
  if (params.maxTime)
    result = applyFilters(result, { maxTime: params.maxTime });
  if (params.tags?.length) result = applyFilters(result, { tags: params.tags });

  if (params.sortBy) {
    result.sort((a, b) => {
      const aVal =
        params.sortBy === "rating"
          ? a.rating.value
          : params.sortBy === "cookingTime"
            ? a.cookingTime
            : a.nutrition.calories;
      const bVal =
        params.sortBy === "rating"
          ? b.rating.value
          : params.sortBy === "cookingTime"
            ? b.cookingTime
            : b.nutrition.calories;
      return params.sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });
  }

  const page = params.page ?? 1;
  const limit = params.limit ?? 12;
  const total = result.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;

  return {
    data: result.slice(start, start + limit),
    success: true,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export const recipesHandler = {
  getAll(params: RecipeQueryParams = {}): PaginatedResponse<Recipe> {
    return applyQueryParams(store, params);
  },

  getById(id: string): ApiResponse<Recipe> {
    const recipe = store.find((r) => r.id === id);
    if (!recipe)
      throw {
        success: false,
        message: "Recipe not found",
        code: "NOT_FOUND",
        statusCode: 404,
      };
    return { data: recipe, success: true };
  },

  create(body: CreateRecipeRequest): ApiResponse<Recipe> {
    const recipe: Recipe = {
      ...body,
      id: `user-${Date.now()}`,
      rating: { value: 0, count: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "u1",
    };
    syncUserRecipes([recipe, ...userRecipes]);
    return { data: recipe, success: true };
  },

  update(id: string, body: UpdateRecipeRequest): ApiResponse<Recipe> {
    const userIdx = userRecipes.findIndex((r) => r.id === id);
    if (userIdx !== -1) {
      const next = [...userRecipes];
      next[userIdx] = {
        ...next[userIdx],
        ...body,
        updatedAt: new Date().toISOString(),
      };
      syncUserRecipes(next);
      return { data: next[userIdx], success: true };
    }
    const idx = store.findIndex((r) => r.id === id);
    if (idx === -1)
      throw {
        success: false,
        message: "Recipe not found",
        code: "NOT_FOUND",
        statusCode: 404,
      };
    store[idx] = {
      ...store[idx],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return { data: store[idx], success: true };
  },

  remove(id: string): ApiResponse<{ id: string }> {
    if (!store.find((r) => r.id === id))
      throw {
        success: false,
        message: "Recipe not found",
        code: "NOT_FOUND",
        statusCode: 404,
      };
    if (userRecipes.find((r) => r.id === id)) {
      syncUserRecipes(userRecipes.filter((r) => r.id !== id));
    } else {
      store = store.filter((r) => r.id !== id);
    }
    return { data: { id }, success: true };
  },

  getComments(id: string): ApiResponse<Comment[]> {
    return { data: getComments(id), success: true };
  },

  addComment(id: string, body: AddCommentRequest): ApiResponse<Comment> {
    if (!store.find((r) => r.id === id))
      throw {
        success: false,
        message: "Recipe not found",
        code: "NOT_FOUND",
        statusCode: 404,
      };
    const comment: Comment = {
      id: `c${Date.now()}`,
      recipeId: id,
      userId: body.userId,
      text: body.text,
      rating: body.rating,
      createdAt: new Date().toISOString(),
    };
    const comments = [...getComments(id), comment];
    commentsStore[id] = comments;

    const avg =
      comments.reduce((sum, c) => sum + c.rating, 0) / comments.length;
    const nextRating = {
      value: Math.round(avg * 10) / 10,
      count: comments.length,
    };
    const userIdx = userRecipes.findIndex((r) => r.id === id);
    if (userIdx !== -1) {
      const next = [...userRecipes];
      next[userIdx] = { ...next[userIdx], rating: nextRating };
      syncUserRecipes(next);
    } else {
      const idx = store.findIndex((r) => r.id === id);
      store[idx] = { ...store[idx], rating: nextRating };
    }

    return { data: comment, success: true };
  },

  getStore() {
    return store;
  },
};
