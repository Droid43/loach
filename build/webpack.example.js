const config            = require('./webpack.base');
const merge             = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path              = require('path');

module.exports = merge(config, {
	entry    : './example/src/index.ts',
	devtool  : 'cheap-module-eval-source-map',
	devServer: {
		// open: true,
		progress: true,
		host    : '0.0.0.0',
		stats   : 'errors-only',
		port    : 9999,
	},
	output   : {
		path    : path.resolve(__dirname, '../release/example'),
		filename: 'js/[name].[chunkhash].js',
	},
	plugins  : [new HtmlWebpackPlugin({
		filename: 'index.html',
		template: 'example/index.html',
	})],
});
