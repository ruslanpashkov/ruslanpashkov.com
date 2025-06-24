import { expect, test } from '@playwright/test';

test.describe('404', () => {
	test('should have proper title', async ({ page }) => {
		await page.goto('/404/');
		await expect(page).toHaveTitle('404 | Ruslan Pashkov');
	});
});
