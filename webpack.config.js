const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const OverwolfPlugin = require('./overwolf.webpack')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = env => {
	return {
		target: 'web',
		entry: {
			background: './src/background/background.tsx',
			desktop: './src/desktop/desktop.tsx',
			settings: './src/settings/settings.tsx'
		},
		devtool: env['removeSourceMap'] ? false : 'inline-source-map',
		module: {
			rules: [
				{
					test: /\.(ts|js)x?$/,
					use: 'ts-loader',
					exclude: /node_modules/
				},
				// {
				// 	loader: 'dts-css-modules-loader',
				// 	options: {
				// 		namedExport: true
				// 	}
				// },
				{
					test: /\.css$/i,
					use: ['style-loader', 'css-loader']
				},
				{
					test: /\.(png|jpe?g|ttf|webp|svg)$/,
					type: 'asset'
				}
			]
		},
		resolve: {
			extensions: ['.ts', '.js', '.tsx', 'jsx'],
			plugins: [new TsconfigPathsPlugin({configFile: './tsconfig.json'})]
		},
		output: {
			path: path.resolve(__dirname, 'dist/'),
			filename: 'js/[name].bundle.js',
			clean: true,
			environment: {
				module: true
			},
			assetModuleFilename: 'assets/[hash][ext][query]'
		},
		optimization: {
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						format: {
							comments: false
						}
					},
					extractComments: false
				})
			]
		},
		performance: {
			maxAssetSize: 51200000,
			maxEntrypointSize: 51200000
		},
		plugins: [
			new CopyPlugin({
				patterns: [
					{from: 'public/OWassets', to: './OWassets'},
					{from: 'public/manifest.json', to: './manifest.json'}
				]
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
				template: './src/settings/settings.html',
				filename: path.resolve(__dirname, './dist/settings.html'),
				chunks: ['settings']
			}),
			new OverwolfPlugin(env)
		]
	}
}
