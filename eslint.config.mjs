import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**", 
    "build/**",
    "next-env.d.ts",
    // CI/CD Fix: Ignore build and automation scripts
    "scripts/**",
    "*.js",
    "auto-setup-db.js",
    "execute-schema.js",
    "final-automation.js", 
    "setup-schema.js",
    "test-*.js",
    // Ignore Supabase migration files
    "supabase/**",
    // Ignore configuration files  
    "*.config.js",
    "*.config.mjs",
    "*.config.ts",
    // Ignore deployment files
    "DEPLOYMENT_CHECKLIST.md",
    "vercel.json"
  ]),
]);

export default eslintConfig;