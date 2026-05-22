import type { ValidationRules } from "../../types/validation";
import { VALIDATION_ERRORS, VALIDATION_PATTERNS } from "./constants";

export const createLoginValidationRules = (): ValidationRules => {
  return {
    email: [
      { required: true, message: VALIDATION_ERRORS.EMAIL_REQUIRED },
      {
        pattern: VALIDATION_PATTERNS.EMAIL,
        message: VALIDATION_ERRORS.EMAIL_INVALID,
      },
    ],
    password: [
      { required: true, message: VALIDATION_ERRORS.PASSWORD_REQUIRED },
    ],
  };
};
