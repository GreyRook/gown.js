const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'build');

module.exports = {
    entry: './src/index.js',
    devtool: 'source-map',
    output: {
        path: 'bin',
        filename: 'gown.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    },
    plugins: [
    ]
};