// https://gist.github.com/wldcordeiro/6dc2eb97a26a52d548ed4aa86f2fc5c0

// Required because of https://github.com/smooth-code/jest-puppeteer/issues/303
var process = require('node:process');
process.env.JEST_PUPPETEER_CONFIG = 'jest-puppeteer.config.cjs';

module.exports = {
    projects: [
        {
            displayName: 'E2E',

            testEnvironment: 'node',
            globals: {
                PATH: 'http://localhost:4444',
            },
            testMatch: ['<rootDir>/testing/e2e/**/*.spec.js'],
            globalSetup: '<rootDir>/testing/globalSetup.cjs',
            globalTeardown: '<rootDir>/testing/globalTeardown.cjs',
        },
        {
            displayName: 'UNIT',
            preset: 'ts-jest',
            testMatch: ['<rootDir>/testing/unit/**/*.spec.ts'],
            testEnvironment: 'jsdom',
            // Required (alongside babel.config.cjs) because of https://github.com/facebook/jest/issues/6229
            transform: {'^.+\\.js?$': require.resolve('babel-jest')},
            transformIgnorePatterns: ['/node_modules/(?!(photoswipe)/)'],
            moduleNameMapper: {
                '^.+\\.(css|scss)$': '<rootDir>/testing/mocks/styleMock.js',
                '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
                    '<rootDir>/testing/mocks/fileMocks.js',
                '^lodash-es$': 'lodash',
                // Required (probably) because of https://github.com/facebook/jest/issues/9771
                // Fixed (so this workaround should be no longer needed) in Jest v28.0.0-alpha.3
                'photoswipe/lightbox': '<rootDir>/node_modules/photoswipe/dist/photoswipe-lightbox.esm.js',
            },
        },
    ],
};
