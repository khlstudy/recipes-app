import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettierPlugin from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "build", "deploy-templates"]),
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier: prettierPlugin,
      "@typescript-eslint": typescriptPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        RequestInit: true,
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      // Prettier
      ...prettierPlugin.configs.recommended.rules,
      ...configPrettier.rules,
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          singleQuote: false,
          semi: true,
        },
      ],

      // TypeScript
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",

      // General JavaScript
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      // no-undef disabled for TypeScript files (TypeScript handles this)
      "no-undef": "off",

      // React
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-boolean-value": "error",
      "react/self-closing-comp": "error",
      "react/jsx-curly-brace-presence": ["error", "never"],
      "react/no-unknown-property": "error",

      // General      semi: ["error", "always"],      quotes: ['error', 'double', { avoidEscape: true }],
      "linebreak-style": "off",
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
]);
