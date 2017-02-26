var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: './src/index.js',
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'gown.min.js'
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
