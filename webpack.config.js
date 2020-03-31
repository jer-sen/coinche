const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');


module.exports = (env, argv) => {
	const isDev = argv.$0.endsWith('webpack-dev-server.js');
	// eslint-disable-next-line no-console
	console.log("MODE DEV : " + isDev);
	return {
		devServer: {
			contentBase: path.join(__dirname, 'frontdist'),
			compress: true,
			port: 9000,
		},
		
		mode: isDev ? 'development' : 'production',

		// Enable sourcemaps for debugging webpack's output.
		devtool: "source-map",

		entry: './frontsrc/index.tsx',
		output: {
			path: path.resolve(__dirname, 'frontdist'),
			filename: 'main.js',
		},
		
		resolve: {
			// Add '.ts' and '.tsx' as resolvable extensions.
			extensions: [".ts", ".tsx", '.js', '.jsx'],
		},

		plugins: [
			new HtmlWebpackPlugin({
				title: "Ptite coinche",
				template: './index.html',
			}),
			new CopyPlugin([
				{ from: './node_modules/react/umd/react.' + (isDev ? 'development' : 'production.min') + '.js', to: 'react.js' },
				{ from: './node_modules/react-dom/umd/react-dom.' + (isDev ? 'development' : 'production.min') + '.js', to: 'react-dom.js' },
				{ from: './cards/*.png', to: '[name].[ext]' },
			]),
		],

		module: {
			rules: [
				{
					test: /\.ts(x?)$/u,
					exclude: /node_modules/u,
					use: [
						{
							loader: "ts-loader",
							options: {
								configFile: '../tsconfigFront.json',
							},
						},
					],
				},
				// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
				{
					enforce: "pre",
					test: /\.js$/u,
					loader: "source-map-loader",
				},
			],
		},

		// Importés directement pour éviter d'allourdir la compilation
		externals: {
			"react": "React",
			"react-dom": "ReactDOM",
		},
	};
};
