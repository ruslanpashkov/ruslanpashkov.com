import { expect, test } from '@playwright/test';

test.describe('Theme switcher', () => {
	test('is visible and can be clicked', async ({ page }) => {
		await page.goto('/');
		await page.setViewportSize({ height: 812, width: 375 });
		const menuToggler = page.getByTestId('header-menu-toggler');
		await menuToggler.click();
		const toggler = page.getByTestId('menu-theme-toggler');
		await expect(toggler).toBeVisible();
		await toggler.click();
		const themeLabel = toggler.getByTestId('menu-theme-label');
		await expect(themeLabel).toBeVisible();
	});

	test('respects system theme', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'dark' });
		await page.goto('/');
		expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark');
		await page.emulateMedia({ colorScheme: 'light' });
		await page.reload();
		expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('light');
	});

	test('toggles theme manually and persists after reload', async ({ page }) => {
		await page.goto('/');
		await page.setViewportSize({ height: 812, width: 375 });
		const menuToggler = page.getByTestId('header-menu-toggler');
		await menuToggler.click();
		const toggler = page.getByTestId('menu-theme-toggler');
		await toggler.click();
		const theme = await page.evaluate(() => document.documentElement.dataset.theme);
		await page.reload();
		const themeAfterReload = await page.evaluate(() => document.documentElement.dataset.theme);
		expect(themeAfterReload).toBe(theme);
	});

	test('has accessible label', async ({ page }) => {
		await page.goto('/');
		await page.setViewportSize({ height: 812, width: 375 });
		const menuToggler = page.getByTestId('header-menu-toggler');
		await menuToggler.click();
		const toggler = page.getByTestId('menu-theme-toggler');
		const ariaLabel = await toggler.getAttribute('aria-label');
		expect(ariaLabel).toMatch(/theme|color/i);
	});
});
