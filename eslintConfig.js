/* eslint-env node */

module.exports = {
	extends: [
		'eslint:all',
		'plugin:import/errors',
		'plugin:import/warnings',
	],
	parserOptions: {
		ecmaVersion: 9,
		sourceType: 'module',
		allowImportExportEverywhere: true,
	},
	env: {
		es6: true,
	},
	parser: '@typescript-eslint/parser', // Pour que eslint puisse lire les fichiers TypeScript avec les nouvelles syntaxes ECMAScript
	plugins: [
		'import',
		'babel', // Pour que les règles concernées par les nouvelles syntaxes ECMAScript fonctionnent bien
	],
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx', '.js', '.jsx'],
		},
		'import/resolver': {
			// Use <root>/tsconfig.json
			typescript: {
				alwaysTryTypes: true, // Always try to resolve types under `<root/>@types` directory even it doesn't contain any source code, like `@types/unist`
			},
		},
	},
	reportUnusedDisableDirectives: true,
	rules: {
		// On désactive un paquet de règles qu'on ne veut pas appliquer
		'no-invalid-this': 'off', // Désactivée et remplacée par 'babel/no-invalid-this' qui gère correctement les arrow functions dans les class
		'prefer-named-capture-group': 'off',
		'no-confusing-arrow': 'off',
		'padded-blocks': 'off',
		'no-tabs': 'off',
		'sort-imports': 'off',
		'sort-keys': 'off',
		'curly': 'off',
		'no-ternary': 'off',
		'no-inline-comments': 'off',
		'line-comment-position': 'off',
		'prefer-template': 'off',
		'id-length': 'off',
		'object-property-newline': 'off',
		'no-underscore-dangle': 'off',
		'no-negated-condition': 'off',
		'array-element-newline': 'off',
		'multiline-ternary': 'off',
		'array-bracket-newline': 'off',
		'newline-per-chained-call': 'off',
		'semi-style': 'off',
		'no-undefined': 'off',
		'func-names': 'off',
		'default-case': 'off',
		'comma-style': 'off',
		'no-magic-numbers': 'off',
		'max-params': 'off',
		'no-extra-parens': 'off',
		'no-plusplus': 'off',
		'lines-around-comment': 'off',
		'jsx-quotes': 'off',
		'no-nested-ternary': 'off',
		'wrap-regex': 'off',
		'prefer-destructuring': 'off',
		'quotes': ['off', 'double'],
		'no-return-await': 'off',
		'no-lonely-if': 'off',
		'no-loop-func': 'off',
		'function-paren-newline': 'off',
		'multiline-comment-style': 'off',
		'implicit-arrow-linebreak': 'off',
		'max-classes-per-file': 'off',
		'function-call-argument-newline': 'off',
		'max-statements': 'off',
		'max-lines-per-function': 'off',
		'max-lines': 'off',
		'complexity': 'off',
		'max-depth': 'off',
		'babel/quotes': 'off',
		'prettier/prettier': 'off',
		'object-shorthand': 'off',

		'import/no-duplicates': 'error',
		'import/no-cycle': 'error',
		'import/no-self-import': 'error',


		// Ces règles sont définitivement intéressantes en warnings
		'no-console': 'warn',
		'comma-spacing': 'warn',
		'space-unary-ops': 'warn',
		'capitalized-comments': 'warn',
		'spaced-comment': 'warn',
		'one-var': ['warn', 'never'],
		'max-len': ['warn', { code: 150, tabWidth: 2, ignoreComments: true }],
		'operator-linebreak': ['warn', 'before', { overrides: {
			'?': 'after',
			':': 'ignore',
			'=': 'after',
			'+=': 'after',
			'-=': 'after',
			'/=': 'after',
			'*=': 'after',
		} }], // Pose problème pour les : avec saut de ligne avant ET après ...
		'no-use-before-define': 'warn',
		'arrow-parens': 'warn',
		'object-curly-spacing': ['warn', 'always'],
		'babel/object-curly-spacing': ['warn', 'always'],
		'init-declarations': ['warn', 'always'],
		'quote-props': ['warn', 'consistent-as-needed'],
		'no-trailing-spaces': ['warn', { skipBlankLines: true }],
		'comma-dangle': ['warn', 'always-multiline'],
		'indent': ['warn', 'tab', { SwitchCase: 1 }],
		'space-before-function-paren': ['warn', {
			anonymous: 'never',
			named: 'never',
			asyncArrow: 'always',
		}],
		'dot-location': ['warn', 'property'],
		'object-curly-newline': ['warn', {
			consistent: true,
		}],
		'no-useless-rename': ['warn', {
			ignoreDestructuring: true,
			ignoreImport: false,
			ignoreExport: false,
		}],
		'brace-style': ['warn', 'stroustrup', { allowSingleLine: true }],
		'class-methods-use-this': ['warn', { exceptMethods: [] }],
		'require-unicode-regexp': 'warn',
		'prefer-object-spread': 'warn',
		'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
		'no-warning-comments': 'warn',

		// Ces règles sont définitivement intéressantes en errors
		'func-style': 'error', // Risque d'utilisation dangereuse de this
		'no-var': 'error', // Risque d'utilisation conflictueuse d'une même variable
		'prefer-const': 'error', // Risque d'utilisation conflictueuse d'une même variable
		'no-eval': 'error', // Risque d'exécution de code malicieux
		'linebreak-style': ['error', 'unix'], // Problèmes de comparaison de fichier et compilation
		'semi': ['error', 'always'], // Séparation des lignes
		'strict': ['error', 'never'], // A priori pas de raison d'utiliser cette directive

		'babel/no-invalid-this': 'error', // Risque d'utilisation dangereuse de this
		'babel/new-cap': 'error',
		'babel/camelcase': 'error',
		'babel/semi': 'error',
		'babel/no-unused-expressions': 'error',
		'babel/valid-typeof': 'error',
	},
};
