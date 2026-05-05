import {defineConfig} from 'tsdown';

const isDoc = process.env.DOCS;
const outDir = isDoc ? 'docs/assets/natural-gallery-js' : 'dist';
const dts = !isDoc;

export default defineConfig({
    entry: {'natural-gallery': 'src/index.ts'},
    sourcemap: true,
    clean: true,
    outDir: outDir,
    format: 'esm',
    minify: true,
    platform: 'neutral',
    dts: dts,
    copy: 'package.json',
    deps: {
        onlyBundle: ['es-toolkit', 'photoswipe'],
    },
    target: false,
    css: {
        // Change 'style.css' to your custom name
        fileName: 'natural-gallery.css',
    },
});
