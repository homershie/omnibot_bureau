import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import prettier from "eslint-plugin-prettier";

// Flat config 用法： plugins 是陣列（非物件！）
export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.node,
    },
    plugins: [js, prettier], // ✅ plugins 要是陣列
    rules: {
      ...js.configs.recommended.rules,
      "prettier/prettier": "error", // 將 Prettier 規則當成 ESLint 錯誤
    },
  },
]);
