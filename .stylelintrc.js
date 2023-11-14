module.exports = {
  extends: [
    "stylelint-config-sass-guidelines",
    "stylelint-config-standard-scss",
    "stylelint-config-htmlacademy",
  ],
  plugins: ["stylelint-selector-bem-pattern"],
  rules: {
    "plugin/selector-bem-pattern": {
      preset: "bem",
      implicitComponents: "blocks/*.scss",
      implicitUtilities: "global/utils.scss",
    },
    "selector-class-pattern": [
      "^[a-z]([-]?[a-z0-9]+)*(__[a-z0-9]([-]?[a-z0-9]+)*)?(--[a-z0-9]([-]?[a-z0-9]+)*)?$",
      {
        resolveNestedSelectors: true,
        message: function expected(selectorValue) {
          return `Expected class selector "${selectorValue}" to match BEM CSS pattern https://en.bem.info/methodology/css. Selector validation tool: https://regexr.com/3apms`;
        },
      },
    ],
    "selector-max-id": 0,
    "selector-disallowed-list": [
      "/^&_/",
      "/^&-(?:\\w)/",
      "/^&\\s*[>+~]?\\s*\\.?\\w/",
    ],
    "alpha-value-notation": null,
    "scss/at-import-no-partial-leading-underscore": null,
    "scss/load-no-partial-leading-underscore": true,
    "declaration-block-no-redundant-longhand-properties": null,
    "max-nesting-depth": 3,
    "declaration-property-value-disallowed-list": null,
  },
};
