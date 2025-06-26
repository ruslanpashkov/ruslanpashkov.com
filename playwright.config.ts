import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests/e2e',
	testMatch: '*.spec.ts',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [['html', { outputFolder: 'test-reports/playwright' }]],
	use: {
		baseURL: 'http://localhost:4321',
		trace: 'on-first-retry',
	},
	projects: [
		{ name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
		{ name: 'Desktop Safari', use: { ...devices['Desktop Safari'] } },
		{ name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
		{ name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
	],
	webServer: {
		command: 'bun run preview',
		url: 'http://localhost:4321',
		reuseExistingServer: !process.env.CI,
	},
});
