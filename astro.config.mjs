import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import Compress from '@playform/compress';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';

import redirects from './redirects';

// https://astro.build/config
export default defineConfig({
	adapter: netlify(),
	integrations: [
		sitemap({ changefreq: 'weekly' }),
		icon({ iconDir: 'src/assets/svg' }),
		Compress({ CSS: false }),
	],
	markdown: {
		rehypePlugins: [
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
					properties: {
						ariaHidden: 'true',
						className: ['heading-link'],
						tabIndex: -1,
					},
				},
			],
		],
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
