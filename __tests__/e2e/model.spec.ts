import { expect, test } from '@playwright/test';

test.describe('3D Model', () => {
	test('is visible and handles state changes', async ({ page }) => {
		await page.goto('/');

		await expect(page.getByTestId('model-loader')).toBeVisible();
		await expect(page.getByTestId('model-loader-text')).toHaveText('Loading Model…');
		await expect(page.getByTestId('model-progress-bar')).toBeVisible();
		await expect(page.getByTestId('model-percentage')).toHaveText(/^\d+%$/);
		await expect(page.getByTestId('model')).toBeVisible();
		await expect(page.getByTestId('model-loader')).toBeHidden();
		await expect(page.getByTestId('model-error')).toBeHidden();

		const modelContainer = page.getByTestId('model');
		await expect(modelContainer).toHaveAttribute('role', 'presentation');
		await expect(modelContainer).toHaveAttribute('id', 'model');
	});

	test('shows error message if model fails to load', async ({ page }) => {
		await page.route('**/scene.gltf', (route) => route.abort());

		await page.goto('/');

		await expect(page.getByTestId('model-error')).toBeVisible();
	});
});
