const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const { defineConfig } = require("eslint/config");

const config = defineConfig([
    {
        ignores: ["node_modules", "build/**/*", "**/*.d.ts", "eslint.config.js", "tsup.config.ts"],
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
                tsconfigRootDir: __dirname,
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
