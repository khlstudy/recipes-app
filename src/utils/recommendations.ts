import type {
  Recipe,
  UserProfile,
  FilterOptions,
  MatchedRecipe,
  MatchTier,
} from "../types";
import { ingredientsMatch } from "./ingredient-normalization";

// --- Data Mining: Jaccard Similarity ---
// J(A, B) = |A ∩ B| / |A ∪ B|
// Measures similarity between two tag sets (range 0–1).
export function calculateTagSimilarity(
  tags1: string[],
  tags2: string[]
): number {
  const set1 = new Set(tags1.map((t) => t.toLowerCase()));
  const set2 = new Set(tags2.map((t) => t.toLowerCase()));
  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return union.size > 0 ? intersection.size / union.size : 0;
}

// --- Data Mining: Weighted Sum Model (Content-Based Filtering) ---
// Weights: tags 35% + favorite similarity 30% + rating 20% + view history 15%
// Penalty functions (Operations Research): diet mismatch ×0.3, disliked ingredient ×0.2
export function calculateRecipeScore(
  recipe: Recipe,
  userProfile: UserProfile,
  allRecipes: Recipe[]
): number {
  let score = 0;

  // 1. Tag similarity with user's favorite tags (35%)
  const tagScore = calculateTagSimilarity(
    recipe.tags,
    userProfile.preferences.favoriteTags
  );
  score += tagScore * 35;

  // 2. Similarity to already-favorited recipes (30%)
  const favCol = userProfile.collections.find(
    (c) => c.name === "Favorites" && c.isDefault
  );
  const favIds = favCol?.recipeIds ?? [];
  const favoriteRecipes = allRecipes.filter((r) => favIds.includes(r.id));
  if (favoriteRecipes.length > 0) {
    const avgSimilarity =
      favoriteRecipes.reduce(
        (sum, fav) => sum + calculateTagSimilarity(recipe.tags, fav.tags),
        0
      ) / favoriteRecipes.length;
    score += avgSimilarity * 30;
  }

  // 3. Penalty: dietary restrictions not met (×0.3)
  const matchesDiet = userProfile.preferences.dietaryRestrictions.every(
    (restriction) => !recipe.diet || recipe.diet.includes(restriction)
  );
  if (!matchesDiet) score *= 0.3;

  // 4. Penalty: disliked ingredients present (×0.2)
  const hasDislikedIngredients = recipe.ingredients.some((ing) =>
    userProfile.preferences.dislikedIngredients.some((disliked) =>
      ing.name.toLowerCase().includes(disliked.toLowerCase())
    )
  );
  if (hasDislikedIngredients) score *= 0.2;

  // 5. Recipe popularity / rating (20%)
  score += (recipe.rating.value / 5) * 20;

  // 6. View-history bonus — viewed but not yet favorited (15%)
  if (
    userProfile.viewHistory.includes(recipe.id) &&
    !favIds.includes(recipe.id)
  ) {
    score += 15;
  }

  return score;
}

// --- Content-Based Filtering + Top-K Ranking ---
// Excludes already-favorited recipes; returns top `limit` by score.
export function getPersonalizedRecommendations(
  recipes: Recipe[],
  userProfile: UserProfile,
  limit = 6
): Recipe[] {
  const favCol = userProfile.collections.find(
    (c) => c.name === "Favorites" && c.isDefault
  );
  const favIds = favCol?.recipeIds ?? [];
  const candidates = recipes.filter((r) => !favIds.includes(r.id));
  return candidates
    .map((recipe) => ({
      recipe,
      score: calculateRecipeScore(recipe, userProfile, recipes),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.recipe);
}

// --- Information Retrieval: Ranking Algorithm ---
// Sort by rating descending; return top K.
export function getTopRatedRecipes(recipes: Recipe[], limit = 6): Recipe[] {
  return [...recipes]
    .sort((a, b) => b.rating.value - a.rating.value)
    .slice(0, limit);
}

// --- Keyword-based Search ---
// OR across title / description / tags / ingredients (substring match).
export function searchRecipes(recipes: Recipe[], query: string): Recipe[] {
  const q = query.toLowerCase().trim();
  if (!q) return recipes;
  return recipes.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q)) ||
      r.ingredients.some((i) => i.name.toLowerCase().includes(q))
  );
}

