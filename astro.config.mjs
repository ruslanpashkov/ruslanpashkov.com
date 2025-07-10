import { defineConfig } from 'astro/config';
import { integrations } from './config/integrations';
import { markdown } from './config/markdown';
import { vite } from './config/vite';

export default defineConfig({
	site: 'https://ruslanpashkov.com',
	trailingSlash: 'always',
	output: 'static',
	prefetch: true,
	integrations,
	markdown,
	vite,
	experimental: {
		contentIntellisense: true,
	},
});
