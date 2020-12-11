module.exports = {
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-underscore-dangle':
    ['error', { allow: ['_id'] }],
    'no-console': 'off',
  },
};
