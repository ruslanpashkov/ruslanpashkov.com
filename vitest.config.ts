/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
	test: {
		globals: true,
		passWithNoTests: true,
		include: ['tests/vitest/**/*.test.ts'],
		reporters: ['default', 'html'],
		outputFile: {
			html: 'test-reports/vitest/index.html',
		},
		environment: 'jsdom',
		coverage: {
			include: ['src/utils/**/*.ts'],
			reporter: ['text', 'json', 'html'],
			reportsDirectory: 'test-reports/vitest/coverage',
			provider: 'v8',
			thresholds: {
				statements: 90,
				branches: 90,
				functions: 90,
				lines: 90,
			},
		},
	},
});
