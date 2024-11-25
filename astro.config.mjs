import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import Compress from '@playform/compress';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';

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
