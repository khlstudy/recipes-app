import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import type { Recipe } from "../../types";
import type { PaginatedResponse } from "../../api/types";

import { apiClient } from "../../api/client";
import { ENDPOINTS } from "../../api/endpoints";
import { useApi } from "../../hooks/useApi";
import { matchByIngredients } from "../../utils/recommendationService";

import StepList from "../../components/home/step-list/StepList";
import PantryInput from "../../components/smart-matcher/pantry-input/PantryInput";
import MatchFilter from "../../components/smart-matcher/match-filter/MatchFilter";
import {
  countByTier,
  filterByPreset,
} from "../../components/smart-matcher/match-filter/utils";
import MatchResults from "../../components/smart-matcher/match-results/MatchResults";

import {
  DEFAULT_STATE,
  getPantrySuggestions,
  getEmptyMessage,
  loadPantry,
  savePantry,
} from "./utils";
import styles from "./SmartMatcher.module.scss";

const SmartMatcher = () => {
  const navigate = useNavigate();
  const recipesApi = useApi<Recipe[]>();

  const [pantry, setPantry] = useState<string[]>(loadPantry);
  const [filter, setFilter] = useState(DEFAULT_STATE.filter);

  useEffect(() => {
    recipesApi.execute(() =>
      apiClient<PaginatedResponse<Recipe>>(ENDPOINTS.RECIPES, {
        params: { limit: 1000 },
      }).then((res) => res.data)
    );
  }, []);

  useEffect(() => {
    savePantry(pantry);
  }, [pantry]);

  const recipes = useMemo(() => recipesApi.data ?? [], [recipesApi.data]);
  const suggestions = useMemo(() => getPantrySuggestions(recipes), [recipes]);

  const matches = useMemo(
    () => (pantry.length > 0 ? matchByIngredients(recipes, pantry) : []),
    [recipes, pantry]
  );
  const counts = useMemo(() => countByTier(matches), [matches]);
  const visibleMatches = useMemo(
    () => filterByPreset(matches, filter),
    [matches, filter]
  );

  const handleAdd = (ingredient: string) => {
    setPantry((prev) =>
      prev.includes(ingredient) ? prev : [...prev, ingredient]
    );
  };

  const handleRemove = (ingredient: string) => {
    setPantry((prev) => prev.filter((i) => i !== ingredient));
  };

  return (
    <div className={styles["smart-matcher"]}>
      <StepList
        title="Smart Matcher"
        description="Tell us what you already have at home. We rank every recipe by how much of it you can cook right now — the ones you can make today come first."
      />

      <PantryInput
        ingredients={pantry}
        suggestions={suggestions}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onClear={() => setPantry([])}
      />

      <section className={styles["smart-matcher__results"]}>
        {recipesApi.loading ? (
          <p className={styles["smart-matcher__state"]}>Loading recipes...</p>
        ) : recipesApi.error ? (
          <p className={styles["smart-matcher__state"]}>
            Error: {recipesApi.error}
          </p>
        ) : (
          <>
            {matches.length > 0 && (
              <MatchFilter
                value={filter}
                counts={counts}
                onChange={setFilter}
              />
            )}
            <MatchResults
              matches={visibleMatches}
              onRecipeClick={(id) => navigate(`/recipes/${id}`)}
              emptyMessage={getEmptyMessage(pantry.length, filter)}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default SmartMatcher;
