module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
      project: "./tsconfig.json",
      sourceType: "module",
    },
    plugins: ["@typescript-eslint", "import"],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:import/recommended",
      "prettier", // disables conflicting rules
    ],
    rules: {
      "import/order": [
        "warn",
        {
          groups: [["builtin", "external"], "internal"],
          "newlines-between": "always",
        },
      ],
      "@typescript-eslint/no-unused-vars": ["warn"],
    },
  };