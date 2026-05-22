export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_NO_SPACES: /^\S+$/,
  NAME_LETTERS_ONLY: /^[\p{L}][\p{L}\s'-]*$/u,
} as const;

export const VALIDATION_ERRORS = {
  NAME_REQUIRED: "Name is required.",
  NAME_INVALID: "Use letters only.",

  EMAIL_REQUIRED: "Email is required.",
  EMAIL_INVALID: "Enter a valid email.",

  PASSWORD_REQUIRED: "Password is required.",
  PASSWORD_TOO_SHORT: "Use at least 6 characters.",
  PASSWORD_NO_SPACES: "No spaces allowed.",
} as const;

export const VALIDATION_CAPTIONS = {
  NAME: "Letters only",
  EMAIL: "E.g. name@domain.com",
  PASSWORD: "At least 6 characters",
} as const;

export type ValidationErrorKey = keyof typeof VALIDATION_ERRORS;
