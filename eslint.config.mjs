import js from '@eslint/js';
import typescriptParser from '@typescript-eslint/parser';
import astroEslintParser from 'astro-eslint-parser';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import perfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import("eslint").Linter.Config} */
export default [
	js.configs.recommended,
	...tseslint.configs.recommended,
	...eslintPluginAstro.configs['flat/recommended'],
	perfectionist.configs['recommended-natural'],
	eslintPluginJsxA11y.flatConfigs.recommended,
	eslintPluginPrettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: typescriptParser,
		},
		rules: {
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
				},
			],
			'no-unused-vars': 'off',
		},
	},
	{
		files: ['**/*.d.ts'],
		rules: {
			'@typescript-eslint/triple-slash-reference': 'off',
		},
	},
	{
		files: ['**/*.astro'],
		languageOptions: {
			parser: astroEslintParser,
			parserOptions: {
				extraFileExtensions: ['.astro'],
				parser: '@typescript-eslint/parser',
			},
		},
	},
	{
		files: ['**/*.astro'],
		rules: {
			'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
		},
	},
	{
		ignores: ['dist', 'node_modules', '.astro'],
	},
];
