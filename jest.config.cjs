module.exports = {
    displayName: 'UNIT',
    preset: 'ts-jest',
    testMatch: ['<rootDir>/tests/unit/**/*.spec.ts'],
    setupFilesAfterEnv: ['<rootDir>/tests/unit/jest.setup.ts'],
    testEnvironment: 'jsdom',
    collectCoverage: true,
    coverageDirectory: 'tests/logs/coverage',
    coverageReporters: ['text', 'html', 'lcov'],
    transform: {'^.+\\.js?$': require.resolve('babel-jest')},
    transformIgnorePatterns: ['/node_modules/(?!(photoswipe)/)'],
    moduleNameMapper: {
        '^.+\\.(css|scss)$': 'jest-transform-stub',
        'photoswipe/lightbox': '<rootDir>/node_modules/photoswipe/dist/photoswipe-lightbox.esm.js',
    },
};
