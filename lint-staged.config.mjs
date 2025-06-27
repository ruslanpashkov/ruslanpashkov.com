/** @type {import('lint-staged').Configuration} */
export default {
	'*.{astro,js,mjs,ts,css,md,mdx,json,yml,webmanifest}': 'prettier --write',
	'*.{astro,js,mjs,ts}': 'eslint --fix',
	'*.{astro,css}': 'stylelint --fix',
};
