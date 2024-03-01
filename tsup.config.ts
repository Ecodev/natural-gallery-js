import {defineConfig} from 'tsup';
import {sassPlugin} from 'esbuild-sass-plugin';
import copyPlugin from '@sprout2000/esbuild-copy-plugin';

const isDoc = process.env.DOCS;
const outDir = isDoc ? 'docs/assets/natural-gallery-js' : 'dist';
const dts = !isDoc && !process.env.JEST;

export default defineConfig({
    entry: {'natural-gallery': 'src/index.ts'},
    splitting: false,
    sourcemap: true,
    clean: true,
    outDir: outDir,
    format: 'esm',
    platform: 'neutral',
    dts: dts,
    esbuildOptions(options) {
        options.minify = false;
        options.platform = 'browser';
    },
    esbuildPlugins: [
        sassPlugin(),
        copyPlugin.copyPlugin({
            src: 'package.json',
            dest: `${outDir}/package.json`,
        }),
        copyPlugin.copyPlugin({
            src: 'src/styles/themes',
            dest: `${outDir}/themes/`,
        }),
    ]
});
