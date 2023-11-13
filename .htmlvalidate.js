module.exports = {
  extends: [
    "html-validate:recommended",
    "html-validate:standard",
    "html-validate:a11y",
    "html-validate:document",
  ],
  rules: {
    "no-style-tag": "error",
    "no-unknown-elements": "error",
  },
};
