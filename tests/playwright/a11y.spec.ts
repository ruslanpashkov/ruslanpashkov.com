import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { globby } from 'globby';

test.describe('Accessibility', () => {
	test('meets accessibility standards across generated pages', async ({ page }) => {
		const pages = await getPages();

		for (const pagePath of pages) {
			await test.step(`Testing ${pagePath}`, async () => {
				await page.goto(pagePath);
				await page.waitForLoadState('networkidle');
				const accessibilityScanResults = await new AxeBuilder({ page })
					.withTags(['wcag22aa'])
					.analyze();
				expect(accessibilityScanResults.violations).toEqual([]);
			});
		}
	});
});

async function getPages(): Promise<string[]> {
	try {
		const htmlFiles = await globby('dist/**/*.html');

		const pages = htmlFiles.map((file) => {
			let route = file.replace(/^dist/, '').replace(/\.html$/, '');

			if (route.endsWith('/index')) {
				route = route.replace('/index', '/');
			}

			if (!route.startsWith('/')) {
				route = '/' + route;
			}

			return route === '' ? '/' : route;
		});

		return Array.from(new Set(pages)).toSorted();
	} catch (error) {
		throw new Error(`Failed to discover pages: ${error}`);
	}
}
