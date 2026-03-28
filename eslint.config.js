import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import solid from "eslint-plugin-solid/configs/typescript";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    ...solid,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      ...solid.plugins,
    },
    rules: {
      "no-undef": "off",
      ...tsPlugin.configs.recommended.rules,
      ...solid.rules,
    },
  },
  {
    ignores: ["node_modules/", "dist/"],
  },
];
