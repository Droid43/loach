const config            = require('./webpack.base');
const merge             = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path              = require('path');
const IPAddress         = getIPAddress();
const port              = 9999;

function getIPAddress() {
	let interfaces = require('os').networkInterfaces();
	for (let devName in interfaces) {
		let iface = interfaces[devName];
		for (let i = 0; i < iface.length; i++) {
			let alias = iface[i];
			if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
				return alias.address;
			}
		}
	}
}

console.log(`http://${IPAddress}:${port}`);
module.exports = merge(config, {
	entry    : './example/src/index.ts',
	devtool  : 'cheap-module-eval-source-map',
	devServer: {
		// open: true,
		progress: true,
		host    : '0.0.0.0',
		stats   : 'errors-only',
		port    : port,
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
