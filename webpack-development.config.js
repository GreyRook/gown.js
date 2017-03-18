var path = require('path');

module.exports = {
    entry: './src/index.js',
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'docs', 'dist'),
        filename: 'gown.js'
    }
};
