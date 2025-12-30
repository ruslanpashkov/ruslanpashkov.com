/** @type {import('lint-staged').Configuration} */
export default {
	'*.{js,mjs,ts}': ['eslint --fix', 'prettier --write'],
	'*.astro': ['eslint --fix', 'stylelint --fix', 'prettier --write'],
	'*.css': ['stylelint --fix', 'prettier --write'],
	'*.{md,mdx}': ['markdownlint --fix', 'prettier --write'],
	'*.{json,yml,webmanifest}': 'prettier --write',
};
