module.exports = {
	'env': {
		'browser': true,
		'es2021': true,
		'node': true
	},
	'extends': [
		'eslint:recommended'
	],
	'parserOptions': {
		'ecmaFeatures': {
			'jsx': true
		},
		'ecmaVersion': 12,
		'sourceType': 'module'
	},
	overrides: [
		// This configuration will apply only to TypeScript files
		{
			files: ['**/*.ts', '**/*.tsx'],
			parser: '@typescript-eslint/parser',
			settings: { react: { version: 'detect' } },
			env: {
				browser: true,
				node: true,
				es2021: true
			},
			extends: [
				'eslint:recommended',
				'plugin:@typescript-eslint/recommended', // TypeScript rules
				'plugin:react/recommended', // React rules
				'plugin:react-hooks/recommended', // React hooks rules
				'plugin:jsx-a11y/recommended' // Accessibility rules
			],
			rules: {
				'react/prop-types': 'off', // We will use TypeScript's types for component props instead
				'react/react-in-jsx-scope': 'off', // No need to import React when using Next.js
				'jsx-a11y/anchor-is-valid': 'off', // This rule is not compatible with Next.js's <Link /> components
				'@typescript-eslint/no-unused-vars': ['error'], // Why would you want unused vars?
				'@typescript-eslint/explicit-function-return-type': [ // I suggest this setting for requiring return types on functions only where usefull
					'warn',
					{
						allowExpressions: true,
						allowConciseArrowFunctionExpressionsStartingWithVoid: true
					}
				]
			}
		}
	],
	'rules': {
		'no-empty': ['error', { 'allowEmptyCatch': true }],
		// 'no-mixed-spaces-and-tabs': 'off',
		// 'no-unused-vars': 'warn',
		// 'react/prop-types': 'off',
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': ['error', (process.platform === 'win32' ? 'windows' : 'unix')],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		],
		'comma-dangle': ['error', 'never'],
		'no-console': ['error',
			{
				'allow': ['log', 'warn', 'error']
			}
		]
	}
};
