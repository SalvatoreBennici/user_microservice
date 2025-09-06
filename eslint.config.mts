import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import {defineConfig} from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: {js},
        extends: ["js/recommended"],
        languageOptions: {globals: globals.browser}
    },
    {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    {
        rules: {
            "no-undef": "off",       // Turns off the undefined variable checks
            "indent": ["warn", 4],   // Enforces consistent indentation of 4 spaces
            "semi": ["warn", "always"], // Requires semicolons at the end of statements
            "quotes": ["warn", "double"], // Enforces the use of double quotes for strings
            "space-before-function-paren": ["warn", "always"], // Requires a space before function parentheses
            "camelcase": ["warn", { properties: "always" }], // Enforces camelCase for variable and property names
        }
    }
]);