import {defineConfig} from 'tsdown';
import {sassPlugin} from 'esbuild-sass-plugin';
import copyPlugin from '@sprout2000/esbuild-copy-plugin';

const isDoc = process.env.DOCS;
const outDir = isDoc ? 'docs/assets/natural-gallery-js' : 'dist';
const dts = !isDoc && !process.env.JEST;

export default defineConfig({
    entry: {'natural-gallery': 'src/index.ts'},
    sourcemap: true,
    clean: true,
    outDir: outDir,
    format: 'esm',
    minify: true,
    platform: 'neutral',
    dts: dts,
    plugins: [
        sassPlugin(),
        copyPlugin.copyPlugin({
            src: 'package.json',
            dest: `${outDir}/package.json`,
        }),
    ],
    deps: {
        onlyBundle: ['es-toolkit', 'photoswipe'],
    },
    target: false,
    css: {
        // Change 'style.css' to your custom name
        fileName: 'natural-gallery.css',
    },
});
