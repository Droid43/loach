module.exports = function (api) {
	const { BABEL_MODULE, NODE_ENV } = process.env;
	const useESModules = BABEL_MODULE !== 'commonjs' && NODE_ENV !== 'test';

	api && api.cache(false);

	return {
		presets: [
			['@babel/preset-env', { modules: false}],
			'@babel/preset-typescript'
		],
		plugins: [
			["@babel/plugin-proposal-decorators", { "legacy": true }],
			"@babel/plugin-proposal-class-properties",
		]
	};
};
