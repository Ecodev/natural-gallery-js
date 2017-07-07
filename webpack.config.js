const webpack = require('webpack');
const path = require('path');
const BabiliPlugin = require("babili-webpack-plugin"); // uglifier for typescript
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = function(env) {

    const prod = process.env.NODE_ENV === 'production';
    const dependencies = !(env && env.nodependencies === true);
    const name = 'natural-gallery';

    const extractCSS = new ExtractTextPlugin("themes/natural.css");
    const extractSASS = new ExtractTextPlugin(name + ".[name].css");

    let externals = {};
    if (!dependencies) {
        externals = {
            'photoswipe': 'PhotoSwipe',
            'photoswipe/dist/photoswipe-ui-default': 'PhotoSwipeUI_Default'
        }
    }

    let plugins = [
        extractCSS,
        extractSASS,
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /natural-gallery\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: {removeAll: prod},
                sourceMap: !prod
            },
            canPrint: true
        })
    ];

    if (prod) {
        plugins.push(new BabiliPlugin());
    }

    const entry = {};
    let entryName = 'light';
    if (dependencies) {
        entryName = 'full';
    }
    entry[entryName] = './app/app.' + entryName + '.ts';

    return {
        entry: entry,
        output: {
            path: __dirname + '/dist',
            filename: name + '.[name].js',
            library: "NaturalGallery",
            libraryTarget: 'umd',
            umdNamedDefine: true
        },

        devtool: prod ? false : "source-map",

        resolve: {
            extensions: [".ts", ".js"],
        },

        plugins: plugins,

        module: {
            rules: [
                {
                    test: /\.ts?$/,
                    loader: "awesome-typescript-loader"
                }, {
                    enforce: "pre",
                    test: /\.js$/,
                    loader: "source-map-loader"
                }, {
                    test: /\.css$/,
                    loader: extractCSS.extract(['css-loader']),
                }, {
                    test: /\.scss$/,
                    loader: extractSASS.extract({
                        fallback: 'style-loader',
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: !prod,
                                }
                            }, {
                                loader: 'postcss-loader',
                                options: {sourceMap: 'inline'}
                            }, {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: !prod,
                                    sourceMapContents: !prod,
                                    outputStyle: prod ? 'compressed' : 'expanded'
                                }
                            }
                        ]
                    })
                }, {
                    test: /\.(gif|png|jpe?g|svg)$/i,
                    loaders: [
                        {
                            loader : 'file-loader',
                            options: {
                                name: 'images/[name].[ext]'
                            }
                        },
                        {
                            loader: 'image-webpack-loader',
                            query: {
                                progressive: true,
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

        // When importing a module whose path matches one of the following, just
        // assume a corresponding global variable exists and use that instead.
        // This is important because it allows us to avoid bundling all of our
        // dependencies, which allows browsers to cache those libraries between builds.
        externals: externals

    }
};
