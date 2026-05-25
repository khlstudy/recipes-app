import type { UserProfile, Collection } from "../../types";
import type {
  ApiResponse,
  UpdatePreferencesRequest,
  UpdateProfileRequest,
  UpdateCollectionRequest,
} from "../types";

import usersData from "../../data/users.json";

const PROFILES_STORAGE_KEY = "user_profiles_overlay";

const seedProfiles = usersData.profiles as UserProfile[];

const loadProfiles = (): UserProfile[] => {
  if (typeof window === "undefined") return [...seedProfiles];
  try {
    const raw = window.localStorage.getItem(PROFILES_STORAGE_KEY);
    if (!raw) return [...seedProfiles];
    const overlay = JSON.parse(raw) as UserProfile[];
    if (!Array.isArray(overlay)) return [...seedProfiles];
    const overlayById = new Map(overlay.map((p) => [p.id, p]));
    const merged = seedProfiles.map((seed) => overlayById.get(seed.id) ?? seed);
    const seedIds = new Set(seedProfiles.map((p) => p.id));
    const extra = overlay.filter((p) => !seedIds.has(p.id));
    return [...merged, ...extra];
  } catch {
    return [...seedProfiles];
  }
};

const persistProfiles = (next: UserProfile[]): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage quota or disabled — silently ignore in mock layer
  }
};

let profiles: UserProfile[] = loadProfiles();

const commit = (next: UserProfile[]): void => {
  profiles = next;
  persistProfiles(profiles);
};

function findProfile(id: string): UserProfile {
  const profile = profiles.find((p) => p.id === id);
  if (!profile)
    throw {
      success: false,
      message: "User not found",
      code: "NOT_FOUND",
      statusCode: 404,
    };
  return profile;
}

function findProfileIdx(id: string): number {
  const idx = profiles.findIndex((p) => p.id === id);
  if (idx === -1)
    throw {
      success: false,
      message: "User not found",
      code: "NOT_FOUND",
      statusCode: 404,
    };
  return idx;
}

export const usersHandler = {
  getProfile(id: string): ApiResponse<UserProfile> {
    return { data: findProfile(id), success: true };
  },

  updateProfile(
    id: string,
    body: UpdateProfileRequest
  ): ApiResponse<UserProfile> {
    const idx = findProfileIdx(id);
    const patch: UpdateProfileRequest = {};
    if (body.name?.trim()) patch.name = body.name.trim();
    if (body.email?.trim()) patch.email = body.email.trim();
    const next = [...profiles];
    next[idx] = { ...next[idx], ...patch };
    commit(next);
    return { data: next[idx], success: true };
  },

  updatePreferences(
    id: string,
    body: UpdatePreferencesRequest
  ): ApiResponse<UserProfile> {
    const idx = findProfileIdx(id);
    const next = [...profiles];
    next[idx] = {
      ...next[idx],
      preferences: { ...next[idx].preferences, ...body },
    };
    commit(next);
    return { data: next[idx], success: true };
  },

  getHistory(id: string): ApiResponse<string[]> {
    return { data: findProfile(id).viewHistory, success: true };
  },

  clearHistory(id: string): ApiResponse<Record<string, never>> {
    const idx = findProfileIdx(id);
    const next = [...profiles];
    next[idx] = { ...next[idx], viewHistory: [] };
    commit(next);
    return { data: {}, success: true };
  },

  addHistory(
    id: string,
    body: { recipeId: string }
  ): ApiResponse<{ recipeId: string }> {
    const idx = findProfileIdx(id);
    const history = profiles[idx].viewHistory.filter(
      (rid) => rid !== body.recipeId
    );
    const next = [...profiles];
    next[idx] = {
      ...next[idx],
      viewHistory: [body.recipeId, ...history],
    };
    commit(next);
    return { data: { recipeId: body.recipeId }, success: true };
  },

  getCollections(id: string): ApiResponse<Collection[]> {
    return { data: findProfile(id).collections, success: true };
  },

  updateCollection(
    id: string,
    colId: string,
    body: UpdateCollectionRequest
  ): ApiResponse<Collection> {
    const profileIdx = findProfileIdx(id);
    const colIdx = profiles[profileIdx].collections.findIndex(
      (c) => c.id === colId
    );
    if (colIdx === -1)
      throw {
        success: false,
        message: "Collection not found",
        code: "NOT_FOUND",
        statusCode: 404,
      };
    const updated = { ...profiles[profileIdx].collections[colIdx], ...body };
    const collections = [...profiles[profileIdx].collections];
    collections[colIdx] = updated;
    const next = [...profiles];
    next[profileIdx] = { ...next[profileIdx], collections };
    commit(next);
    return { data: updated, success: true };
  },

  createProfile(id: string, name: string, email: string): void {
    const newProfile: UserProfile = {
      id,
      name,
      email,
      preferences: {
        favoriteTags: [],
        dietaryRestrictions: [],
        dislikedIngredients: [],
      },
      viewHistory: [],
      collections: [
        {
          id: `col_${id}_fav`,
          name: "Favorites",
          recipeIds: [],
          isDefault: true,
        },
      ],
    };
    commit([...profiles, newProfile]);
  },
};
