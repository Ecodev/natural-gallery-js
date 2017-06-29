const webpack = require('webpack');
const path = require('path');
const BabiliPlugin = require("babili-webpack-plugin"); // uglifier for typescript
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


module.exports = function(env) {

    const prod = process.env.NODE_ENV === 'production';
    const dependencies = !(env && env.nodependencies === true);

    const extractCSS = new ExtractTextPlugin("themes/natural.css");
    const extractSASS = new ExtractTextPlugin("natural-gallery.css");

    let externals = {};
    if (!dependencies) {
        externals = {
            'photoswipe': 'PhotoSwipe',
            'photoswipe/dist/photoswipe-ui-default': 'PhotoSwipeUI_Default',
        }
    }

    let plugins = [
        extractCSS,
        extractSASS,
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /natural-gallery\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: {removeAll: true},
                sourcemap: true
            },
            canPrint: true
        })
    ];
    
    if (prod) {
        plugins.push(new BabiliPlugin());
    }

    return {
        entry: ['./app/app.ts'],
        output: {
            path: __dirname + '/dist',
            filename: dependencies ? "natural-gallery.js" : "natural-gallery.light.js",
            library: "NaturalGallery",
            libraryTarget: 'umd',
            umdNamedDefine: true
        },

        devtool: prod ? false : "source-map",

        resolve: {
            extensions: [".ts", ".js", ".json"],
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
                                options: {sourceMap: true}
                            },
                            {
                                loader: 'postcss-loader',
                                options: {sourceMap: 'inline'}
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true,
                                    outputStyle: 'expanded',
                                    sourceMapContents: true
                                }
                            }
                        ]
                    })
                },
            ]
        },

        // When importing a module whose path matches one of the following, just
        // assume a corresponding global variable exists and use that instead.
        // This is important because it allows us to avoid bundling all of our
        // dependencies, which allows browsers to cache those libraries between builds.
        externals: externals

    }
};
