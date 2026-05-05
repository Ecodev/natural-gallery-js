import {defineConfig} from 'vitest/config';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    test: {
        name: 'UNIT',
        include: ['tests/unit/**/*.spec.ts'],
        setupFiles: ['tests/unit/vitest.setup.ts'],
        environment: 'jsdom',
        coverage: {
            provider: 'v8',
            include: ['src/**/*.ts'],
            exclude: ['**/*.d.ts'],
            reporter: ['text'],
            reportsDirectory: 'tests/logs/coverage',
            thresholds: {
                statements: 98,
                branches: 94,
                functions: 96,
                lines: 99,
            },
        },
    },
    resolve: {
        alias: [
            {
                find: /^photoswipe\/lightbox$/,
                replacement: path.resolve(rootDir, 'node_modules/photoswipe/dist/photoswipe-lightbox.esm.js'),
            },
            {
                find: /^.+\.(css|scss)$/,
                replacement: path.resolve(rootDir, 'tests/unit/style.stub.ts'),
            },
        ],
    },
});
