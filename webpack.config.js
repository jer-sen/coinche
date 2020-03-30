const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');


module.exports = (env, argv) => {
	const isDev = argv.$0.endsWith('webpack-dev-server.js');
	console.log("MODE DEV : " + isDev);	
	return {
		devServer: {
			contentBase: path.join(__dirname, 'frontdist'),
			compress: true,
			port: 9000
		},
		
		mode: isDev ? 'development' : 'production',

		// Enable sourcemaps for debugging webpack's output.
		devtool: "source-map",

		entry: './frontsrc/index.tsx',
		output: {
			path: path.resolve(__dirname, 'frontdist'),
			filename: 'main.js'
		},
		
		resolve: {
				// Add '.ts' and '.tsx' as resolvable extensions.
				extensions: [".ts", ".tsx", '.js', '.jsx']
		},

		plugins: [
			new HtmlWebpackPlugin({
				title: "Ptite coinche",
				template: './index.html',
			}),
			new CopyPlugin([
				{ from: './node_modules/react/umd/react.' + (isDev ? 'development' : 'production') + '.js', to: 'react.js' },
				{ from: './node_modules/react-dom/umd/react-dom.' + (isDev ? 'development' : 'production') + '.js', to: 'react-dom.js' },
				{ from: './cards/*.png', to: '[name].[ext]' },
			]),
		],

		module: {
				rules: [
						{
								test: /\.ts(x?)$/,
								exclude: /node_modules/,
								use: [
										{
												loader: "ts-loader",
												options: {
													configFile: '../tsconfigFront.json',
												},
										}
								]
						},
						// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
						{
								enforce: "pre",
								test: /\.js$/,
								loader: "source-map-loader"
						}
				]
		},

		// When importing a module whose path matches one of the following, just
		// assume a corresponding global variable exists and use that instead.
		// This is important because it allows us to avoid bundling all of our
		// dependencies, which allows browsers to cache those libraries between builds.
		externals: {
			"react": "React",
			"react-dom": "ReactDOM"
		},
	};
};