import sitemap from '@astrojs/sitemap';
import Compress from '@playform/compress';
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
	integrations: [
		sitemap({ changefreq: 'weekly' }),
		icon({ iconDir: 'src/assets/svg' }),
		Compress({
			// HTML: false,
			// CSS: false,
			// JavaScript: false,
			Image: false,
			SVG: false,
		}),
	],
	output: 'static',
	site: 'https://ruslanpashkov.com',
});
