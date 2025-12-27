import { expect, test } from '@playwright/test';

test('theme toggler is visible and can be clicked', async ({ page }) => {
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

test('theme defaults to system mode', async ({ page }) => {
	await page.goto('/');
	const savedTheme = await page.evaluate(() => window.localStorage.getItem('theme'));
	expect(savedTheme).toBeNull();
});

test('theme toggler cycles through system, light, dark modes', async ({ page }) => {
	await page.goto('/');
	await page.setViewportSize({ height: 812, width: 375 });
	const menuToggler = page.getByTestId('header-menu-toggler');
	await menuToggler.click();
	const toggler = page.getByTestId('menu-theme-toggler');
	const themeLabel = toggler.getByTestId('menu-theme-label');
	await expect(themeLabel).toHaveText('System');
	await toggler.click();
	await expect(themeLabel).toHaveText('Light');
	await toggler.click();
	await expect(themeLabel).toHaveText('Dark');
	await toggler.click();
	await expect(themeLabel).toHaveText('System');
});

test('theme persists after reload', async ({ page }) => {
	await page.goto('/');
	await page.setViewportSize({ height: 812, width: 375 });
	const menuToggler = page.getByTestId('header-menu-toggler');
	await menuToggler.click();
	const toggler = page.getByTestId('menu-theme-toggler');
	await toggler.click();
	const savedTheme = await page.evaluate(() => window.localStorage.getItem('theme'));
	expect(savedTheme).toBe('light');
	await page.reload();
	const themeAfterReload = await page.evaluate(() => window.localStorage.getItem('theme'));
	expect(themeAfterReload).toBe('light');
});

test('system mode clears localStorage', async ({ page }) => {
	await page.goto('/');
	await page.setViewportSize({ height: 812, width: 375 });
	const menuToggler = page.getByTestId('header-menu-toggler');
	await menuToggler.click();
	const toggler = page.getByTestId('menu-theme-toggler');
	await toggler.click();
	let savedTheme = await page.evaluate(() => window.localStorage.getItem('theme'));
	expect(savedTheme).toBe('light');
	await toggler.click();
	savedTheme = await page.evaluate(() => window.localStorage.getItem('theme'));
	expect(savedTheme).toBe('dark');
	await toggler.click();
	savedTheme = await page.evaluate(() => window.localStorage.getItem('theme'));
	expect(savedTheme).toBeNull();
});

test('theme toggler has accessible label', async ({ page }) => {
	await page.goto('/');
	await page.setViewportSize({ height: 812, width: 375 });
	const menuToggler = page.getByTestId('header-menu-toggler');
	await menuToggler.click();
	const toggler = page.getByTestId('menu-theme-toggler');
	const ariaLabel = await toggler.getAttribute('aria-label');
	expect(ariaLabel).toMatch(/theme/i);
});
