import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import Compress from '@playform/compress';
import expressiveCode from 'astro-expressive-code';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';
import browserslist from 'browserslist';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';

import { chunkManager } from './build/chunk-strategies.mjs';
import { expressiveCodeOptions } from './build/code-styles.mjs';
import { remarkReadingTime } from './build/remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
	integrations: [
		sitemap(),
		icon({ iconDir: 'src/assets/svg' }),
		expressiveCode(expressiveCodeOptions),
		mdx(),
		Compress({ CSS: false }),
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
					rel: ['nofollow', 'noopener', 'noreferrer'],
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
	output: 'static',
	site: 'https://ruslanpashkov.com',
	trailingSlash: 'always',
	vite: {
		build: {
			chunkSizeWarningLimit: 1000,
			rollupOptions: {
				output: {
					manualChunks: (id) => chunkManager.getChunkName(id),
				},
			},
			target: browserslistToEsbuild(browserslist()),
		},
		css: {
			transformer: 'lightningcss',
		},
	},
});
