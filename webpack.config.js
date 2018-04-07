const webpack = require('webpack');
const path = require('path');
const BabiliPlugin = require("babili-webpack-plugin"); // uglifier for typescript
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const name = 'natural-gallery';

module.exports = function(env) {

    const prod = process.env.NODE_ENV === 'production';
    const dependencies = !(env && env.nodependencies === true);

    let entry = {'app': './app/app.ts'};
    let outName = name;
    if (dependencies) {
        entry = {'full': './app/full.ts'};
        outName = name + '.full';
    }

    const extractCSS = new ExtractTextPlugin("themes/natural.css");
    const extractSASS = new ExtractTextPlugin(outName + ".css");

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
        }),
    ];

    let externals = {};
    if (!dependencies) {
        plugins.push(new DtsBundlePlugin());
        plugins.push(new webpack.WatchIgnorePlugin([
            /\.d\.ts$/
        ]));
        externals = {
            'photoswipe': 'photoswipe',
            'photoswipe/dist/photoswipe-ui-default': 'photoswipe/dist/photoswipe-ui-default'
        }
    }

    if (prod) {
        plugins.push(new BabiliPlugin());
    }

    return {
        entry: entry,
        output: {
            path: path.join(__dirname, 'dist'),
            filename: outName + '.js',
            library: "NaturalGallery",
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        devServer: {
            contentBase: ['sandbox', 'demo'],
            watchContentBase: true,
            port: 1235,
            overlay: true,
        },
        devtool: prod ? false : "source-map", // 'inline-source-map'
        resolveLoader: {
            modules: [
                path.join(__dirname, 'node_modules')
            ]
        },
        resolve: {
            extensions: [".ts", ".js"],
            modules: [
                path.join(__dirname, 'node_modules')
            ]
        },
        plugins: plugins,
        externals: externals,
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
                                    minimize: prod
                                }
                            }, {
                                loader: 'postcss-loader',
                                options: {sourceMap: 'inline'}
                            }, {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: !prod,
                                    sourceMapContents: !prod,
                                    outputStyle: 'expanded'
                                }
                            }
                        ]
                    })
                }, {
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
                                mozjpeg: {
                                    progressive: true,
                                },
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
    }
};

function DtsBundlePlugin(name, main) {
}

DtsBundlePlugin.prototype.apply = function(compiler) {
    compiler.plugin('done', function() {
        var dts = require('dts-bundle');

        dts.bundle({
            name: name,
            main: 'app/app.d.ts',
            out: '../dist/index.d.ts',
            removeSource: false,
            outputAsModuleFolder: true // to use npm in-package typings
        });
    });
};
