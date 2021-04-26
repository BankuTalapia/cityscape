const path = require("path");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        app: './src/main.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devtool: 'source-map',
    mode: 'development',
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {from: './src/index.html'},
                {from: './assets/exported/**/*', to: './assets/[name][ext]'}
            ]
        })
    ],
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: [{
                loader: 'ts-loader',
                options: {
                    configFile: path.resolve(__dirname, "tsconfig.json").split(path.sep).join(path.posix.sep)
                }
            }],
            exclude: /node_modules/
        }]
    }
}
