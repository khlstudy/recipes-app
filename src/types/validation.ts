export type FieldValues = Record<string, string>;

export type FieldErrors = Record<string, string>;

export interface ValidationRule {
  message: string;
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  matchField?: string;
}

export type ValidationRules = Record<string, ValidationRule[]>;
