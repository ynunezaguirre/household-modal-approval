const fs = require('fs');

const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'),
);
module.exports = {
  extends: ['react-app', 'prettier', 'plugin:storybook/recommended'],
  plugins: ['prettier', 'react-hooks'],
  rules: {
    'prettier/prettier': ['error'],
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: {
        'prettier/prettier': ['error', prettierOptions],
      },
    },
  ],
};
