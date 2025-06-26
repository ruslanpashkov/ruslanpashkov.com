import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import expressiveCode from 'astro-expressive-code';
import Compress from '@playform/compress';
import browserslist from 'browserslist';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import { expressiveCodeOptions } from './build/code-styles.js';
import { remarkReadingTime } from './build/remark-reading-time.js';
import { getChunkName } from './build/chunk-strategies.js';

// https://astro.build/config
export default defineConfig({
	site: 'https://ruslanpashkov.com',
	trailingSlash: 'always',
	output: 'static',
	integrations: [
		icon({ iconDir: 'src/assets/svg' }),
		expressiveCode(expressiveCodeOptions),
		mdx(),
		sitemap(),
		Compress(),
	],
	markdown: {
		rehypePlugins: [
			[
				rehypeAccessibleEmojis,
				{
					ignore: ['title', 'script', 'style', 'svg', 'math', 'code'],
				},
			],
			[
				rehypeSlug,
				{
					prefix: null,
				},
			],
			[
				rehypeExternalLinks,
				{
					rel: ['nofollow', 'noreferrer'],
					target: '_blank',
				},
			],
			[
				rehypeAutolinkHeadings,
				{
					behavior: 'append',
					content: {
						children: [{ type: 'text', value: '#' }],
						tagName: 'span',
						type: 'element',
					},
					properties: {
						ariaHidden: 'true',
						className: ['heading-link', 'hover'],
						tabIndex: -1,
					},
				},
			],
		],
		remarkPlugins: [remarkReadingTime],
	},
	vite: {
		build: {
			target: browserslistToEsbuild(browserslist()),
			rollupOptions: {
				output: {
					manualChunks: (id) => getChunkName(id),
				},
			},
		},
		css: {
			transformer: 'lightningcss',
		},
	},
});
