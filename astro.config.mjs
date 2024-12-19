import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import Compress from '@playform/compress';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';

import redirects from './redirects';
import { remarkReadingTime } from './remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
	adapter: netlify(),
	integrations: [
		mdx(),
		sitemap({ changefreq: 'weekly' }),
		icon({ iconDir: 'src/assets/svg' }),
		Compress({ CSS: false }),
	],
	markdown: {
		rehypePlugins: [
			rehypeAccessibleEmojis,
			rehypeSlug,
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
						properties: {
							'aria-hidden': 'true',
							className: ['heading-link-icon'],
						},
						tagName: 'span',
						type: 'element',
					},
					properties: (heading) => ({
						'aria-label': `Navigate to ${heading.children[0].value}`,
						className: ['heading-link', 'hover'],
						tabIndex: -1,
					}),
				},
			],
		],
		remarkPlugins: [remarkReadingTime],
		shikiConfig: {
			themes: {
				dark: 'github-dark',
				light: 'github-light',
			},
			transformers: [
				{
					pre(node) {
						node.properties.style = 'tab-size: 2;';
						return node;
					},
				},
			],
		},
	},
	output: 'static',
	redirects,
	site: 'https://ruslanpashkov.com',
});
