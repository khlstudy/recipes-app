import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import type { Recipe, Comment } from "../../types";
import type { ApiResponse } from "../../api/types";

import { apiClient } from "../../api/client";
import { ENDPOINTS } from "../../api/endpoints";
import { useAuthContext } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import {
  ICONS_PATH,
  RECIPE_ICON_IDS,
} from "../../components/common/recipe-card/utils";

import RecipeHero from "../../components/recipe-details/recipe-hero/RecipeHero";
import RecipeSection from "../../components/recipe-details/recipe-section/RecipeSection";
import IngredientList from "../../components/recipe-details/ingredient-list/IngredientList";
import InstructionList from "../../components/recipe-details/instruction-list/InstructionList";
import NutritionPanel from "../../components/recipe-details/nutrition-panel/NutritionPanel";
import CommentList from "../../components/recipe-details/comment-list/CommentList";

import styles from "./RecipeDetail.module.scss";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, openAuthModal } = useAuthContext();

  const handleBack = () => {
    if (location.key === "default") navigate("/");
    else navigate(-1);
  };

  const {
    data: recipeRes,
    loading,
    error,
  } = useFetch<ApiResponse<Recipe>>(id ? ENDPOINTS.RECIPE(id) : null);
  const { data: commentsRes } = useFetch<ApiResponse<Comment[]>>(
    id ? ENDPOINTS.RECIPE_COMMENTS(id) : null
  );

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    apiClient<ApiResponse<Recipe[]>>(
      ENDPOINTS.USER_FAVORITES(currentUser.id)
    ).then((res) => setFavoriteIds(res.data.map((r) => r.id)));
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
      setFavoriteIds((prev) => prev.filter((rid) => rid !== recipeId));
    } else {
      await apiClient(ENDPOINTS.USER_FAVORITES(currentUser.id), {
        method: "POST",
        body: { recipeId },
      });
      setFavoriteIds((prev) => [...prev, recipeId]);
    }
  };

  if (loading)
    return <div className={styles["recipe-detail__state"]}>Loading...</div>;
  if (error)
    return <div className={styles["recipe-detail__state"]}>Error: {error}</div>;
  if (!recipeRes?.data)
    return (
      <div className={styles["recipe-detail__state"]}>Recipe not found</div>
    );

  const recipe = recipeRes.data;
  const comments = commentsRes?.data ?? [];
  const isFavorite = favoriteIds.includes(recipe.id);

  return (
    <div className={styles["recipe-detail"]}>
      <RecipeHero
        recipe={recipe}
        isFavorite={isFavorite}
        onFavoriteToggle={handleFavoriteToggle}
        onBack={handleBack}
      />

      <RecipeSection
        title="Ingredients"
        iconSrc={`${ICONS_PATH}${RECIPE_ICON_IDS.list}`}>
        <IngredientList ingredients={recipe.ingredients} />
      </RecipeSection>

      <RecipeSection
        title="Step-by-step instructions"
        iconSrc={`${ICONS_PATH}${RECIPE_ICON_IDS.chef}`}>
        <InstructionList steps={recipe.steps} />
      </RecipeSection>

      <RecipeSection
        title="Nutrition (per serving)"
        iconSrc={`${ICONS_PATH}${RECIPE_ICON_IDS.salad}`}>
        <NutritionPanel nutrition={recipe.nutrition} />
      </RecipeSection>

      <RecipeSection
        title="Comments & reviews"
        iconSrc={`${ICONS_PATH}${RECIPE_ICON_IDS.star}`}>
        <CommentList comments={comments} />
      </RecipeSection>
    </div>
  );
};

export default RecipeDetail;
