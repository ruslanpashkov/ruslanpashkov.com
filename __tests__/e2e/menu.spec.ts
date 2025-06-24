import { expect, test } from '@playwright/test';

test.describe('Burger menu', () => {
	test('is visible and works on mobile', async ({ page }) => {
		await page.goto('/');
		await page.setViewportSize({ height: 812, width: 375 });

		await expect(page.getByTestId('header-menu-toggler')).toBeVisible();
		await expect(page.getByTestId('menu')).toBeHidden();

		await page.getByTestId('header-menu-toggler').click();

		await expect(page.getByTestId('menu')).toBeVisible();

		await page.getByTestId('header-menu-toggler').click();

		await expect(page.getByTestId('menu')).toBeHidden();
	});

	test('is visible and works on desktop', async ({ page }) => {
		await page.goto('/');
		await page.setViewportSize({ height: 800, width: 1280 });

		await expect(page.getByTestId('header-menu-toggler')).toBeHidden();
		await expect(page.getByTestId('menu')).toBeVisible();
	});
});
