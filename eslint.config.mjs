import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactCompiler from "eslint-plugin-react-compiler";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

export default [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "**/vendor/*.js",
      "**/vendor/**/*.js",
      "**/vendor/*.jsx",
      "**/vendor/**/*.jsx",
      "**/vendor/*.ts",
      "**/vendor/**/*.ts",
      "**/vendor/*.tsx",
      "**/vendor/**/*.tsx",
      "components/ui/**/*.tsx",
    ],
  },
  js.configs.recommended,
  ...tsPlugin.configs["flat/recommended"],
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react": reactPlugin,
      "react-hooks": reactHooks,
      "react-compiler": reactCompiler,
      "jsx-a11y": jsxA11y,
      "import": importPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    settings: {
      react: {
        version: "19",
      },
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts"],
        },
        alias: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".scss", ".d.ts"],
          map: [
            ["~", "./resources/assets"],
            ["@", "./node_modules"],
          ],
        },
      },
    },
    rules: {
      "indent": ["error", 2, { SwitchCase: 1 }],
      "linebreak-style": ["error", "unix"],
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",
      "react/jsx-no-target-blank": ["error", { enforceDynamicLinks: "always" }],
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-undef": "error",
      "react/jsx-pascal-case": "error",
      "react/no-danger": "warn",
      "react/no-deprecated": "error",
      "react/no-direct-mutation-state": "error",
      "react/no-unknown-property": "error",
      "react/self-closing-comp": "error",
      "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],
      "react/jsx-boolean-value": ["error", "never"],
      "react/jsx-fragments": ["error", "syntax"],
      "react/no-object-type-as-default-prop": "error",
      "react/jsx-no-leaked-render": ["error", {
        validStrategies: ["ternary", "coerce"],
      }],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-compiler/react-compiler": "error",
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-has-content": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-role": "error",
      "jsx-a11y/interactive-supports-focus": "error",
      "jsx-a11y/no-autofocus": "warn",
      "jsx-a11y/no-redundant-roles": "error",
      "import/no-duplicates": "error",
      "import/no-cycle": "warn",
      "import/order": ["error", {
        groups: [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling", "index"],
          "type",
        ],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      }],
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "no-undef": "off",
    },
  },
];
