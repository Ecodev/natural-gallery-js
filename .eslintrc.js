module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    ignorePatterns: [
        '/docs/',
        '/dist/',
    ],
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
    ],
    rules: {
        'semi': 'error',
        // For SSR compatibility
        'no-restricted-globals': [
            'error',
            'document',
            'event',
            'history',
            'length',
            'localStorage',
            'location',
            'name',
            'navigator',
            'sessionStorage',
            'window',
        ],
    },
    overrides: [
        {
            files: ['*.ts'],
            extends: [
                'plugin:@typescript-eslint/recommended',
            ],
        },
        {
            files: ['*.js'],
            env: {
                node: true,
            },
        },
        {
            files: ['*.spec.js', '*.spec.ts'],
            env: {
                jest: true,
                browser: true,
            },
            globals: {
                page: 'readonly',
                PATH: 'readonly',
                NaturalGallery: 'readonly',
                images: 'readonly',
            },
            rules: {
                'no-restricted-globals': [
                    'off',
                ],
            },
        },
    ],
};
