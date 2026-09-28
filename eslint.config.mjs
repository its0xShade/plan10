import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // قانون سخت‌گیرانهٔ React Compiler. الگوهای باقی‌مانده رفتار صحیح دارند
      // (هیدریشن localStorage در useStore، اینترنال shadcn، گذار تایمر) و
      // بازنویسی‌شان ریسک ریگرسیون دارد — هشدار بمانند، نه خطا.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
