import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import Compress from '@playform/compress';
import expressiveCode from 'astro-expressive-code';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';

import { expressiveCodeOptions } from './code-styles.mjs';
import redirects from './redirects.ts';
import { remarkReadingTime } from './remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
	integrations: [
		sitemap({ changefreq: 'weekly' }),
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
	redirects,
	site: 'https://ruslanpashkov.com',
});
