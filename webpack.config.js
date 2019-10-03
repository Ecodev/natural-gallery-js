const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const dest = process.argv.indexOf('--docs') > -1 ? 'docs/assets/natural-gallery-js' : 'dist';

module.exports = {
    mode: 'production',
    devtool: "source-map",
    output: {
        path: path.join(__dirname, dest),
        library: "NaturalGallery",
        filename: 'natural-gallery.js',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolveLoader: {modules: [path.join(__dirname, 'node_modules')]},
    resolve: {
        extensions: [".ts", ".js"],
    },
    externals: {
        'photoswipe': {
            commonjs: 'photoswipe',
            commonjs2: 'photoswipe',
            amd: 'photoswipe',
            root: 'PhotoSwipe'
        },
        'photoswipe/dist/photoswipe-ui-default': {
            commonjs: 'photoswipe/dist/photoswipe-ui-default',
            commonjs2: 'photoswipe/dist/photoswipe-ui-default',
            amd: 'photoswipe/dist/photoswipe-ui-default',
            root: 'PhotoSwipeUI_Default'
        },
    },
    optimization: {
        minimizer: [
            new TerserPlugin({sourceMap: true}),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    map: {
                        inline: false,
                        annotation: true,
                    }
                }
            })
        ],
    },
    plugins: [
        new webpack.WatchIgnorePlugin([/\.d\.ts$/]),
        new MiniCssExtractPlugin({filename: 'natural-gallery.css'}),
        new CopyPlugin([
            {from: 'package.json'},
            {
                from: 'src/styles/themes',
                to: 'themes'
            },
        ])
    ],
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: "awesome-typescript-loader"
            }, {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {sourceMap: true}
                    }, {
                        loader: 'postcss-loader',
                        options: {sourceMap: true}
                    }, {
                        loader: 'sass-loader',
                        options: {sourceMap: true}
                    }
                ]
            }
        ]
    },
};
