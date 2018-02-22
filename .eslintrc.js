module.exports = {
	env: {
		es6: true,
		node: true,
		jest: true,
	},
	extends: 'eslint:recommended',
	parserOptions: {
		ecmaVersion: 8,
		sourceType: 'module',
	},
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		'no-else-return': ['error'],
		quotes: ['error', 'single'],
		'prefer-arrow-callback': ['error'],
		'prefer-const': ['error'],
		semi: ['error', 'always'],
	},
};
