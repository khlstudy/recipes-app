import { useState } from "react";
import { useNavigate } from "react-router";

import type { ApiResponse } from "../api/types";
import type { Recipe } from "../types";

import { apiClient } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import { useApi } from "./useApi";

export const useRecipeAdminActions = (onDeleted?: (_id: string) => void) => {
  const navigate = useNavigate();
  const deleteApi = useApi<{ id: string }>();
  const [pendingDeleteRecipe, setPendingDeleteRecipe] = useState<Recipe | null>(
    null
  );

  const handleEdit = (recipe: Recipe) =>
    navigate(`/profile/admin?edit=${recipe.id}`);

  const handleRequestDelete = (recipe: Recipe) =>
    setPendingDeleteRecipe(recipe);

  const handleConfirmDelete = async () => {
    if (!pendingDeleteRecipe) return;
    const id = pendingDeleteRecipe.id;
    const result = await deleteApi.execute(() =>
      apiClient<ApiResponse<{ id: string }>>(ENDPOINTS.RECIPE(id), {
        method: "DELETE",
      }).then((res) => res.data)
    );
    if (!result) return;
    setPendingDeleteRecipe(null);
    onDeleted?.(id);
  };

  const handleCancelDelete = () => setPendingDeleteRecipe(null);

  return {
    pendingDeleteRecipe,
    isDeleting: deleteApi.loading,
    handleEdit,
    handleRequestDelete,
    handleConfirmDelete,
    handleCancelDelete,
  };
};
