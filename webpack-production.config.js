var webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    devtool: 'source-map',
    output: {
        path: 'dist',
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
