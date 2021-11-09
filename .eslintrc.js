module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
    '@vue/typescript/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: 'vue-eslint-parser',
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/no-mutating-props': 0,
    'vue/no-setup-props-destructure': 0,
    '@typescript-eslint/ban-ts-comment': 'off',
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
}
