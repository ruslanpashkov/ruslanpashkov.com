import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import Compress from '@playform/compress';
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

import redirects from './redirects';

// https://astro.build/config
export default defineConfig({
	adapter: netlify(),
	integrations: [
		sitemap({ changefreq: 'weekly' }),
		icon({ iconDir: 'src/assets/svg' }),
		Compress({ CSS: false }),
	],
	output: 'static',
	redirects,
	site: 'https://ruslanpashkov.com',
});
