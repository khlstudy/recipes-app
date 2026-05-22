import type { ValidationRules } from "../../types/validation";
import { VALIDATION_ERRORS, VALIDATION_PATTERNS } from "./constants";

export const createSignupValidationRules = (): ValidationRules => {
  return {
    name: [
      { required: true, message: VALIDATION_ERRORS.NAME_REQUIRED },
      {
        pattern: VALIDATION_PATTERNS.NAME_LETTERS_ONLY,
        message: VALIDATION_ERRORS.NAME_INVALID,
      },
    ],
    email: [
      { required: true, message: VALIDATION_ERRORS.EMAIL_REQUIRED },
      {
        pattern: VALIDATION_PATTERNS.EMAIL,
        message: VALIDATION_ERRORS.EMAIL_INVALID,
      },
    ],
    password: [
      { required: true, message: VALIDATION_ERRORS.PASSWORD_REQUIRED },
      {
        pattern: VALIDATION_PATTERNS.PASSWORD_NO_SPACES,
        message: VALIDATION_ERRORS.PASSWORD_NO_SPACES,
      },
      { minLength: 6, message: VALIDATION_ERRORS.PASSWORD_TOO_SHORT },
    ],
  };
};
