import {PlaywrightTestConfig} from '@playwright/test';

const viewport = {width: 960, height: 800};

const config: PlaywrightTestConfig = {
    testDir: './tests/e2e',
    outputDir: './tests/logs/',
    fullyParallel: true,
    use: {
        baseURL: 'http://localhost:4000',
        trace: 'on-all-retries',
        screenshot: 'only-on-failure',
        viewport,
        video: {size: viewport, mode: 'retain-on-failure'},
    },
};

export default config;
