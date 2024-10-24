import sitemap from '@astrojs/sitemap';
import Compress from '@playform/compress';
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
	integrations: [
		sitemap({ changefreq: 'weekly' }),
		icon({ iconDir: 'src/assets/svg' }),
		Compress({ CSS: false }),
	],
	output: 'static',
	redirects: {
		'/met-landing-page/': 'https://met-landing-page.vercel.app/',
		'/password-generator/': 'https://mui-password-generator.vercel.app/',
		'/product-catalog/': 'https://react-product-catalog.vercel.app/',
		'/todomvc-clone/': 'https://todomvc-application.vercel.app/',
		'/user-dashboard/': 'https://ui-user-dashboard.vercel.app/',
	},
	site: 'https://ruslanpashkov.com',
});
