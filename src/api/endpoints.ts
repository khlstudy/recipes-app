export const ENDPOINTS = {
  // Auth
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",

  // Recipes
  RECIPES: "/api/recipes",
  RECIPE: (id: string) => `/api/recipes/${id}`,
  RECIPE_COMMENTS: (id: string) => `/api/recipes/${id}/comments`,

  // Users
  USER: (id: string) => `/api/users/${id}`,
  USER_PREFERENCES: (id: string) => `/api/users/${id}/preferences`,
  USER_FAVORITES: (id: string) => `/api/users/${id}/favorites`,
  USER_FAVORITE: (userId: string, recipeId: string) =>
    `/api/users/${userId}/favorites/${recipeId}`,
  USER_HISTORY: (id: string) => `/api/users/${id}/history`,
} as const;
