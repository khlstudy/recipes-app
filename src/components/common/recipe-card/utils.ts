import iconsSprite from "../../../assets/images/icons/recipe-card-icons.svg";
import type { Recipe } from "../../../types/index";

export const ICONS_PATH = `${iconsSprite}#`;

export const RECIPE_ICON_IDS = {
  heart: "heart",
  heartNeutral: "heart-neutral",
  scales: "scales",
  clock: "clock",
  star: "star",
  easy: "easy",
  medium: "medium",
  hard: "hard",
  edit: "edit",
  delete: "delete",
  check: "check",
  salad: "salad",
  list: "list",
  chef: "chef",
  whiteHeart: "white-heart",
  whiteHeartNeutral: "white-neutral-heart",
  add: "add",
} as const;

export type RecipeIconId =
  (typeof RECIPE_ICON_IDS)[keyof typeof RECIPE_ICON_IDS];

export const DIFFICULTY_ICON: Record<Recipe["difficulty"], RecipeIconId> = {
  easy: RECIPE_ICON_IDS.easy,
  medium: RECIPE_ICON_IDS.medium,
  hard: RECIPE_ICON_IDS.hard,
};

export const MAX_VISIBLE_TAGS = 3;
