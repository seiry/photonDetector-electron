module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  // extends: 'standard',
  "extends": [
    'standard',
    'plugin:vue/essential',
    "plugin:prettier/recommended"
  ],
  globals: {
    __static: true
  },
  plugins: [
    // 'prettier',
    // 'html',
    'vue'
  ],
  'rules': {
    "prettier/prettier": "error",
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  }
}
