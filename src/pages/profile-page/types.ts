import type { Recipe, UserProfile } from "../../types";

export interface ProfileData {
  profile: UserProfile;
  recipeMap: Record<string, Recipe>;
}

export const PROFILE_TAB = {
  SETTINGS: "settings",
  PREFERENCES: "preferences",
  FAVORITES: "favorites",
  ADMIN: "admin",
} as const;

export type ProfileTab = (typeof PROFILE_TAB)[keyof typeof PROFILE_TAB];

export interface ProfileTabSchema {
  key: ProfileTab;
  label: string;
  description: string;
  iconId: string;
  adminOnly: boolean;
}

export const PREFERENCE_GROUP_KEYS = [
  "favoriteTags",
  "dietaryRestrictions",
  "dislikedIngredients",
] as const;

export type PreferenceGroupKey = (typeof PREFERENCE_GROUP_KEYS)[number];

export interface PreferenceGroupSchema {
  key: PreferenceGroupKey;
  title: string;
  iconId: string;
  hint: string;
  placeholder: string;
}

export const FAVORITES_TAB_ID = "favorites";
export const HISTORY_TAB_ID = "view-history";

export interface BoardTab {
  id: string;
  name: string;
  iconId: string;
  recipeIds: string[];
  emptyMessage: string;
}