// --- Information Retrieval: Boolean Retrieval (AND for filters, range for time) ---
export function applyFilters(
  recipes: Recipe[],
  filters: FilterOptions
): Recipe[] {
  let result = [...recipes];

  if (filters.ingredients?.length) {
    const normalized = filters.ingredients.map((i) => i.toLowerCase());
    result = result.filter((r) =>
      r.ingredients.some((ing) =>
        normalized.some((f) => ing.name.toLowerCase().includes(f))
      )
    );
  }

  if (filters.diet?.length) {
    result = result.filter(
      (r) => r.diet && filters.diet!.every((d) => r.diet!.includes(d))
    );
  }

  if (filters.maxTime) {
    result = result.filter((r) => r.cookingTime <= filters.maxTime!);
  }

  if (filters.difficulty?.length) {
    result = result.filter((r) => filters.difficulty!.includes(r.difficulty));
  }

  if (filters.tags?.length) {
    result = result.filter((r) =>
      filters.tags!.every((t) => r.tags.includes(t))
    );
  }

  return result;
}

// --- Ingredient Set Matching (two metrics over normalized sets) ---
// Matching is exact equality of canonical ingredient names — normalization
// collapses synonyms/plurals so that |A ∩ B| is counted correctly. Substring
// matching is deliberately avoided ("egg" ≠ "eggplant", "oil" ≠ "olive oil").
//
// coverage = matched / recipe.ingredients  → recall-like, shown on the card.
// matchPercentage = overlap coefficient (Szymkiewicz–Simpson):
//            matched / min(recipe.ingredients, available) → used for ranking,
//            avoids penalising large recipes that match well given what's on hand.
//
// No filtering threshold: every recipe with at least one shared ingredient is
// returned, ranked by relevance. Each result is classified into a tier so the
// UI can group results without making the user tune a cutoff.
// MCDM/WSM sort: coverage% ×0.5 + match count ×0.3 + rating ×0.2

// "ready" = nothing to buy (|recipe \ available| = 0). "almost" = a short
// shopping list. "explore" = everything else still worth a look.
const ALMOST_MAX_MISSING = 3;

function classifyTier(missingCount: number): MatchTier {
  if (missingCount === 0) return "ready";
  if (missingCount <= ALMOST_MAX_MISSING) return "almost";
  return "explore";
}

export function smartMatchByIngredients(
  recipes: Recipe[],
  availableIngredients: string[]
): MatchedRecipe[] {
  const matched: MatchedRecipe[] = recipes.map((recipe) => {
    const matchedIngredients: string[] = [];
    const missingIngredients: string[] = [];

    recipe.ingredients.forEach((ing) => {
      const isMatch = availableIngredients.some((available) =>
        ingredientsMatch(available, ing.name)
      );
      if (isMatch) matchedIngredients.push(ing.name);
      else missingIngredients.push(ing.name);
    });

    const coverage =
      recipe.ingredients.length > 0
        ? (matchedIngredients.length / recipe.ingredients.length) * 100
        : 0;

    // Overlap coefficient: denominator = smaller of the two sets
    const matchPercentage =
      (matchedIngredients.length /
        Math.min(recipe.ingredients.length, availableIngredients.length)) *
      100;

    return {
      recipe,
      matchPercentage,
      coverage,
      tier: classifyTier(missingIngredients.length),
      matchedIngredients,
      missingIngredients,
    };
  });

  // The only exclusion: a recipe must share at least one ingredient with the
  // pantry, otherwise it is not a match at all.
  const filtered = matched.filter((m) => m.matchedIngredients.length > 0);

  // MCDM/WSM sort
  return filtered.sort((a, b) => {
    const score = (x: MatchedRecipe) =>
      x.coverage * 0.5 +
      x.matchedIngredients.length * 10 * 0.3 +
      (x.recipe.rating.value / 5) * 100 * 0.2;
    return score(b) - score(a);
  });
}

// --- Multi-Criteria Comparison ---
export interface RecipeComparison {
  recipes: Recipe[];
  comparison: {
    difficulty: Record<string, string>;
    cookingTime: Record<string, number>;
    calories: Record<string, number>;
    protein: Record<string, number>;
    carbs: Record<string, number>;
    rating: Record<string, number>;
    servings: Record<string, number>;
    ingredientCount: Record<string, number>;
  };
}

export function compareRecipes(recipes: Recipe[]): RecipeComparison {
  const comparison: RecipeComparison = {
    recipes,
    comparison: {
      difficulty: {},
      cookingTime: {},
      calories: {},
      protein: {},
      carbs: {},
      rating: {},
      servings: {},
      ingredientCount: {},
    },
  };

  recipes.forEach((r) => {
    comparison.comparison.difficulty[r.id] = r.difficulty;
    comparison.comparison.cookingTime[r.id] = r.cookingTime;
    comparison.comparison.calories[r.id] = r.nutrition.calories;
    comparison.comparison.protein[r.id] = r.nutrition.protein;
    comparison.comparison.carbs[r.id] = r.nutrition.carbs;
    comparison.comparison.rating[r.id] = r.rating.value;
    comparison.comparison.servings[r.id] = r.servings;
    comparison.comparison.ingredientCount[r.id] = r.ingredients.length;
  });

  return comparison;
}
