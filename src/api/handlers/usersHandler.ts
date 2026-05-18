import type { UserProfile, Collection } from "../../types";
import type {
  ApiResponse,
  UpdatePreferencesRequest,
  CreateCollectionRequest,
  UpdateCollectionRequest,
} from "../types";

import usersData from "../../data/users.json";

let profiles: UserProfile[] = usersData.profiles as UserProfile[];

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

  updatePreferences(
    id: string,
    body: UpdatePreferencesRequest
  ): ApiResponse<UserProfile> {
    const idx = findProfileIdx(id);
    profiles[idx] = {
      ...profiles[idx],
      preferences: { ...profiles[idx].preferences, ...body },
    };
    return { data: profiles[idx], success: true };
  },

  getHistory(id: string): ApiResponse<string[]> {
    return { data: findProfile(id).viewHistory, success: true };
  },

  addHistory(
    id: string,
    body: { recipeId: string }
  ): ApiResponse<{ recipeId: string }> {
    const idx = findProfileIdx(id);
    const history = profiles[idx].viewHistory.filter(
      (rid) => rid !== body.recipeId
    );
    profiles[idx] = {
      ...profiles[idx],
      viewHistory: [body.recipeId, ...history],
    };
    return { data: { recipeId: body.recipeId }, success: true };
  },

  getCollections(id: string): ApiResponse<Collection[]> {
    return { data: findProfile(id).collections, success: true };
  },

  createCollection(
    id: string,
    body: CreateCollectionRequest
  ): ApiResponse<Collection> {
    const idx = findProfileIdx(id);
    const collection: Collection = {
      id: `col${Date.now()}`,
      name: body.name,
      recipeIds: [],
      isDefault: false,
    };
    profiles[idx] = {
      ...profiles[idx],
      collections: [...profiles[idx].collections, collection],
    };
    return { data: collection, success: true };
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
    profiles[profileIdx] = { ...profiles[profileIdx], collections };
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
        {
          id: `col_${id}_wtt`,
          name: "Want to Try",
          recipeIds: [],
          isDefault: true,
        },
        {
          id: `col_${id}_hist`,
          name: "Cooking History",
          recipeIds: [],
          isDefault: true,
        },
      ],
    };
    profiles = [...profiles, newProfile];
  },
};
