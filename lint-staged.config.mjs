/** @type {import('lint-staged').Configuration} */
export default {
	'*': 'bun run format:check',
	'*.{astro,js,mjs,ts}': 'bun run lint:eslint',
	'*.{astro,css}': 'bun run lint:stylelint',
};
