import type { AuthUser, Collection } from "../types";

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  success: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  success: false;
  message: string;
  code: string;
  statusCode: number;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RecipeQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
  diet?: string[];
  difficulty?: string[];
  maxTime?: number;
  sortBy?: "rating" | "cookingTime" | "calories";
  sortOrder?: "asc" | "desc";
}

export interface AddCommentRequest {
  text: string;
  rating: number;
  userId: string;
}

export interface UpdatePreferencesRequest {
  favoriteTags?: string[];
  dietaryRestrictions?: string[];
  dislikedIngredients?: string[];
}

export interface CreateCollectionRequest {
  name: string;
}

export interface UpdateCollectionRequest {
  name?: string;
  recipeIds?: string[];
}

export interface CreateRecipeRequest {
  title: string;
  description: string;
  ingredients: { name: string; amount: number; unit: string }[];
  steps: { text: string; timer?: number }[];
  nutrition: { calories: number; protein: number; carbs: number; fat: number };
  tags: string[];
  imageUrl: string;
  difficulty: "easy" | "medium" | "hard";
  cookingTime: number;
  servings: number;
  diet?: string[];
}

export type UpdateRecipeRequest = Partial<CreateRecipeRequest>;

export type { Collection };
