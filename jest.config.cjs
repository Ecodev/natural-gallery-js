module.exports = {
    displayName: 'UNIT',
    preset: 'ts-jest',
    testMatch: ['<rootDir>/tests/unit/**/*.spec.ts'],
    testEnvironment: 'jsdom',
    collectCoverage: true,
    coverageDirectory: 'tests/logs/coverage',
    coverageReporters: ['text', 'html', 'lcov'],
    moduleNameMapper: {
        '^.+\\.(css|scss)$': 'jest-transform-stub',
        '^.*photoswipe.*$': 'jest-transform-stub',
    },
};
