import type { FieldValues, ValidationRule } from "../../types/validation";

function isRuleViolated(
  value: string,
  rule: ValidationRule,
  allValues?: FieldValues
): boolean {
  const trimmed = value.trim();

  if (rule.required && !trimmed) return true;

  if (!trimmed) return false;

  if (rule.minLength !== undefined && value.length < rule.minLength) {
    return true;
  }

  if (rule.maxLength !== undefined && value.length > rule.maxLength) {
    return true;
  }

  if (rule.pattern && !rule.pattern.test(value)) return true;

  if (rule.matchField && value !== (allValues?.[rule.matchField] ?? "")) {
    return true;
  }

  return false;
}

export function validateField(
  value: string,
  rules: ValidationRule[],
  allValues?: FieldValues
): string {
  for (const rule of rules) {
    if (isRuleViolated(value, rule, allValues)) {
      return rule.message;
    }
  }

  return "";
}
