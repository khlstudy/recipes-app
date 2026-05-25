import type { ValidationRules } from "../../types/validation";
import { VALIDATION_ERRORS, VALIDATION_PATTERNS } from "./constants";

export const createProfileValidationRules = (): ValidationRules => {
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
  };
};
