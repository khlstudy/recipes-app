import type { CreateRecipeRequest } from "../../../api/types";
import type { Recipe } from "../../../types";
import type {
  BasicFieldSchema,
  DifficultyOption,
  IngredientDraft,
  NumberFieldSchema,
  NutritionFieldSchema,
  RecipeFormState,
  StepDraft,
  StepKey,
} from "./types";

import { DESCRIPTION_MAX_LENGTH } from "./types";
import type { StatusPillTone } from "../../common/status-pill/types";

export const BASIC_FIELDS: BasicFieldSchema[] = [
  {
    key: "title",
    label: "Recipe name",
    placeholder: "e.g. Creamy Tomato Pasta",
    caption: "Shown as the recipe title across the catalog",
    minLength: 3,
    maxLength: 56,
  },
  {
    key: "description",
    label: "Description",
    placeholder: "A short, appetizing summary of the dish.",
    caption: "1–2 sentences that hook the reader",
    multiline: true,
    minLength: 10,
    maxLength: DESCRIPTION_MAX_LENGTH,
  },
  {
    key: "imageUrl",
    label: "Image URL",
    placeholder: "https://...",
    caption: "Direct link to a hero image (jpg, png, webp)",
    minLength: 10,
    maxLength: 500,
  },
];

export const NUMBER_FIELDS: NumberFieldSchema[] = [
  {
    key: "cookingTime",
    label: "Cooking time",
    placeholder: "30",
    unit: "min",
    maxLength: 5,
  },
  {
    key: "servings",
    label: "Number of servings",
    placeholder: "4",
    unit: "servings",
    maxLength: 3,
  },
];

export const NUTRITION_FIELDS: NutritionFieldSchema[] = [
  { key: "calories", label: "Calories", unit: "kcal", maxLength: 5 },
  { key: "protein", label: "Protein", unit: "g", maxLength: 4 },
  { key: "carbs", label: "Carbohydrates", unit: "g", maxLength: 4 },
  { key: "fat", label: "Fat", unit: "g", maxLength: 4 },
];

export const limitNumericLength = (value: string, maxLength: number): string =>
  value.replace(/[^0-9.]/g, "").slice(0, maxLength);

const normalizeText = (text: string): string => text.toLowerCase().trim();

const filterByInclusion = (
  pool: string[],
  query: string,
  excludeSet?: Set<string>,
  limit = 8
): string[] => {
  const q = normalizeText(query);
  const seen = new Set<string>();

  return pool
    .filter((item) => {
      const lower = item.toLowerCase();
      if (seen.has(lower) || excludeSet?.has(lower) || lower === q)
        return false;
      seen.add(lower);
      return lower.includes(q);
    })
    .slice(0, limit);
};

export const matchUnitSuggestions = (
  pool: string[],
  query: string,
  limit = 8
): string[] => filterByInclusion(pool, query, undefined, limit);

export const matchIngredientSuggestions = (
  pool: string[],
  selectedNames: string[],
  query: string,
  limit = 8
): string[] => {
  const q = normalizeText(query);
  if (!q) return [];

  const taken = new Set(selectedNames.map(normalizeText).filter(Boolean));
  return filterByInclusion(pool, query, taken, limit);
};

