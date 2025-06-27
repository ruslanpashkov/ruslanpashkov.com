/** @type {import('lint-staged').Configuration} */
export default {
	'*.{astro,js,mjs,ts,css,md,mdx,json,yml,webmanifest}': 'bun run format:check',
	'*.{astro,js,mjs,ts}': 'bun run lint:eslint',
	'*.{astro,css}': 'bun run lint:stylelint',
};
