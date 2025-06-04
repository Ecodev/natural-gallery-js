const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const globals = require("globals");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: './',
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    languageOptions: {
        parser: tsParser,
    },

    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    extends: compat.extends("eslint:recommended"),

    rules: {
        semi: "error",
        "quote-props": ["error", "as-needed"],

        "no-restricted-globals": [
            "error",
            "atob",
            "bota",
            "document",
            "event",
            "history",
            "length",
            "localStorage",
            "location",
            "name",
            "navigator",
            "sessionStorage",
            "window",
        ],
    },
}, globalIgnores(["docs/", "dist/"]), {
    files: ["**/*.ts"],
    extends: compat.extends("plugin:@typescript-eslint/recommended"),
}, {
    files: ["**/*.js"],

    languageOptions: {
        globals: {
            ...globals.node,
        },
    },
}, {
    files: ["**/*.spec.js", "**/*.spec.ts"],

    languageOptions: {
        globals: {
            ...globals.jest,
            ...globals.browser,
            page: "readonly",
            PATH: "readonly",
            NaturalGallery: "readonly",
            images: "readonly",
        },
    },

    rules: {
        "no-restricted-globals": ["off"],
    },
}]);
