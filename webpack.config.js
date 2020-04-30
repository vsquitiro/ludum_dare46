const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: path.resolve(__dirname, 'script/main.ts'),
    mode: 'development',
    output: {
        pathinfo: true,
        path: path.resolve(__dirname, 'dist'),
        publicPath: './dist/',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: ['node_modules'],
    },
    watch: true,
    plugins: [
        new webpack.DefinePlugin({
            CANVAS_RENDERER: JSON.stringify(true),
            WEBGL_RENDERER: JSON.stringify(true)
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: { cacheDirectory: true },
                    },
                    {
                        loader: 'eslint-loader'
                    },
                ],
                include: path.join(__dirname, 'script')
            },
            {
                test: /\.tsx?$/,
                include: path.join(__dirname, 'script'),
                use: [
                    {
                        loader: 'babel-loader',
                        options: { cacheDirectory: true },
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
            },
            {
                test: /\.(gif|png|jpe?g|svg|xml|wav|mp3)$/i,
                use: "file-loader"
            },
            {
                type: 'javascript/auto',
                test: /\.json$/,
                use: [
                    {
                      loader: 'file-loader'
                    }
                ]
            }
        ]
    }
}