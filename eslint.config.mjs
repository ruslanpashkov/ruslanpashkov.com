import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import typescriptParser from '@typescript-eslint/parser';
import astroEslintParser from 'astro-eslint-parser';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

/** @type {import("eslint").Linter.Config} */
export default [
	js.configs.recommended,
	...tseslint.configs.recommended,
	...eslintPluginAstro.configs.recommended,
	eslintPluginJsxA11y.flatConfigs.recommended,
	eslintPluginPrettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
	},
	{
		ignores: ['src/**/*'],
		languageOptions: {
			globals: {
				...globals.node,
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
		ignores: ['dist', 'node_modules', '.astro'],
	},
];
