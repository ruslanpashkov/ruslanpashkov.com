import sitemap from '@astrojs/sitemap';
import Compress from '@playform/compress';
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
	integrations: [
		sitemap({ changefreq: 'weekly' }),
		icon({ iconDir: 'src/assets/svg' }),
		Compress(),
	],
	output: 'static',
	redirects: {
		'/feed': {
			destination: '/rss.xml',
			status: 308,
		},
	},
	site: 'https://ruslanpashkov.com',
});
