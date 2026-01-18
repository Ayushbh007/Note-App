import js from "@eslint/js";
import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import prettier from "eslint-config-prettier";

export default [
  {
    ignores: [".svelte-kit/**"],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs["flat/recommended"],
  prettier,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        browser: true,
        node: true,
      },
    },
  },
  {
    files: ["*.svelte"],
    languageOptions: {
      parser: svelteParser,
      ecmaVersion: 2020,
      sourceType: "module",
      parserOptions: {
        parser: ts.parser,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
