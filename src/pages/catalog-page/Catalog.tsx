import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import type { Recipe, UserProfile } from "../../types";
import type { ApiResponse, PaginatedResponse } from "../../api/types";

import { apiClient } from "../../api/client";
import { ENDPOINTS } from "../../api/endpoints";
import { useAuthContext } from "../../context/AuthContext";
import { useComparisonContext } from "../../context/ComparisonContext";
import { useSearchFocusContext } from "../../context/SearchFocusContext";
import { useApi } from "../../hooks/useApi";

import FilterPanel from "../../components/catalog/filter-panel/FilterPanel";
import CatalogToolbar from "../../components/catalog/catalog-toolbar/CatalogToolbar";
import RecipeGrid from "../../components/common/recipe-grid/RecipeGrid";
import StepList from "../../components/home/step-list/StepList";
import ConfirmModal from "../../components/common/confirm-modal/ConfirmModal";
import { useRecipeAdminActions } from "../../hooks/useRecipeAdminActions";
import { classNames } from "../../utils/classNames";

import {
  DEFAULT_FILTERS,
  SORT_OPTIONS,
  getCatalogResults,
  isDefaultFilters,
} from "./utils";
import type { CatalogFilters, SortKey } from "./types";
import styles from "./Catalog.module.scss";

const Catalog = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, openAuthModal } = useAuthContext();
  const { toggle, comparisonList } = useComparisonContext();
  const { focusSearch } = useSearchFocusContext();

  const recipesApi = useApi<Recipe[]>();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [dislikedIngredients, setDislikedIngredients] = useState<string[]>([]);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const isAdmin = currentUser?.role === "admin";
  const admin = useRecipeAdminActions((id) => {
    setDeletedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  });

  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<SortKey>("rating");
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const search = searchParams.get("search") ?? "";
  const searchType = searchParams.get("searchType") ?? "";

  useEffect(() => {
    recipesApi.execute(() =>
      apiClient<PaginatedResponse<Recipe>>(ENDPOINTS.RECIPES, {
        params: { limit: 1000 },
      }).then((res) => res.data)
    );
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setFavoriteIds([]);
      setDislikedIngredients([]);
      return;
    }
    apiClient<ApiResponse<Recipe[]>>(
      ENDPOINTS.USER_FAVORITES(currentUser.id)
    ).then((res) => setFavoriteIds(res.data.map((r) => r.id)));
    apiClient<ApiResponse<UserProfile>>(ENDPOINTS.USER(currentUser.id)).then(
      (res) => setDislikedIngredients(res.data.preferences.dislikedIngredients)
    );
  }, [currentUser]);

  const handleFavoriteToggle = async (recipeId: string) => {
    if (!currentUser) {
      openAuthModal();
      return;
    }
    const isFav = favoriteIds.includes(recipeId);

    if (isFav) {
      await apiClient(ENDPOINTS.USER_FAVORITE(currentUser.id, recipeId), {
        method: "DELETE",
      });
      setFavoriteIds((prev) => prev.filter((id) => id !== recipeId));
    } else {
      await apiClient(ENDPOINTS.USER_FAVORITES(currentUser.id), {
        method: "POST",
        body: { recipeId },
      });
      setFavoriteIds((prev) => [...prev, recipeId]);
    }
  };

  const recipes = useMemo(
    () => (recipesApi.data ?? []).filter((r) => !deletedIds.has(r.id)),
    [recipesApi.data, deletedIds]
  );
  const results = useMemo(
    () => getCatalogResults(recipes, search, filters, sortBy),
    [recipes, search, filters, sortBy]
  );

  const emptyMessage = search
    ? `No recipes match "${search}". Try a different search or adjust filters.`
    : "No recipes match the selected filters.";

  return (
    <div className={styles.catalog}>
      <StepList
        title="Recipe Catalog"
        description="Browse every recipe, then narrow down by diet, difficulty, time, and the ingredients you have on hand. Use the search bar above to look up a recipe by name, ingredient, or tag."
      />

      <div className={styles.catalog__layout}>
        <div
          className={classNames(
            styles.catalog__sidebar,
            isPanelOpen && styles["catalog__sidebar--open"]
          )}>
          <button
            type="button"
            className={styles.catalog__backdrop}
            aria-label="Close filters"
            onClick={() => setIsPanelOpen(false)}
          />
          <div className={styles.catalog__panel}>
            <FilterPanel
              recipes={recipes}
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(DEFAULT_FILTERS)}
              isResettable={!isDefaultFilters(filters)}
            />
          </div>
        </div>

        <section className={styles.catalog__results}>
          <CatalogToolbar
            resultCount={results.length}
            searchQuery={search}
            searchType={searchType}
            sortBy={sortBy}
            sortOptions={SORT_OPTIONS}
            onSortChange={setSortBy}
            onOpenFilters={() => setIsPanelOpen(true)}
            onFocusSearch={focusSearch}
          />

          {recipesApi.loading ? (
            <p className={styles.catalog__state}>Loading recipes...</p>
          ) : recipesApi.error ? (
            <p className={styles.catalog__state}>Error: {recipesApi.error}</p>
          ) : (
            <RecipeGrid
              recipes={results}
              onRecipeClick={(recipe) => navigate(`/recipes/${recipe.id}`)}
              onFavoriteToggle={handleFavoriteToggle}
              favoriteRecipes={favoriteIds}
              onCompareToggle={toggle}
              comparisonRecipes={comparisonList.map((r) => r.id)}
              canEdit={isAdmin}
              onEdit={admin.handleEdit}
              onDelete={(recipeId) => {
                const recipe = recipes.find((r) => r.id === recipeId);
                if (recipe) admin.handleRequestDelete(recipe);
              }}
              dislikedIngredients={dislikedIngredients}
              emptyMessage={emptyMessage}
            />
          )}
        </section>
      </div>

      <ConfirmModal
        isOpen={admin.pendingDeleteRecipe !== null}
        title="Delete recipe?"
        description="This will permanently remove the recipe from the catalog. This action cannot be undone."
        highlight={admin.pendingDeleteRecipe?.title}
        confirmLabel="Delete"
        confirmVariant="danger"
        pending={admin.isDeleting}
        onConfirm={admin.handleConfirmDelete}
        onClose={admin.handleCancelDelete}
      />
    </div>
  );
};

export default Catalog;