const draftId = (prefix: string): string =>
  `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export const createIngredientDraft = (): IngredientDraft => ({
  id: draftId("ing"),
  name: "",
  amount: "",
  unit: "",
});

export const createStepDraft = (): StepDraft => ({
  id: draftId("step"),
  text: "",
});

const mapRecipeIngredients = (
  ingredients: Recipe["ingredients"]
): IngredientDraft[] =>
  ingredients.length
    ? ingredients.map((ing) => ({
        id: draftId("ing"),
        name: ing.name,
        amount: String(ing.amount ?? ""),
        unit: ing.unit,
      }))
    : [createIngredientDraft()];

const mapRecipeSteps = (steps: Recipe["steps"]): StepDraft[] =>
  steps.length
    ? steps.map((step) => ({ id: draftId("step"), text: step.text }))
    : [createStepDraft()];

export const recipeToFormState = (recipe: Recipe): RecipeFormState => ({
  title: recipe.title,
  description: recipe.description,
  cookingTime: String(recipe.cookingTime ?? ""),
  servings: String(recipe.servings ?? ""),
  difficulty: (recipe.difficulty ?? null) as DifficultyOption | null,
  imageUrl: recipe.imageUrl,
  ingredients: mapRecipeIngredients(recipe.ingredients),
  steps: mapRecipeSteps(recipe.steps),
  calories: String(recipe.nutrition.calories ?? ""),
  protein: String(recipe.nutrition.protein ?? ""),
  carbs: String(recipe.nutrition.carbs ?? ""),
  fat: String(recipe.nutrition.fat ?? ""),
  tags: [...recipe.tags],
  diet: [...(recipe.diet ?? [])],
});

export const EMPTY_RECIPE_FORM: RecipeFormState = {
  title: "",
  description: "",
  cookingTime: "",
  servings: "",
  difficulty: null,
  imageUrl: "",
  ingredients: [createIngredientDraft()],
  steps: [createStepDraft()],
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
  tags: [],
  diet: [],
};

const toNumber = (value: string): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const validateRecipeForm = (form: RecipeFormState): string | null => {
  if (!isBasicComplete(form)) return "Complete the basic information section.";

  const ingredientStarted = (ing: {
    name: string;
    amount: string;
    unit: string;
  }) => Boolean(ing.name.trim() || ing.amount.trim() || ing.unit.trim());
  const ingredientComplete = (ing: {
    name: string;
    amount: string;
    unit: string;
  }) =>
    Boolean(ing.name.trim()) &&
    toNumber(ing.amount) > 0 &&
    Boolean(ing.unit.trim());
  const partial = form.ingredients.find(
    (ing) => ingredientStarted(ing) && !ingredientComplete(ing)
  );
  if (partial)
    return "Finish or clear partially filled ingredient rows before publishing.";
  const hasFullIngredient = form.ingredients.some(ingredientComplete);
  if (!hasFullIngredient) return "Add at least one ingredient.";

  if (!isStepsComplete(form)) return "Add at least one cooking step.";

  if (!isNutritionComplete(form)) return "Complete the nutrition section.";

  if (!isTagsComplete(form)) return "Add at least one tag.";

  return null;
};

export const buildRecipeRequest = (
  form: RecipeFormState
): CreateRecipeRequest => ({
  title: form.title.trim(),
  description: form.description.trim(),
  imageUrl: form.imageUrl.trim() || "https://placehold.co/600x400?text=Recipe",
  cookingTime: toNumber(form.cookingTime),
  servings: toNumber(form.servings),
  difficulty: form.difficulty ?? "easy",
  ingredients: form.ingredients
    .filter(
      (ing) => ing.name.trim() && toNumber(ing.amount) > 0 && ing.unit.trim()
    )
    .map((ing) => ({
      name: ing.name.trim(),
      amount: toNumber(ing.amount),
      unit: ing.unit.trim(),
    })),
  steps: form.steps
    .filter((step) => step.text.trim())
    .map((step) => ({ text: step.text.trim() })),
  nutrition: {
    calories: toNumber(form.calories),
    protein: toNumber(form.protein),
    carbs: toNumber(form.carbs),
    fat: toNumber(form.fat),
  },
  tags: form.tags,
  diet: form.diet,
});

export const ingredientRowFilledCount = (ing: IngredientDraft): number =>
  (ing.name.trim() ? 1 : 0) +
  (ing.amount.trim() ? 1 : 0) +
  (ing.unit.trim() ? 1 : 0);

export const ingredientFullyFilled = (ing: IngredientDraft): boolean =>
  ing.name.trim().length > 0 &&
  Number(ing.amount) > 0 &&
  ing.unit.trim().length > 0;

export const ingredientFullyEmpty = (ing: IngredientDraft): boolean =>
  ingredientRowFilledCount(ing) === 0;

export const stepLabel = (
  key: StepKey,
  complete: boolean,
  filledIngredientCount: number,
  filledStepCount: number,
  tagsLength: number,
  dietLength: number
): string => {
  switch (key) {
    case "basic":
    case "nutrition":
      return complete ? "Done" : "In progress";
    case "ingredients":
      return `${filledIngredientCount} ${
        filledIngredientCount === 1 ? "ingredient" : "ingredients"
      }`;
    case "steps":
      return `${filledStepCount} ${filledStepCount === 1 ? "step" : "steps"}`;
    case "tags":
      return `${tagsLength} ${tagsLength === 1 ? "tag" : "tags"}`;
    case "diet":
      return `${dietLength} ${dietLength === 1 ? "diet" : "diets"}`;
  }
};

export const stepStatus = (
  key: StepKey,
  sectionStarted: Record<StepKey, boolean>,
  focusedStep: StepKey | null,
  complete: boolean,
  filledIngredientCount: number,
  filledStepCount: number,
  tagsLength: number,
  dietLength: number
): { tone: StatusPillTone; label: string; visible: boolean } => {
  const visible = sectionStarted[key] || focusedStep === key;
  return {
    tone: "in-progress",
    label: stepLabel(
      key,
      complete,
      filledIngredientCount,
      filledStepCount,
      tagsLength,
      dietLength
    ),
    visible,
  };
};

const isBasicComplete = (form: RecipeFormState): boolean =>
  form.title.trim().length > 0 &&
  form.description.trim().length > 0 &&
  form.imageUrl.trim().length > 0 &&
  Number(form.cookingTime) > 0 &&
  Number(form.servings) > 0 &&
  form.difficulty !== null;

const isIngredientsComplete = (
  hasFullIngredient: boolean,
  hasPartialIngredient: boolean
): boolean => hasFullIngredient && !hasPartialIngredient;

const isStepsComplete = (form: RecipeFormState): boolean =>
  form.steps.some((step) => step.text.trim().length > 0);

const isNutritionComplete = (form: RecipeFormState): boolean =>
  Number(form.calories) > 0 &&
  Number(form.protein) > 0 &&
  Number(form.carbs) > 0 &&
  Number(form.fat) > 0;

const isTagsComplete = (form: RecipeFormState): boolean => form.tags.length > 0;

const isDietComplete = (form: RecipeFormState): boolean => form.diet.length > 0;

export const buildSectionComplete = (
  form: RecipeFormState,
  hasFullIngredient: boolean,
  hasPartialIngredient: boolean
): Record<StepKey, boolean> => ({
  basic: isBasicComplete(form),
  ingredients: isIngredientsComplete(hasFullIngredient, hasPartialIngredient),
  steps: isStepsComplete(form),
  nutrition: isNutritionComplete(form),
  tags: isTagsComplete(form),
  diet: isDietComplete(form),
});

const isBasicStarted = (form: RecipeFormState): boolean =>
  form.title.trim().length > 0 ||
  form.description.trim().length > 0 ||
  form.imageUrl.trim().length > 0 ||
  form.cookingTime.trim().length > 0 ||
  form.servings.trim().length > 0 ||
  form.difficulty !== null;

const isIngredientsStarted = (form: RecipeFormState): boolean =>
  form.ingredients.some(
    (ing) =>
      ing.name.trim().length > 0 ||
      ing.amount.trim().length > 0 ||
      ing.unit.trim().length > 0
  );

const isStepsStarted = (form: RecipeFormState): boolean =>
  form.steps.some((step) => step.text.trim().length > 0);

const isNutritionStarted = (form: RecipeFormState): boolean =>
  form.calories.trim().length > 0 ||
  form.protein.trim().length > 0 ||
  form.carbs.trim().length > 0 ||
  form.fat.trim().length > 0;

const isTagsStarted = (form: RecipeFormState): boolean => form.tags.length > 0;

const isDietStarted = (form: RecipeFormState): boolean => form.diet.length > 0;

export const buildSectionStarted = (
  form: RecipeFormState
): Record<StepKey, boolean> => ({
  basic: isBasicStarted(form),
  ingredients: isIngredientsStarted(form),
  steps: isStepsStarted(form),
  nutrition: isNutritionStarted(form),
  tags: isTagsStarted(form),
  diet: isDietStarted(form),
});

export const getFilledCounts = (
  form: RecipeFormState
): { filledIngredientCount: number; filledStepCount: number } => ({
  filledIngredientCount: form.ingredients.filter(ingredientFullyFilled).length,
  filledStepCount: form.steps.filter((step) => step.text.trim().length > 0)
    .length,
});

export const updateFieldInForm = <K extends keyof RecipeFormState>(
  form: RecipeFormState,
  key: K,
  value: RecipeFormState[K]
): RecipeFormState => ({ ...form, [key]: value });

export const updateIngredientInForm = (
  form: RecipeFormState,
  id: string,
  key: keyof Omit<IngredientDraft, "id">,
  value: string
): RecipeFormState => ({
  ...form,
  ingredients: form.ingredients.map((ing) =>
    ing.id === id ? { ...ing, [key]: value } : ing
  ),
});

export const updateStepInForm = (
  form: RecipeFormState,
  id: string,
  value: string
): RecipeFormState => ({
  ...form,
  steps: form.steps.map((step) =>
    step.id === id ? { ...step, text: value } : step
  ),
});

export const addIngredientToForm = (
  form: RecipeFormState
): RecipeFormState => ({
  ...form,
  ingredients: [...form.ingredients, createIngredientDraft()],
});

export const removeIngredientFromForm = (
  form: RecipeFormState,
  id: string
): RecipeFormState => {
  if (form.ingredients.length > 1) {
    return {
      ...form,
      ingredients: form.ingredients.filter((ing) => ing.id !== id),
    };
  }
  return {
    ...form,
    ingredients: form.ingredients.map((ing) =>
      ing.id === id ? { ...ing, name: "", amount: "", unit: "" } : ing
    ),
  };
};

export const addStepToForm = (form: RecipeFormState): RecipeFormState => ({
  ...form,
  steps: [...form.steps, createStepDraft()],
});

export const removeStepFromForm = (
  form: RecipeFormState,
  id: string
): RecipeFormState => {
  if (form.steps.length > 1) {
    return {
      ...form,
      steps: form.steps.filter((step) => step.id !== id),
    };
  }
  return {
    ...form,
    steps: form.steps.map((step) =>
      step.id === id ? { ...step, text: "" } : step
    ),
  };
};

export const addChipToForm = (
  form: RecipeFormState,
  key: "tags" | "diet",
  value: string
): RecipeFormState | null => {
  const normalized = value.trim().toLowerCase();
  if (!normalized || form[key].includes(normalized)) return null;
  return updateFieldInForm(form, key, [...form[key], normalized]);
};

export const removeChipFromForm = (
  form: RecipeFormState,
  key: "tags" | "diet",
  value: string
): RecipeFormState =>
  updateFieldInForm(
    form,
    key,
    form[key].filter((item) => item !== value)
  );
