/* eslint-env node */
//const graphQLSchema = require('./GraphQLSchemaForEslint.json');

module.exports = {
	extends: [
		'eslint:all',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:react/all',
		'plugin:mongodb/all',
	],
	parserOptions: {
		ecmaVersion: 9,
		sourceType: 'module',
		allowImportExportEverywhere: true,
		ecmaFeatures: {
			jsx: true,
			legacyDecorators: true,
		},
	},
	env: {
		node: true,
		browser: true,
		es6: true,
	},
	parser: '@typescript-eslint/parser', // Pour que eslint puisse lire les fichiers TypeScript avec les nouvelles syntaxes ECMAScript
	plugins: [
		'import',
		'babel', // Pour que les règles concernées par les nouvelles syntaxes ECMAScript fonctionnent bien
		'react',
		'graphql',
		'react-hooks',
		'mongodb',
	],
	settings: {
		'react': {
			'version': require('./node_modules/react/package.json').version,
		},
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
		'react/jsx-sort-props': 'off',
		'react/forbid-component-props': 'off',
		'react/jsx-filename-extension': 'off',
		'react/jsx-max-props-per-line': 'off',
		'react/jsx-handler-names': 'off',
		'react/jsx-no-literals': 'off',
		'react/sort-prop-types': 'off',
		'react/no-multi-comp': 'off',
		'react/jsx-wrap-multilines': 'off',
		'react/require-default-props': 'off',
		'react/no-unescaped-entities': 'off',
		'react/destructuring-assignment': 'off',
		'react/jsx-one-expression-per-line': 'off',
		'react/jsx-curly-brace-presence': 'off',
		'react/no-set-state': 'off',
		'react/jsx-sort-default-props': 'off',
		'react/jsx-max-depth': 'off',
		'react/jsx-props-no-spreading': 'off',

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
		'class-methods-use-this': ['warn', { exceptMethods: [
			'getInitialState',
			// 'state',
			'getChildContext',
			// 'getDerivedStateFromProps',
			'componentWillMount', // Deprecated
			'UNSAFE_componentWillMount',
			'componentDidMount',
			'componentWillReceiveProps', // Deprecated
			'UNSAFE_componentWillReceiveProps',
			'shouldComponentUpdate',
			'componentWillUpdate', // Deprecated
			'UNSAFE_componentWillUpdate',
			'getSnapshotBeforeUpdate',
			'componentDidUpdate',
			'componentDidCatch',
			'componentWillUnmount',
			'render',
		] }],

		'react/no-unsafe': 'warn',
		'react/no-array-index-key': 'warn',
		'react/require-optimization': 'warn', // Intéressant car force la définition d'un shouldComponentUpdate pour éviter des updates inutiles mais bizarement la règle bug (pas de problème rapporté) pour certains composants...
		'react/sort-comp': ['warn', {
			order: [
				'displayName',
				'defaultProps',
				'propTypes',
				'contextTypes',
				'childContextTypes',
				'mixins',
				'statics',
				'static-methods',
				'getDefaultProps',
				'getInitialState',
				'everything-else',
				'state',
				'getDerivedStateFromProps',
				'constructor',
				'lifecycle',
			],
			groups: {
				lifecycle: [
					// 'displayName',
					// 'defaultProps',
					// 'propTypes',
					// 'contextTypes',
					// 'childContextTypes',
					// 'mixins',
					// 'statics',
					// 'constructor',
					// 'getDefaultProps',
					// 'getInitialState',
					// 'state',
					// 'getChildContext',
					// 'getDerivedStateFromProps',
					'componentWillMount', // Deprecated
					'UNSAFE_componentWillMount',
					'componentDidMount',
					'componentWillReceiveProps', // Deprecated
					'UNSAFE_componentWillReceiveProps',
					'shouldComponentUpdate',
					'componentWillUpdate', // Deprecated
					'UNSAFE_componentWillUpdate',
					'getSnapshotBeforeUpdate',
					'componentDidUpdate',
					'componentDidCatch',
					'componentWillUnmount',
					'render',
				],
			},
		}],
		'react/prefer-stateless-function': ['warn', { ignorePureComponents: true }],
		'react/jsx-no-bind': ['warn', {
			ignoreRefs: false,
			allowArrowFunctions: false,
			allowBind: false,
		}],
		'react/forbid-prop-types': 'warn',
		'react/jsx-uses-vars': 'warn',
		'react/jsx-uses-react': 'warn',
		'react/jsx-boolean-value': ['warn', 'always'],
		'react/jsx-indent-props': ['warn', 'tab'],
		'react/jsx-indent': ['warn', 'tab'],
		"react/state-in-constructor": ['warn', 'never'],

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
		'react/no-access-state-in-setstate': 'error', // Risque de mauvais calcul du nouvel état
		'react/react-in-jsx-scope': 'error', // Risque de import manquant après conversion de jsx en js
		'react/default-props-match-prop-types': ['error', { allowRequiredDefaults: true }], // Risque d'erreurs de vérification de prop-types
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'error',

		/*
		'graphql/template-strings': [ // Risque de bug si requêtes jquery incorrectes
			'error',
			{
				env: 'apollo',
				tagName: 'gql',
				schemaString: require('./src/schema.js').default,
			},
		],
		*/
	},
};
