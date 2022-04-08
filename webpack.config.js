import webpack from 'webpack';
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dest = process.env.DOCS ? 'docs/assets/natural-gallery-js' : 'dist';

const browser = {
    mode: 'production',
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, dest),
        library: {
            name: 'NaturalGallery',
            type: 'umd',
            umdNamedDefine: true,
        },
        filename: 'natural-gallery.js',
        globalObject: 'this', // Use 'this', instead of default 'self', because the same code will run on both browsers and Node.js
    },
    resolveLoader: {modules: [path.join(__dirname, 'node_modules')]},
    resolve: {
        extensions: ['.ts', '.js'],
    },
    externals: {
        photoswipe: {
            commonjs: 'photoswipe',
            commonjs2: 'photoswipe',
            amd: 'photoswipe',
            root: 'PhotoSwipe',
        },
        'photoswipe/dist/photoswipe-ui-default': {
            commonjs: 'photoswipe/dist/photoswipe-ui-default',
            commonjs2: 'photoswipe/dist/photoswipe-ui-default',
            amd: 'photoswipe/dist/photoswipe-ui-default',
            root: 'PhotoSwipeUI_Default',
        },
    },
    optimization: {
        minimizer: [
            new TerserPlugin(),
        ],
    },
    plugins: [
        new webpack.WatchIgnorePlugin({paths: [/\.d\.ts$/]}),
        new MiniCssExtractPlugin({filename: 'natural-gallery.css'}),
        new CopyPlugin({
            patterns: [
                {from: 'package.json'},
                {
                    from: 'src/styles/themes',
                    to: 'themes',
                },
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader',
            }, {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {sourceMap: true},
                    }, {
                        loader: 'postcss-loader',
                        options: {sourceMap: true},
                    }, {
                        loader: 'sass-loader',
                        options: {sourceMap: true},
                    },
                ],
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
};

// Our ESM build is the same as the browser build, with only a few adjustments
const esm = {
    ...browser,
    target: 'node',
    output: {
        path: path.join(__dirname, dest),
        library: {
            type: 'module',
        },
        filename: 'natural-gallery-esm.js',
        chunkFormat: 'module',
    },
    experiments: {
        outputModule: true,
    },

    // Include Photoswipe into our ESM build. This is not ideal, but it is a temporary
    // workaround until Photoswipe 5 is released with native ESM support
    // see: https://github.com/dimsemenov/PhotoSwipe/issues/1749
    externals: {},
};

export default [browser, esm];
