const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const { defineConfig } = require("eslint/config");

const config = defineConfig([
    {
        ignores: ["dist/**/*", "**/*.d.ts", "eslint.config.js", "tsup.config.ts"],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["src/**/*"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: "./tsconfig.json",
                sourceType: "module",
            },
        },

        rules: {
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
        },
    },
]);

module.exports = config;
