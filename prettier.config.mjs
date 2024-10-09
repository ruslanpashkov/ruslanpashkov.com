/** @type {import("prettier").Config} */
export default {
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
			files: ['*.json', '*.yml', '*toml', '*.webmanifest'],
			options: {
				tabWidth: 2,
				useTabs: false,
			},
		},
	],
	plugins: ['prettier-plugin-astro'],
	printWidth: 100,
	singleQuote: true,
	tabWidth: 4,
	useTabs: true,
};
