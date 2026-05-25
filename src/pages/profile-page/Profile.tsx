import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import type { Recipe, UserProfile } from "../../types";
import type {
  ApiResponse,
  PaginatedResponse,
  CreateRecipeRequest,
} from "../../api/types";
import type { ProfileData, ProfileTab, PreferenceGroupKey } from "./types";
import type { AdminMode } from "../../components/profile/admin-tab/types";

import { apiClient } from "../../api/client";
import { ENDPOINTS } from "../../api/endpoints";
import { useAuthContext } from "../../context/AuthContext";
import { useComparisonContext } from "../../context/ComparisonContext";
import { useToastContext } from "../../context/ToastContext";
import { useApi } from "../../hooks/useApi";
import { PROFILE_TAB, FAVORITES_TAB_ID, HISTORY_TAB_ID } from "./types";
import {
  buildPreferencePools,
  buildRecipeMap,
  collectIngredientPool,
  collectUnitPool,
  getFavoriteIds,
  visibleTabs,
} from "./utils";
import { RECIPE_ICON_IDS } from "../../components/common/recipe-card/utils";

import ProfileNav from "../../components/profile/profile-nav/ProfileNav";
import SettingsTab from "../../components/profile/settings-tab/SettingsTab";
import PreferencesTab from "../../components/profile/preferences-tab/PreferencesTab";
import FavoritesTab from "../../components/profile/favorites-tab/FavoritesTab";
import AdminTab from "../../components/profile/admin-tab/AdminTab";
import ConfirmModal from "../../components/common/confirm-modal/ConfirmModal";

import styles from "./Profile.module.scss";

