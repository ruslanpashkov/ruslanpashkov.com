import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	forbidOnly: !!process.env.CI,
	fullyParallel: true,
	projects: [
		{ name: 'Chromium', use: { ...devices['Desktop Chrome'] } },
		{ name: 'Firefox', use: { ...devices['Desktop Firefox'] } },
		{ name: 'WebKit', use: { ...devices['Desktop Safari'] } },
		{ name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
		{ name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
	],
	reporter: 'html',
	retries: process.env.CI ? 2 : 0,
	testDir: './__tests__/e2e',
	use: {
		baseURL: 'http://localhost:4321',
		trace: 'on-first-retry',
	},
	webServer: {
		command: 'bun run preview',
		reuseExistingServer: !process.env.CI,
		url: 'http://localhost:4321',
	},
	workers: process.env.CI ? 1 : undefined,
});
