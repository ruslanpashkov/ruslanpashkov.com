import { expect, test } from '@playwright/test';

test.describe('3D Model', () => {
	test('is visible and interacts with the model', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByTestId('model-loader')).toBeVisible();
		await expect(page.getByTestId('model')).toBeVisible();
		await expect(page.getByTestId('model-loader')).toBeHidden();
		await expect(page.getByTestId('model-message-container')).toBeVisible({ timeout: 10000 });
		const messageTextLocator = page.getByTestId('message-text');

		await expect(messageTextLocator).not.toBeEmpty();
		await expect(page.getByTestId('model-message-container')).toBeHidden({ timeout: 10000 });
		const modelCanvas = page.locator('[data-testid="model"] canvas').first();
		const box = await modelCanvas.boundingBox();
		expect(box, '3D model canvas not found or not visible').not.toBeNull();
		const centerX = box!.x + box!.width / 2;
		const centerY = box!.y + box!.height / 2;

		await page.mouse.click(centerX, centerY);

		await expect(page.getByTestId('model-message-container')).toBeVisible({ timeout: 10000 });
		await expect(messageTextLocator).not.toBeEmpty();
		await expect(page.getByTestId('model-message-container')).toBeHidden({ timeout: 10000 });
	});

	test('shows error message if model fails to load', async ({ page }) => {
		await page.route('**/scene.gltf', (route) => route.abort());

		await page.goto('/');

		await expect(page.getByTestId('model-error')).toBeVisible();
	});
});
