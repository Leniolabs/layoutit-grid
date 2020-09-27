module.exports = {
  extends: [
    'plugin:vue/vue3-recommended'
  ],
  root: true,
  env: {
    node: true
  },
  // extends: ['plugin:vue/recommended', '@vue/prettier'],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/no-mutating-props': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
