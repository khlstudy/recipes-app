import { RECIPE_ICON_IDS } from "../../common/recipe-card/utils";
import { DIFFICULTY_ICON } from "../../common/recipe-card/utils";
import type { MetaItem } from "./types";

export const META_ITEMS: MetaItem[] = [
  {
    key: "cookingTime",
    iconId: RECIPE_ICON_IDS.clock,
    getValue: (r) => `${r.cookingTime} min`,
  },
  {
    key: "difficulty",
    iconId: "__difficulty__",
    getValue: (r) => r.difficulty,
  },
  {
    key: "rating",
    iconId: RECIPE_ICON_IDS.star,
    getValue: (r) => r.rating.value.toFixed(1),
  },
  {
    key: "servings",
    iconId: RECIPE_ICON_IDS.scales,
    getValue: (r) => `${r.servings} servings`,
  },
];

export const resolveIconId = (
  iconId: string,
  difficulty: keyof typeof DIFFICULTY_ICON
): string =>
  iconId === "__difficulty__" ? DIFFICULTY_ICON[difficulty] : iconId;
