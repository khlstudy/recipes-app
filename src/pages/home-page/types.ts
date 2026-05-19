import type { Recipe, UserProfile } from "../../types/index";

export interface HomeData {
  recipes: Recipe[];
  userProfile: UserProfile | null;
  favoriteIds: string[];
}
