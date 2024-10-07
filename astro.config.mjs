import sitemap from '@astrojs/sitemap';
import { shield } from '@kindspells/astro-shield';
import Compress from '@playform/compress';
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
	integrations: [
		shield({
			securityHeaders: {
				enableOnStaticPages: { provider: 'netlify' },
			},
		}),
		sitemap({ changefreq: 'weekly' }),
		icon({ iconDir: 'src/assets/svg' }),
		Compress(),
	],
	output: 'static',
	site: 'https://ruslanpashkov.com',
});
