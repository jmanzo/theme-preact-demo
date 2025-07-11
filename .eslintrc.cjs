/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  root: true,
  extends: [
    'airbnb',
    'airbnb/hooks',
    'airbnb-typescript',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    'prettier',
  ],
  plugins: ['react', '@typescript-eslint', 'import'],
  parserOptions: {
    ecmaVersion: 'latest',
    project: ['tsconfig.json'],
  },
  globals: {
    shopify: 'readonly',
  },
  rules: {
    'react/react-in-jsx-scope': 0,
    'react/prop-types': 'off',
    '@typescript-eslint/no-floating-promises': 'error',
    'no-nested-ternary': 'off',
    'react/require-default-props': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-throw-literal': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    'max-len': [
      'error',
      {
        code: 118,
        ignoreUrls: true,
        ignoreComments: true,
        ignorePattern: '^import\\s.+\\sfrom\\s.+;$',
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'react/forbid-elements': [
      1,
      {
        forbid: [
          {
            element: 'ui-title-bar',
            message: 'use the <TitleBar> component from @shopify/app-bridge-react instead.',
          },
          {
            element: 'ui-modal',
            message: 'use <Modal> from @shopify/app-bridge-react instead.',
          },
        ],
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@shopify/react-form',
            importNames: ['useSubmit'],
            message: 'Use useSubmit from @remix-run/react instead.',
          },
          {
            name: '@shopify/polaris',
            importNames: ['Form'],
            message: 'Use Form from @remix-run/react instead.',
          },
          {
            name: '@remix-run/react',
            importNames: ['redirect'],
            message: "Use `redirect` from Shopify's authenticate instead (See Gotcha's in README).",
          },
          {
            name: '@remix-run/node',
            importNames: ['redirect'],
            message: "Use `redirect` from Shopify's authenticate instead (See Gotcha's in README).",
          },
          {
            name: '@shopify/shopify-api/runtime',
            importNames: ['crypto'],
            message: 'We use the native crypto from either Node or the browser. Do not import `crypto`.',
          },
        ],
      },
    ],
    'react/no-unknown-property': ['warn', { ignore: ['variant', 'tone'] }],
    'jsx-a11y/control-has-associated-label': ['warn', { ignoreElements: ['button'] }],
    'jsx-a11y/aria-role': ['warn', { allowedInvalidRoles: ['button-app-bridge'] }],
  },
};
