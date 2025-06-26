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
			files: ['*.json', '*.yml', '*.toml', '*.webmanifest'],
			options: {
				useTabs: false,
				tabWidth: 2,
			},
		},
	],
};