const Profile = () => {
  const navigate = useNavigate();
  const { tab: tabParam } = useParams<{ tab: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentUser, logout, updateCurrentUser } = useAuthContext();
  const { toggle: toggleComparison, comparisonList } = useComparisonContext();
  const { showToast } = useToastContext();
  const isAdmin = currentUser?.role === "admin";

  const profileApi = useApi<ProfileData>();
  const identityApi = useApi<UserProfile>();
  const preferencesApi = useApi<UserProfile>();
  const recipeApi = useApi<Recipe>();
  const deleteApi = useApi<{ id: string }>();
  const clearApi = useApi<Record<string, never>>();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recipeMap, setRecipeMap] = useState<Record<string, Recipe>>({});
  const [activeFavoritesTabId, setActiveFavoritesTabId] =
    useState(FAVORITES_TAB_ID);
  const [adminMode, setAdminMode] = useState<AdminMode>("create");
  const [pendingDeleteRecipe, setPendingDeleteRecipe] = useState<Recipe | null>(
    null
  );
  const [pendingClearTabId, setPendingClearTabId] = useState<string | null>(
    null
  );

  const editingId = searchParams.get("edit");
  const editingRecipe =
    editingId && recipeMap[editingId] ? recipeMap[editingId] : null;

  useEffect(() => {
    if (editingRecipe) setAdminMode("edit");
    else setAdminMode("create");
  }, [editingRecipe]);

  const tabs = useMemo(() => {
    const base = visibleTabs(isAdmin);
    if (!editingRecipe) return base;
    return base.map((tab) =>
      tab.key === PROFILE_TAB.ADMIN
        ? {
            ...tab,
            label: "Edit",
            description: `Editing "${editingRecipe.title}"`,
            iconId: RECIPE_ICON_IDS.edit,
          }
        : tab
    );
  }, [isAdmin, editingRecipe]);

  const activeTab: ProfileTab = !tabParam
    ? PROFILE_TAB.SETTINGS
    : tabs.some((t) => t.key === tabParam)
      ? (tabParam as ProfileTab)
      : PROFILE_TAB.SETTINGS;

  useEffect(() => {
    if (tabParam && !tabs.some((t) => t.key === tabParam)) {
      navigate("/profile", { replace: true });
    }
  }, [tabParam, tabs, navigate]);

  const handleSelectTab = (tab: ProfileTab) =>
    navigate(tab === PROFILE_TAB.SETTINGS ? "/profile" : `/profile/${tab}`);
  const recipeValues = useMemo(() => Object.values(recipeMap), [recipeMap]);
  const preferencePools = useMemo(
    () => buildPreferencePools(recipeValues),
    [recipeValues]
  );
  const ingredientPool = useMemo(
    () => collectIngredientPool(recipeValues),
    [recipeValues]
  );
  const unitPool = useMemo(() => collectUnitPool(recipeValues), [recipeValues]);

  useEffect(() => {
    if (!currentUser) return;

    profileApi
      .execute(() =>
        Promise.all([
          apiClient<ApiResponse<UserProfile>>(ENDPOINTS.USER(currentUser.id)),
          apiClient<PaginatedResponse<Recipe>>(ENDPOINTS.RECIPES),
        ]).then(([profileRes, recipesRes]) => ({
          profile: profileRes.data,
          recipeMap: buildRecipeMap(recipesRes.data),
        }))
      )
      .then((result) => {
        if (!result) return;
        setProfile(result.profile);
        setRecipeMap(result.recipeMap);
      });
  }, [currentUser]);

  if (profileApi.loading) {
    return (
      <p className={styles.profile__state}>Loading your kitchen profile...</p>
    );
  }

  if (profileApi.error || !profile || !currentUser) {
    return (
      <p className={styles.profile__state}>
        {profileApi.error ?? "We could not load your profile."}
      </p>
    );
  }

  const handleSaveProfile = async (input: {
    name: string;
    email: string;
  }): Promise<boolean> => {
    const result = await identityApi.execute(() =>
      apiClient<ApiResponse<UserProfile>>(ENDPOINTS.USER(currentUser.id), {
        method: "PUT",
        body: input,
      }).then((res) => res.data)
    );
    if (!result) return false;
    setProfile(result);
    updateCurrentUser({ name: result.name, email: result.email });
    return true;
  };

  const handlePreferenceChange = (
    group: PreferenceGroupKey,
    values: string[]
  ) => {
    const previous = profile;
    setProfile({
      ...profile,
      preferences: { ...profile.preferences, [group]: values },
    });

    preferencesApi
      .execute(() =>
        apiClient<ApiResponse<UserProfile>>(
          ENDPOINTS.USER_PREFERENCES(currentUser.id),
          { method: "PUT", body: { [group]: values } }
        ).then((res) => res.data)
      )
      .then((result) => setProfile(result ?? previous));
  };

  const handleFavoriteToggle = async (recipeId: string) => {
    const isFavorite = getFavoriteIds(profile.collections).includes(recipeId);

    if (isFavorite) {
      await apiClient(ENDPOINTS.USER_FAVORITE(currentUser.id, recipeId), {
        method: "DELETE",
      });
    } else {
      await apiClient(ENDPOINTS.USER_FAVORITES(currentUser.id), {
        method: "POST",
        body: { recipeId },
      });
    }

    const refreshed = await apiClient<ApiResponse<UserProfile>>(
      ENDPOINTS.USER(currentUser.id)
    );
    setProfile(refreshed.data);
  };

  const handleRequestClear = (tabId: string) => {
    if (tabId !== FAVORITES_TAB_ID && tabId !== HISTORY_TAB_ID) return;
    setPendingClearTabId(tabId);
  };

  const handleConfirmClear = async () => {
    if (!pendingClearTabId) return;
    const tabId = pendingClearTabId;
    const endpoint =
      tabId === FAVORITES_TAB_ID
        ? ENDPOINTS.USER_FAVORITES(currentUser.id)
        : ENDPOINTS.USER_HISTORY(currentUser.id);
    const result = await clearApi.execute(() =>
      apiClient<ApiResponse<Record<string, never>>>(endpoint, {
        method: "DELETE",
      }).then((res) => res.data)
    );
    if (!result) return;
    const refreshed = await apiClient<ApiResponse<UserProfile>>(
      ENDPOINTS.USER(currentUser.id)
    );
    setProfile(refreshed.data);
    setPendingClearTabId(null);
  };

  const clearTitle =
    pendingClearTabId === FAVORITES_TAB_ID
      ? "Clear all favorites?"
      : "Clear viewing history?";
  const clearDescription =
    pendingClearTabId === FAVORITES_TAB_ID
      ? "All recipes will be removed from your Favorites collection. This action cannot be undone."
      : "Your recently viewed recipes will be cleared. This action cannot be undone.";
  const clearHighlight =
    pendingClearTabId === FAVORITES_TAB_ID
      ? `${getFavoriteIds(profile.collections).length} saved recipes`
      : `${profile.viewHistory.length} viewed recipes`;

  const handleCreateRecipe = (recipe: CreateRecipeRequest) => {
    recipeApi
      .execute(() =>
        apiClient<ApiResponse<Recipe>>(ENDPOINTS.RECIPES, {
          method: "POST",
          body: recipe,
        }).then((res) => res.data)
      )
      .then((result) => {
        if (result) {
          setRecipeMap((prev) => ({ ...prev, [result.id]: result }));
          showToast({
            title: `Published "${result.title}"`,
            description: "Your new recipe is live in the catalog.",
            action: {
              label: "Find in catalog",
              onClick: () => {
                const params = new URLSearchParams({
                  search: result.title,
                  searchType: "title",
                });
                window.open(
                  `/catalog?${params.toString()}`,
                  "_blank",
                  "noopener"
                );
              },
            },
          });
        } else if (recipeApi.error) {
          showToast({
            tone: "error",
            title: "Could not publish recipe",
            description: recipeApi.error,
          });
        }
      });
  };

  const handleUpdateRecipe = (id: string, recipe: CreateRecipeRequest) => {
    recipeApi
      .execute(() =>
        apiClient<ApiResponse<Recipe>>(ENDPOINTS.RECIPE(id), {
          method: "PUT",
          body: recipe,
        }).then((res) => res.data)
      )
      .then((result) => {
        if (result) {
          setRecipeMap((prev) => ({ ...prev, [result.id]: result }));
          showToast({
            title: `Saved "${result.title}"`,
            description: "Your changes are live in the catalog.",
            action: {
              label: "Find in catalog",
              onClick: () => {
                const params = new URLSearchParams({
                  search: result.title,
                  searchType: "title",
                });
                window.open(
                  `/catalog?${params.toString()}`,
                  "_blank",
                  "noopener"
                );
              },
            },
          });
        }
      });
  };

  const handleRequestEdit = (recipe: Recipe) => {
    navigate(`/profile/${PROFILE_TAB.ADMIN}?edit=${recipe.id}`);
  };

  const handleCancelEdit = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("edit");
    setSearchParams(next, { replace: true });
    setAdminMode("create");
  };

  const handleRequestDelete = (recipeId: string) => {
    const recipe = recipeMap[recipeId];
    if (!recipe) return;
    setPendingDeleteRecipe(recipe);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteRecipe) return;
    const id = pendingDeleteRecipe.id;
    const result = await deleteApi.execute(() =>
      apiClient<ApiResponse<{ id: string }>>(ENDPOINTS.RECIPE(id), {
        method: "DELETE",
      }).then((res) => res.data)
    );
    if (!result) return;
    setRecipeMap((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setPendingDeleteRecipe(null);
    if (editingId === id) handleCancelEdit();
  };

  const openRecipe = (recipeId: string) => navigate(`/recipes/${recipeId}`);

  const tabContent: Record<ProfileTab, ReactNode> = {
    [PROFILE_TAB.SETTINGS]: (
      <SettingsTab
        profile={profile}
        role={currentUser.role}
        savingProfile={identityApi.loading}
        profileError={identityApi.error}
        onLogout={logout}
        onSaveProfile={handleSaveProfile}
      />
    ),
    [PROFILE_TAB.PREFERENCES]: (
      <PreferencesTab
        preferences={profile.preferences}
        pools={preferencePools}
        saving={preferencesApi.loading}
        onPreferenceChange={handlePreferenceChange}
      />
    ),
    [PROFILE_TAB.FAVORITES]: (
      <FavoritesTab
        profile={profile}
        recipeMap={recipeMap}
        activeTabId={activeFavoritesTabId}
        favoriteIds={getFavoriteIds(profile.collections)}
        comparisonIds={comparisonList.map((recipe) => recipe.id)}
        onSelectTab={setActiveFavoritesTabId}
        onOpenRecipe={openRecipe}
        onFavoriteToggle={handleFavoriteToggle}
        onCompareToggle={toggleComparison}
        canEdit={isAdmin}
        onEdit={handleRequestEdit}
        onDelete={handleRequestDelete}
        onClearActive={handleRequestClear}
        dislikedIngredients={profile.preferences.dislikedIngredients}
      />
    ),
    [PROFILE_TAB.ADMIN]: (
      <AdminTab
        submitting={recipeApi.loading}
        tagPool={preferencePools.favoriteTags}
        dietPool={preferencePools.dietaryRestrictions}
        ingredientPool={ingredientPool}
        unitPool={unitPool}
        mode={adminMode}
        editingRecipe={editingRecipe}
        onCreateRecipe={handleCreateRecipe}
        onUpdateRecipe={handleUpdateRecipe}
        onCancelEdit={handleCancelEdit}
      />
    ),
  };

  return (
    <div className={styles.profile}>
      <div className={styles.profile__layout}>
        <aside className={styles.profile__sidebar}>
          <ProfileNav
            tabs={tabs}
            activeTab={activeTab}
            onSelect={handleSelectTab}
          />
        </aside>

        <div key={activeTab} className={styles.profile__content}>
          {tabContent[activeTab]}
        </div>
      </div>

      <ConfirmModal
        isOpen={pendingDeleteRecipe !== null}
        title="Delete recipe?"
        description="This will permanently remove the recipe from the catalog. This action cannot be undone."
        highlight={pendingDeleteRecipe?.title}
        confirmLabel="Delete"
        confirmVariant="danger"
        pending={deleteApi.loading}
        onConfirm={handleConfirmDelete}
        onClose={() => setPendingDeleteRecipe(null)}
      />

      <ConfirmModal
        isOpen={pendingClearTabId !== null}
        title={clearTitle}
        description={clearDescription}
        highlight={clearHighlight}
        confirmLabel="Clear all"
        confirmVariant="danger"
        pending={clearApi.loading}
        onConfirm={handleConfirmClear}
        onClose={() => setPendingClearTabId(null)}
      />
    </div>
  );
};

export default Profile;
