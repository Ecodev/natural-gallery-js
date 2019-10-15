// https://gist.github.com/wldcordeiro/6dc2eb97a26a52d548ed4aa86f2fc5c0
module.exports = {
    projects: [
        {
            displayName: 'E2E',
            preset: "jest-puppeteer",
            globals: {
                PATH: "http://localhost:4444"
            },
            testMatch: ['<rootDir>/testing/e2e/**/*.spec.js'],
        },
        {
            displayName: 'UNIT',
            preset: 'ts-jest',
            testMatch: ['<rootDir>/testing/unit/**/*.spec.ts'],
            testEnvironment: 'node',
            moduleNameMapper: {
                "^.+\\.(css|scss)$": "<rootDir>/testing/mocks/styleMock.js",
                "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/testing/mocks/fileMocks.js",
            },
        }
    ]
};
