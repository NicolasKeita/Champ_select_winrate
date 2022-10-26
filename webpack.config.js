const
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CopyPlugin = require("copy-webpack-plugin"),
    { CleanWebpackPlugin } = require('clean-webpack-plugin'),
    OverwolfPlugin = require('./overwolf.webpack');

module.exports = env => ({
    entry: {
        background: './src/background/background.tsx',
        desktop: './src/desktop/components/desktop.tsx',
        in_game: './src/in_game/in_game.tsx'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx']
    },
    output: {
      path: path.resolve(__dirname, 'dist/'),
      filename: 'js/[name].js'
    },
    plugins: [
        new CleanWebpackPlugin,
        new CopyPlugin({
            patterns: [ { from: "public", to: "./" } ],
        }),
        new HtmlWebpackPlugin({
            template: './src/background/background.html',
            filename: path.resolve(__dirname, './dist/background.html'),
            chunks: ['background']
        }),
        new HtmlWebpackPlugin({
            template: './src/desktop/components/desktop.html',
            filename: path.resolve(__dirname, './dist/desktop.html'),
            chunks: ['desktop']
        }),
        new HtmlWebpackPlugin({
            template: './src/in_game/in_game.html',
            filename: path.resolve(__dirname, './dist/in_game.html'),
            chunks: ['in_game']
        }),
        new OverwolfPlugin(env)
    ]
})
