// eslint-disable prettier/prettier
const prettierConfig = require('./.prettierrc.js');

module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: [
        'next/core-web-vitals',
        'plugin:testing-library/react',
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'next/core-web-vitals',
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['react', 'validate-jsx-nesting', "testing-library"],
    rules: {
        // Possible errors
        'no-console': 'off',
        // Best practices
        'dot-notation': 'error',
        'no-else-return': 'error',
        'no-floating-decimal': 'error',
        'no-sequences': 'error',
        // Stylistic
        'array-bracket-spacing': 'error',
        'computed-property-spacing': ['error', 'never'],
        curly: 'error',
        'no-lonely-if': 'error',
        'no-unneeded-ternary': 'error',
        'one-var-declaration-per-line': 'error',
        quotes: [
            'error',
            'single',
            {
                allowTemplateLiterals: false,
                avoidEscape: true,
            },
        ],
        // ES6
        'array-callback-return': 'off',
        'prefer-const': 'error',
        // Imports
        'import/prefer-default-export': 'off',
        'sort-imports': [
            'error',
            {
                ignoreCase: true,
                ignoreDeclarationSort: true,
            },
        ],
        '@typescript-eslint/no-var-requires': 'off',
        'no-unused-expressions': 'off',
        'no-prototype-builtins': 'off',
        // REACT
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'jsx-a11y/href-no-hash': [0],
        'react/display-name': 0,
        'react/no-deprecated': 'error',
        'react/no-unsafe': [
            'error',
            {
                checkAliases: true,
            },
        ],
        'react/jsx-sort-props': [
            'error',
            {
                ignoreCase: true,
            },
        ],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 0,
        // Prettier
        // eslint looks for the prettier config at the top level of the package/app
        // but the config lives in the `config/` directory. Passing the config here
        // to get around this.
        'prettier/prettier': ['error', prettierConfig],
        'validate-jsx-nesting/no-invalid-jsx-nesting': 'error',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
