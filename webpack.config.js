const path = require("path");

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
