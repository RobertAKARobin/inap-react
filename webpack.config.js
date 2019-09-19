const path = require('path')

const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = function(env, argv){
	const isProd = !!(argv.mode === 'production')
	const isNotProd = !(isProd)
	return {
		entry: [
			path.join(__dirname, 'src/js/index.js'),
			path.join(__dirname, 'src/css/index.scss')
		],
		devServer: {
			contentBase: [
				path.join(__dirname, 'dist'),
				path.join(__dirname, 'node_modules')
			],
			hot: false,
			inline: false,
			port: 3000,
			publicPath: '/dist/'
		},
		externals: {
			'react': 'React',
			'react-dom': 'ReactDOM'
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/env'
						]
					}
				},
				{
					test: /\.scss$/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
						},
						{
							loader: 'css-loader'
						},
						{
							loader: 'sass-loader',
							options: {
								sassOptions: {
									outputStyle: (isProd ? 'compressed' : 'expanded')
								}
							}
						}
					]
				}
			]
		},
		optimization: {
			minimizer: (isNotProd ? undefined : [
				new UglifyJsPlugin({
					include: /\.js$/
				})
			])
		},
		output: {
			filename: (isProd ? 'bundle.[hash].js' : 'bundle.js'),
			path: path.resolve(__dirname, 'dist'),
			publicPath: '/dist/'
		},
		plugins: [
			new CleanWebpackPlugin(),
			new HtmlWebpackPlugin({
				alwaysWriteToDisk: true,
				filename: 'index.html',
				inject: 'head',
				minify: (isNotProd ? {} : {
					collapseWhitespace: true,
					removeComments: true
				}),
				template: path.join(__dirname, 'src/index.html')
			}),
			new HtmlWebpackHarddiskPlugin(),
			new MiniCssExtractPlugin({
				filename: (isProd ? '[name].[hash].css' : '[name].css')
			})
		],
		resolve: {
			extensions: [
				'*',
				'.js',
				'.jsx'
			]
		}
	}
}
