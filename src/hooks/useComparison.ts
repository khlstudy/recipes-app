import { useState, useCallback } from "react";

import type { Recipe } from "../types";
import type { UseComparisonResult } from "./types";

import { MAX_COMPARISON } from "./utils";

export function useComparison(): UseComparisonResult {
  const [comparisonList, setComparisonList] = useState<Recipe[]>([]);

  const toggle = useCallback((recipe: Recipe) => {
    setComparisonList((prev) => {
      const isIn = prev.some((r) => r.id === recipe.id);
      if (isIn) return prev.filter((r) => r.id !== recipe.id);
      if (prev.length >= MAX_COMPARISON) return prev;
      return [...prev, recipe];
    });
  }, []);

  const clear = useCallback(() => setComparisonList([]), []);

  const isInComparison = useCallback(
    (recipeId: string) => comparisonList.some((r) => r.id === recipeId),
    [comparisonList]
  );

  return {
    comparisonList,
    toggle,
    clear,
    isInComparison,
    isFull: comparisonList.length >= MAX_COMPARISON,
  };
}
