

const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');

const resovlePath = function(dir) {
    return path.resolve(__dirname, dir)
}

module.exports = {
    mode: 'development',
    entry: resovlePath('./src/index.js'),
    output: {
        path: resovlePath('dist'),
        filename: 'bundle.js'
    },
    devServer: {
        port: 3000,
        open: true
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
            }
          }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: resovlePath('./public/index.html')
        })
    ]
}