module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    "plugin:vue/vue3-recommended",
    "prettier",
    "prettier/vue",
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/no-mutating-props': 0
  },
  parserOptions: {
    parser: "babel-eslint"
  },
}
