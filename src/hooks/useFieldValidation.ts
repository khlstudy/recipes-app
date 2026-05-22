import { useState } from "react";

import type {
  FieldValues,
  FieldErrors,
  ValidationRules,
} from "../types/validation";
import { validateField } from "../utils/validation/validator";

export const useFieldValidation = (validationRules: ValidationRules) => {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setFieldError = (field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateFields = (values: FieldValues): boolean => {
    const newErrors: FieldErrors = {};

    Object.entries(validationRules).forEach(([field, rules]) => {
      const error = validateField(values[field] ?? "", rules, values);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSingleField = (
    field: string,
    value: string,
    allValues?: FieldValues
  ): string => {
    const rules = validationRules[field];
    if (!rules) return "";

    const error = validateField(value, rules, allValues);
    setFieldError(field, error);
    return error;
  };

  const clearError = (field: string) => {
    setErrors(({ [field]: _, ...rest }) => rest);
  };

  const clearAllErrors = () => {
    setErrors({});
    setTouched({});
  };

  const setFieldTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return {
    errors,
    touched,
    validateFields,
    validateSingleField,
    clearError,
    clearAllErrors,
    setFieldTouched,
  };
};
