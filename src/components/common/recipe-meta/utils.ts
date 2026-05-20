import type { Recipe } from "../../../types/index";
import { RECIPE_ICON_IDS, DIFFICULTY_ICON } from "../recipe-card/utils";
import type { MetaItem } from "./types";

export const getMetaItems = (recipe: Recipe): MetaItem[] => [
  {
    key: "time",
    iconId: RECIPE_ICON_IDS.clock,
    value: `${recipe.cookingTime} min`,
  },
  {
    key: "difficulty",
    iconId: DIFFICULTY_ICON[recipe.difficulty],
    value: recipe.difficulty,
  },
  {
    key: "rating",
    iconId: RECIPE_ICON_IDS.star,
    value: recipe.rating.value.toFixed(1),
  },
];
