const rules = {
    // the following rules are enabled
    'no-bitwise': 'warn',
    'guard-for-in': 'warn',
    'no-new': 'warn',
    'no-unsafe-finally': 'error',
    'one-var': ['error', 'never'],
    'no-eval': 'error',
    'no-new-wrappers': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'prettier/prettier': 'error',
    'no-unused-vars': 'error',

    // the following rules are disabled
    'no-restricted-globals': 'off',
    'no-useless-escape': 'off',
    'no-unused-expressions': 'off',
    'no-throw-literal': 'off',
    'no-useless-concat': 'off',
    'no-use-before-define': 'off',
    'default-case': 'off',
    'no-unreachable': 'off',
    'no-fallthrough': 'off',
    'prefer-rest-params': 'off',
    'prefer-spread': 'off',
    'prefer-const': 'off',
    'no-script-url': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/role-has-required-aria-props': 'off',
    'array-callback-return': 'off',
    'require-yield': 'off',
    'react/jsx-no-target-blank': 'off',
    'no-template-curly-in-string': 'off',
    'no-redeclare': 'off',
    'jsx-a11y/alt-text': 'off',
    'no-empty-pattern': 'off',
    'jsx-a11y/anchor-has-content': 'off',
    'no-shadow-restricted-names': 'off',
    'no-sparse-arrays': 'off',
    'no-useless-constructor': 'off',
    'import/first': 'off',
    strict: 'off',
    'no-extra-bind': 'off',
};

const tsRules = {
    // the following rules are enabled
    '@typescript-eslint/array-type': [
        'error',
        {
            default: 'array-simple',
        },
    ],
    'object-shorthand': 'error',
    '@typescript-eslint/no-unused-vars': 'error',

    // the following rules are disabled
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-useless-constructor': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/adjacent-overload-signatures': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',

    // the following rules should be moved to the global rules object
    'prefer-const': 'error',
};

module.exports = {
    env: {
        browser: true,
        worker: true,
        commonjs: true,
        es2020: true,
        node: true,
    },
    parser: 'babel-eslint',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
            experimentalObjectRestSpread: true,
        },
        sourceType: 'module',
    },
    rules,
    overrides: [
        {
            files: ['js/**/*.ts', 'js/**/*.tsx', 'stories/**/*.ts', 'stories/**/*.tsx'],
            extends: [
                'react-app',
                'plugin:@typescript-eslint/recommended',
                'prettier/@typescript-eslint',
                'plugin:prettier/recommended',
            ],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                project: './tsconfig.json',
                sourceType: 'module',
            },
            rules: { ...rules, ...tsRules },
        },
    ],
};
