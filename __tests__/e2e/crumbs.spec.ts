import { expect, test } from '@playwright/test';

test.describe('Breadcrumbs navigation', () => {
	test('is visible and navigation works after redirects', async ({ page }) => {
		await page.goto('/blog/');
		await expect(page.getByTestId('breadcrumbs')).toBeVisible();
		const firstArticle = page.getByTestId('blog-article-link').first();
		const articleTitle = await firstArticle.textContent();
		await firstArticle.click();
		await expect(page.getByTestId('breadcrumbs')).toBeVisible();
		await expect(page.getByTestId('breadcrumbs-current')).toHaveText(articleTitle ?? '');
		const blogBreadcrumb = page.getByTestId('breadcrumbs-link').filter({ hasText: 'Blog' });
		await blogBreadcrumb.click();
		await expect(page.getByTestId('breadcrumbs')).toBeVisible();
		await expect(page).toHaveURL(/\/blog\/?$/);
	});

	test('shows 404 for non-existent article and no breadcrumbs', async ({ page }) => {
		await page.goto('/blog/non-existent-article');
		await expect(page.getByTestId('breadcrumbs')).toBeHidden();
		await expect(page.locator('h1')).toHaveText(/404|not found/i);
	});

	test('shows breadcrumbs for deep navigation', async ({ page }) => {
		await page.goto('/blog/ui-ux-design-for-frontend-engineers/');
		await expect(page.getByTestId('breadcrumbs')).toBeVisible();
		const breadcrumbLinks = await page.getByTestId('breadcrumbs-link').all();
		expect(breadcrumbLinks.length).toBeGreaterThanOrEqual(1);
		await expect(page.getByTestId('breadcrumbs-current')).toBeVisible();
	});
});
