var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './js-src/index.js',
    output: {
        filename: 'scripts.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        alias: {
            jquery: './node_modules/jquery/src/jquery'
        }
    },
    // plugins: [
    //     new webpack.ProvidePlugin({
    //         $: "node_modules/jquery/src/jquery",
    //         jQuery: "node_modules/jquery/src/jquery"
    //     })
    // ]
};