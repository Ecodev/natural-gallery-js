import {PlaywrightTestConfig} from '@playwright/test';

const viewport = {width: 960, height: 800};

const config: PlaywrightTestConfig = {
    testDir: './tests/e2e',
    outputDir: './tests/logs/',
    fullyParallel: true,
    workers: 1,
    use: {
        baseURL: 'http://localhost:4000',
        trace: 'on-all-retries',
        screenshot: 'only-on-failure',
        viewport,
        video: {size: viewport, mode: 'retain-on-failure'},
    },
    webServer: {
        command: 'cd docs && bundle exec jekyll serve --port 4000',
        port: 4000,
        reuseExistingServer: !process.env.CI,
    },
};

export default config;
