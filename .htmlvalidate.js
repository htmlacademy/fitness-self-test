module.exports = {
  extends: [
    "html-validate:recommended",
    "html-validate:standard",
    "html-validate:a11y",
    "html-validate:document",
  ],
  rules: {
    "require-sri": "off",
    "tel-non-breaking": "off",
    "no-style-tag": "error",
    "no-unknown-elements": "error",
    "heading-level": ["error", {
      "allowMultipleH1": false,
      "minInitialRank": "h1",
    }]
  },
};
