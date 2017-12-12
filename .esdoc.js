module.exports = {
	source: '.',
	destination: './docs',
	includes: ['^sdk\\.js$'],
	index: './README.md',
	plugins: [
		{
			name: 'esdoc-standard-plugin',
			option: {
				accessor: { access: ['public'] },
				brand: {
					repository: 'https://github.com/viswiz-io/viswiz-nodejs-sdk',
					site: 'https://www.viswiz.io',
					title: 'VisWiz.io SDK',
				},
				coverage: { enable: false },
				manual: {
					files: ['./manual/usage.md', './CHANGELOG.md'],
				},
			},
		},
		{
			name: 'esdoc-importpath-plugin',
			option: {
				stripPackageName: false,
				replaces: [{ from: 'viswiz-nodejs-sdk/', to: '' }],
			},
		},
	],
};
