/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
	test: {
		include: ['tests/vitest/**/*.test.ts'],
		reporters: ['default', 'html'],
		outputFile: {
			html: 'test-reports/vitest/index.html',
		},
		environment: 'jsdom',
		coverage: {
			include: ['src/**/*.ts'],
			reporter: ['text', 'json', 'html'],
			reportsDirectory: 'test-reports/vitest/coverage',
			provider: 'v8',
		},
	},
});
