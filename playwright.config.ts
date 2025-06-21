import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	forbidOnly: !!process.env.CI,
	fullyParallel: true,
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
		},

		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] },
		},

		{
			name: 'Mobile Chrome',
			use: { ...devices['Pixel 5'] },
		},

		{
			name: 'Mobile Safari',
			use: { ...devices['iPhone 12'] },
		},
	],
	reporter: 'html',
	retries: process.env.CI ? 2 : 0,
	testDir: './__tests__',
	use: {
		trace: 'on-first-retry',
	},
	webServer: {
		command: 'bun run dev',
		reuseExistingServer: !process.env.CI,
		url: 'http://localhost:4321',
	},
	workers: process.env.CI ? 1 : undefined,
});
