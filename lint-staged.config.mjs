/** @type {import('lint-staged').Configuration} */
export default {
	'*': 'bun run format:check',
	'*.{astro,ts}': 'bun run typecheck',
	'*.{astro,js,mjs,ts}': 'bun run lint:eslint',
	'*.{astro,css}': 'bun run lint:stylelint',
};
