module.exports = {
  root: true,
  env: {
    node: true
  },
  // extends: ['plugin:vue/recommended', '@vue/prettier'],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    /* 'vue/max-attributes-per-line': [
      2,
      {
        singleline: 6,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ]*/
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
