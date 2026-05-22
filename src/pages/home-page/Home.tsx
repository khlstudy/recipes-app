import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import type { Recipe } from "../../types/index";
import type { UserProfile } from "../../types/index";
import type { PaginatedResponse, ApiResponse } from "../../api/types";

import { apiClient } from "../../api/client";
import { ENDPOINTS } from "../../api/endpoints";
import { useAuthContext } from "../../context/AuthContext";
import { useComparisonContext } from "../../context/ComparisonContext";
import { useApi } from "../../hooks/useApi";
import { ONBOARDING_STEPS, computeFeed } from "./utils";

import RecipeGrid from "../../components/common/recipe-grid/RecipeGrid";
import StepList from "../../components/home/step-list/StepList";

import styles from "./Home.module.scss";

const Home = () => {
  const navigate = useNavigate();
  const { currentUser, openAuthModal } = useAuthContext();
  const { toggle, comparisonList } = useComparisonContext();

  const recipesApi = useApi<Recipe[]>();
  const userApi = useApi<{ userProfile: UserProfile; favoriteIds: string[] }>();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    recipesApi.execute(() =>
      apiClient<PaginatedResponse<Recipe>>(ENDPOINTS.RECIPES).then(
        (res) => res.data
      )
    );
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    userApi
      .execute(() =>
        Promise.all([
          apiClient<ApiResponse<UserProfile>>(ENDPOINTS.USER(currentUser.id)),
          apiClient<ApiResponse<Recipe[]>>(
            ENDPOINTS.USER_FAVORITES(currentUser.id)
          ),
        ]).then(([profileRes, favRes]) => ({
          userProfile: profileRes.data,
          favoriteIds: favRes.data.map((r) => r.id),
        }))
      )
      .then((result) => {
        if (result) setFavoriteIds(result.favoriteIds);
      });
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

  const recipes = recipesApi.data ?? [];
  const userProfile = userApi.data?.userProfile ?? null;
  const { recommendations, isPersonalized, topRecipes } = computeFeed(
    recipes,
    userProfile
  );

  return (
    <div className={styles.home}>
      <StepList
        title="Find Your Next Favorite Recipe"
        description="Discover personalized recipes based on your taste, dietary needs, and what's in your fridge."
        steps={[...ONBOARDING_STEPS]}
      />

      <section className={styles["home__section"]}>
        <RecipeGrid
          recipes={recommendations}
          onRecipeClick={(recipe) => navigate(`/recipes/${recipe.id}`)}
          onFavoriteToggle={handleFavoriteToggle}
          favoriteRecipes={favoriteIds}
          onCompareToggle={toggle}
          comparisonRecipes={comparisonList.map((r) => r.id)}
          title={isPersonalized ? "Recommended For You" : "Worth a Try"}
          emptyMessage="No recipes available yet."
        />
      </section>

      <section className={styles["home__section"]}>
        <RecipeGrid
          recipes={topRecipes}
          onRecipeClick={(recipe) => navigate(`/recipes/${recipe.id}`)}
          onFavoriteToggle={handleFavoriteToggle}
          favoriteRecipes={favoriteIds}
          onCompareToggle={toggle}
          comparisonRecipes={comparisonList.map((r) => r.id)}
          title="Top Recipes"
          emptyMessage="No recipes available yet."
        />
      </section>
    </div>
  );
};

export default Home;
