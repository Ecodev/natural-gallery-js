module.exports = {
    displayName: 'UNIT',
    preset: 'ts-jest',
    testMatch: ['<rootDir>/tests/unit/**/*.spec.ts'],
    setupFilesAfterEnv: ['<rootDir>/tests/unit/jest.setup.ts'],
    testEnvironment: 'jsdom',
    collectCoverage: true,
    coverageDirectory: 'tests/logs/coverage',
    coverageReporters: ['text', 'html', 'lcov'],
    coverageThreshold: {
        global: {
            statements: 98.98,
            branches: 93.14,
            functions: 97.31,
            lines: 99.47
        }
    },
    transform: {'^.+\\.js?$': require.resolve('babel-jest')},
    transformIgnorePatterns: ['/node_modules/(?!(photoswipe)/)'],
    moduleNameMapper: {
        '^.+\\.(css|scss)$': 'jest-transform-stub',
        'photoswipe/lightbox': '<rootDir>/node_modules/photoswipe/dist/photoswipe-lightbox.esm.js',
    },
};
