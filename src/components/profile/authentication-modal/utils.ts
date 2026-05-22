import chefIcon from "../../../assets/images/icons/recipe-card-icons.svg";

import type { TabItem } from "../../common/tabs/types";
import type { ValidationRules } from "../../../types/validation";
import type { AuthFieldSchema, AuthFormValues, AuthTab } from "./types";
import { AUTH_TAB } from "./types";
import { VALIDATION_CAPTIONS } from "../../../utils/validation/constants";
import { createLoginValidationRules } from "../../../utils/validation/loginRules";
import { createSignupValidationRules } from "../../../utils/validation/signupRules";

export const AUTH_HERO_ICON = `${chefIcon}#chef`;

const NAME_FIELD: AuthFieldSchema = {
  key: "name",
  label: "Name",
  type: "text",
  placeholder: "Jane Cook",
  autoComplete: "name",
  caption: VALIDATION_CAPTIONS.NAME,
};

const EMAIL_FIELD: AuthFieldSchema = {
  key: "email",
  label: "Email",
  type: "email",
  placeholder: "you@recipeapp.com",
  autoComplete: "email",
  caption: VALIDATION_CAPTIONS.EMAIL,
};

const PASSWORD_FIELD: AuthFieldSchema = {
  key: "password",
  label: "Password",
  type: "password",
  placeholder: "Enter your password",
  autoComplete: "current-password",
  caption: VALIDATION_CAPTIONS.PASSWORD,
};

export const AUTH_FIELDS: Record<AuthTab, AuthFieldSchema[]> = {
  [AUTH_TAB.LOGIN]: [EMAIL_FIELD, PASSWORD_FIELD],
  [AUTH_TAB.SIGNUP]: [
    NAME_FIELD,
    EMAIL_FIELD,
    { ...PASSWORD_FIELD, autoComplete: "new-password" },
  ],
};

export const AUTH_RULES: Record<AuthTab, ValidationRules> = {
  [AUTH_TAB.LOGIN]: createLoginValidationRules(),
  [AUTH_TAB.SIGNUP]: createSignupValidationRules(),
};

export const AUTH_TABS: TabItem[] = [
  { key: AUTH_TAB.LOGIN, label: "Login" },
  { key: AUTH_TAB.SIGNUP, label: "Sign Up" },
];

export const AUTH_COPY: Record<AuthTab, { title: string; subtitle: string }> = {
  [AUTH_TAB.LOGIN]: {
    title: "Welcome back",
    subtitle: "Sign in to reach your saved recipes.",
  },
  [AUTH_TAB.SIGNUP]: {
    title: "Join the kitchen",
    subtitle: "Create an account to start cooking.",
  },
};

export const EMPTY_FORM: AuthFormValues = {
  name: "",
  email: "",
  password: "",
};
