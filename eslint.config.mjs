import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import typescriptParser from '@typescript-eslint/parser';
import astroEslintParser from 'astro-eslint-parser';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

/** @type {import('eslint').Linter.Config} */
export default [
	js.configs.recommended,
	...tseslint.configs.recommended,
	...eslintPluginAstro.configs.recommended,
	eslintPluginJsxA11y.flatConfigs.recommended,
	eslintPluginPrettier,
	{
		files: ['src/**/*', 'public/**/*'],
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
	},
	{
		ignores: ['src/**/*', 'public/**/*'],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
	{
		files: ['public/sw.js'],
		languageOptions: {
			globals: {
				...globals.serviceworker,
			},
		},
	},
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: typescriptParser,
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
		ignores: ['node_modules', 'dist', '.astro', 'test-reports'],
	},
];
