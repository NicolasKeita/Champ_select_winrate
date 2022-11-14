const
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CopyPlugin = require('copy-webpack-plugin'),
    { CleanWebpackPlugin } = require('clean-webpack-plugin'),
    OverwolfPlugin = require('./overwolf.webpack'),
    nodeExternals = require('webpack-node-externals')

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = env => {
    const browserConfig = {
        entry: {
            background: './src/background/background.tsx',
            desktop: './src/desktop/desktop.tsx',
            in_game: './src/in_game/in_game.tsx',
        },
        devtool: 'inline-source-map',
        module: {
            rules: [
                {
                    test: /\.(ts|js)x?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/i,
                    use: [
                        {loader: 'css-loader', options:{url: false}}
                    ],
                    exclude: /node_modules/
                },
                {
                    test: /\.(png|jpe?g|gif|jp2|webp)$/,
                    type: 'asset/resource'
                },
            ]
        },
        resolve: {
            extensions: ['.ts', '.js', '.tsx', 'jsx'],
            plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json'})]
        },
        output: {
            path: path.resolve(__dirname, 'dist/'),
            filename: 'js/[name].js'
        },
        target: 'web',
        plugins: [
            new CleanWebpackPlugin,
            new CopyPlugin({
                patterns: [ { from: 'public', to: './' } ],
            }),
            new HtmlWebpackPlugin({
                template: './src/background/background.html',
                filename: path.resolve(__dirname, './dist/background.html'),
                chunks: ['background']
            }),
            new HtmlWebpackPlugin({
                template: './src/desktop/desktop.html',
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
    }



    return (
        [browserConfig]
    )
}
