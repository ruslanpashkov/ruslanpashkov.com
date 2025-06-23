/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
	test: {
		coverage: {
			include: ['src/**/*.{ts,astro}'],
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
		},
		environment: 'jsdom',
		include: ['__tests__/coverage/**/*.test.ts'],
	},
});
