const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'build');

module.exports = {
    entry: './src/index.js',
    devtool: 'source-map',
    output: {
        path: 'bin',
        filename: 'gown.min.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    },
    plugins: [
        // Minify the bundle
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            // suppresses warnings, usually from module minification
            warnings: false,
          },
        }),
    ]
};