export default {
    customSyntax: "postcss-scss",
    extends: [
        "stylelint-config-standard-scss",
        "stylelint-config-tailwindcss",
        "stylelint-config-sass-guidelines",
        "stylelint-config-idiomatic-order",
    ],
    plugins: ["stylelint-scss", "stylelint-order"],
    rules: {
        "declaration-property-value-no-unknown": true,
        "selector-max-id": null,
        "color-no-invalid-hex": true,
        "order/properties-alphabetical-order": null,
        "max-nesting-depth": 5,
        "selector-max-compound-selectors": 5,
        "selector-no-qualifying-type": null,
        "scss/double-slash-comment-empty-line-before": [
            "always",
            {
                "ignore": [
                    "between-comments",
                    "stylelint-commands",
                    "inside-block"
                ]
            }
        ],
    },
    ignoreFiles: [
        "**/vendor/*.css",
        "**/vendor/**/*.css",
        "**/vendor/*.scss",
        "**/vendor/**/*.scss",
        "**/vendor/*.sass",
        "**/vendor/**/*.sass",
        "**/vendor/*.less",
        "**/vendor/**/*.less",
    ],
};
