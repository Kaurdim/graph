const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, 'dist'),
		publicPath: 'dist/'
	},
	module: {
		rules: [
			{
				test: /\.js/,
				exclude: /node_modules/,
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-env"],
							plugins: ["@babel/plugin-transform-runtime"]
						}
					}
				]
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			}
		]
	},
	devServer: {
		port: 9000
	}
};