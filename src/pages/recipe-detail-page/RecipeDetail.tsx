import { useParams } from "react-router";
import { useFetch } from "../../hooks/useFetch";

import type { Recipe } from "../../types";
import type { ApiResponse } from "../../api/types";

import { ENDPOINTS } from "../../api/endpoints";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useFetch<ApiResponse<Recipe>>(
    id ? ENDPOINTS.RECIPE(id) : null
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data?.data) return <div>Recipe not found</div>;

  return <div>{data.data.title}</div>;
};

export default RecipeDetail;
