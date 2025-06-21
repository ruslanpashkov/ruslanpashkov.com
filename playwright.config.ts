import { defineConfig, devices } from '@playwright/test';

const BASE_URL = 'http://localhost:4321';

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
	testDir: './__tests__',
	use: {
		baseURL: BASE_URL,
		trace: 'on-first-retry',
	},
	webServer: {
		command: 'bun run build && bun run preview',
		reuseExistingServer: !process.env.CI,
		url: BASE_URL,
	},
	workers: process.env.CI ? 1 : undefined,
});
