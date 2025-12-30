/** @type {import('prettier').Config} */
export default {
	singleQuote: true,
	useTabs: true,
	tabWidth: 4,
	printWidth: 100,
	plugins: ['prettier-plugin-astro'],
	overrides: [
		{
			files: ['*.astro'],
			options: {
				parser: 'astro',
			},
		},
		{
			files: ['*.css'],
			options: {
				singleQuote: false,
			},
		},
		{
			files: ['*.md', '*.mdx'],
			options: {
				embeddedLanguageFormatting: 'off',
			},
		},
		{
			files: ['*.json', '*.yml', '*.webmanifest'],
			options: {
				useTabs: false,
				tabWidth: 2,
			},
		},
	],
};
