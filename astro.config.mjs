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
	site: 'https://ruslanpashkov.com',
	trailingSlash: 'never',
});
