module.exports = {
  'env': {
    'browser': true,
    'es6': true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript'
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'parser': '@typescript-eslint/parser'
  },
  'plugins': [
    'vue',
    '@typescript-eslint'
  ],
  'rules': {
    'indent': ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'typescript-eslint/ban-ts-ignore': 'off',
    'no-lone-blocks': 'off',
    'no-new': 'off'
  }
}