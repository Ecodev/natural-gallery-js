const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = function(env, argv) {

    return {
        mode: 'production',
        devtool: "source-map",
        output: {
            path: path.join(__dirname, argv.docs === true ? 'docs/assets/natural-gallery-js' : 'dist'),
            library: "NaturalGallery",
            filename: 'natural-gallery.js',
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        resolveLoader: {modules: [path.join(__dirname, 'node_modules')]},
        resolve: {
            extensions: [".ts", ".js"],
            modules: [path.join(__dirname, 'node_modules')]
        },
        externals: {
            'photoswipe': 'PhotoSwipe',
            'photoswipe/dist/photoswipe-ui-default': 'PhotoSwipeUI_Default'
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
                },
                {
                    test: /\.(gif|png|jpe?g|svg)$/i,
                    loaders: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'images/[name].[ext]'
                            }
                        },
                        {
                            loader: 'image-webpack-loader',
                            query: {
                                mozjpeg: {progressive: true},
                                pngquant: {
                                    quality: '65-90',
                                    speed: 4,
                                    optimizationLevel: 7,
                                    interlaced: false,
                                },
                                gifsicle: {
                                    optimizationLevel: 7,
                                    interlaced: false
                                },
                            }
                        }
                    ]
                }
            ]
        },
    };
};
