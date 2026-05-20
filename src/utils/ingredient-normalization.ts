// --- Ingredient Normalization (data cleaning for set-based similarity) ---
// Jaccard / overlap coefficient are defined over SETS. If "eggs" and "egg"
// are treated as distinct elements, |A ∩ B| is undercounted and the metric
// lies. Normalization is a precondition for the scientific methods, not a
// cosmetic step.

// Modifier adjectives that do not change the canonical ingredient identity.
const MODIFIERS = [
  "fresh",
  "dried",
  "frozen",
  "canned",
  "ground",
  "chopped",
  "crushed",
  "minced",
  "sliced",
  "grated",
  "shredded",
  "warm",
  "cold",
  "whole",
  "raw",
  "cooked",
  "boneless",
  "skinless",
  "ripe",
  "large",
  "small",
  "medium",
  "extra virgin",
  "unsalted",
  "salted",
];

// Irregular plural -> singular forms not covered by the trailing-"s" rule.
const IRREGULAR_PLURALS: Record<string, string> = {
  potatoes: "potato",
  tomatoes: "tomato",
  leaves: "leaf",
  loaves: "loaf",
  berries: "berry",
};

// Canonical name -> known synonyms. Derived from the seed data plus common
// English culinary synonyms. as const -> the keys form a closed set.
export const INGREDIENT_ALIASES = {
  egg: ["eggs"],
  tomato: ["tomatoes", "cherry tomato", "cherry tomatoes"],
  "olive oil": ["evoo", "extra virgin olive oil"],
  "green onion": [
    "green onions",
    "scallion",
    "scallions",
    "spring onion",
    "spring onions",
  ],
  cilantro: ["coriander", "fresh cilantro", "fresh cilantro or parsley"],
  parsley: ["fresh parsley", "italian parsley", "flat-leaf parsley"],
  dill: ["fresh dill"],
  eggplant: ["aubergine"],
  zucchini: ["courgette"],
  chickpea: ["chickpeas", "garbanzo bean", "garbanzo beans"],
  "bell pepper": ["bell peppers", "capsicum", "sweet pepper"],
  "red bell pepper": ["red bell peppers", "red pepper", "red peppers"],
  "green bell pepper": ["green bell peppers"],
  flour: ["all-purpose flour", "plain flour", "white flour"],
  sugar: ["white sugar", "granulated sugar", "caster sugar"],
  shrimp: ["prawn", "prawns", "shrimps"],
  "ground beef": ["ground beef (80/20)", "minced beef", "beef mince"],
  "ground chicken": ["chicken mince", "minced chicken"],
  "chicken thigh": ["chicken thighs"],
  "salmon fillet": ["salmon fillets"],
  carrot: ["carrots"],
  beet: ["beets", "beetroot"],
  pickle: ["pickles", "gherkin", "gherkins"],
  "burger bun": ["burger buns", "hamburger bun", "hamburger buns"],
  "canned tomato": [
    "canned tomatoes",
    "canned crushed tomatoes",
    "crushed tomatoes",
  ],
  "tomato paste": ["tomato puree", "tomato concentrate"],
  parmesan: ["parmigiano", "parmigiano reggiano", "parmesan cheese"],
  "soy sauce": ["shoyu"],
} as const;

export type CanonicalIngredient = keyof typeof INGREDIENT_ALIASES;

// Reverse lookup: any synonym (already cleaned) -> canonical name.
const ALIAS_TO_CANONICAL: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const [canonical, aliases] of Object.entries(INGREDIENT_ALIASES)) {
    map[canonical] = canonical;
    for (const alias of aliases) map[alias] = canonical;
  }
  return map;
})();

function stripModifiers(value: string): string {
  let result = value;
  for (const modifier of MODIFIERS) {
    result = result.replace(new RegExp(`\\b${modifier}\\b`, "g"), " ");
  }
  return result.replace(/\s+/g, " ").trim();
}

function singularize(value: string): string {
  if (IRREGULAR_PLURALS[value]) return IRREGULAR_PLURALS[value];
  if (value.endsWith("ies") && value.length > 4)
    return `${value.slice(0, -3)}y`;
  if (value.endsWith("es") && value.length > 3) return value.slice(0, -2);
  if (value.endsWith("s") && !value.endsWith("ss") && value.length > 3)
    return value.slice(0, -1);
  return value;
}

export function normalizeIngredient(raw: string): string {
  let cleaned = raw
    .toLowerCase()
    .trim()
    .replace(/\([^)]*\)/g, " ") // drop parenthetical notes, e.g. "(80/20)"
    .replace(/[^a-z\s/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Variant lists ("guanciale or pancetta") collapse to the first option.
  if (cleaned.includes(" or ")) cleaned = cleaned.split(" or ")[0].trim();

  // Try the raw cleaned form against the alias table first - multi-word
  // synonyms like "canned crushed tomatoes" must match before modifiers
  // and plurals are stripped.
  if (ALIAS_TO_CANONICAL[cleaned]) return ALIAS_TO_CANONICAL[cleaned];

  cleaned = stripModifiers(cleaned);
  if (ALIAS_TO_CANONICAL[cleaned]) return ALIAS_TO_CANONICAL[cleaned];

  const singular = cleaned
    .split(" ")
    .map((word) => singularize(word))
    .join(" ");
  if (ALIAS_TO_CANONICAL[singular]) return ALIAS_TO_CANONICAL[singular];

  return singular;
}

export function ingredientsMatch(a: string, b: string): boolean {
  return normalizeIngredient(a) === normalizeIngredient(b);
}
