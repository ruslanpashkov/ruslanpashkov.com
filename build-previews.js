import { readFile } from 'fs/promises';
import matter from 'gray-matter';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const CONFIG = {
	dimensions: {
		height: 630,
		width: 1200,
	},
	paths: {
		content: join(process.cwd(), 'src/content'),
		output: join(dirname(fileURLToPath(import.meta.url)), '/public/images/previews'),
	},
	template: {
		color: {
			accent: '#CCFF79',
			primary: '#121212',
			secondary: '#FFFFFF',
		},
		font: {
			name: 'Montserrat',
			url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400&display=swap',
		},
	},
};

function validateArticle(article) {
	const required = ['title', 'description', 'slug', 'categories'];
	const missing = required.filter((field) => !article[field]);

	if (missing.length > 0) {
		throw new Error(`Article missing required fields: ${missing.join(', ')}`);
	}

	if (!Array.isArray(article.categories)) {
		throw new Error('Article categories must be an array');
	}
}

async function getCollection(name) {
	const { globby } = await import('globby');

	try {
		const paths = await globby(`${CONFIG.paths.content}/${name}/**/*.{md,mdx}`);

		return await Promise.all(
			paths.map(async (path) => {
				const content = await readFile(path, 'utf-8');
				const { data: article } = matter(content);

				validateArticle(article);

				return {
					categories: article.categories,
					description: article.description,
					slug: article.slug,
					title: article.title,
				};
			}),
		);
	} catch (error) {
		console.error(`Error getting collection ${name}:`, error);
		throw error;
	}
}

function getTemplate(article) {
	return `<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">

			<title>${article.title}</title>

			<link href="${CONFIG.template.font.url}" rel="stylesheet">

			<style>
				html {
					font-family: ${CONFIG.template.font.name};
					line-height: 1.2;
					color: ${CONFIG.template.color.primary};
				}

				body {
					box-sizing: border-box;
					position: relative;
					margin: 0;
					width: ${CONFIG.dimensions.width}px;
					height: ${CONFIG.dimensions.height}px;
				}

				.preview-template {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					align-items: flex-start;
					padding: 40px;
					position: relative;
					width: ${CONFIG.dimensions.width}px;
					height: ${CONFIG.dimensions.height}px;
					background: ${CONFIG.template.color.secondary};
					isolation: isolate;
				}

				.content {
					z-index: 1;
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					gap: 12px;
					max-width: 820px;
				}

				.title {
					font-size: 54px;
				}

				.description {
					font-size: 24px;
				}

				.categories {
					display: flex;
					gap: 20px;
				}

				.category {
					box-sizing: border-box;
					padding: 4px 16px;
					width: max-content;
					font-size: 24px;
					border: 2px solid ${CONFIG.template.color.primary};
					border-radius: 24px;
				}

				.glow {
					position: absolute;
					width: 400px;
					height: 400px;
					left: 900px;
					top: 132px;
					background: ${CONFIG.template.color.accent};
					filter: blur(100px);
				}
			</style>
		</head>

		<body class="preview-template">
			<svg width="64" height="76" viewBox="0 0 64 76" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M2 51.1294V2C2 2 20.3158 2 32.7368 2C45.1579 2 50.6316 13.6471 50.6316 19.5765C50.6316 39.4824 32.9474 39.6941 32.9474 39.6941L59.0526 74H38.2105L20.5263 51.1294H46C50.8421 51.1294 62 45.8353 62 31.8588C62 22.5412 54 13.8588 45.3684 13.8588H17.3684V74H2.00001"
					stroke="${CONFIG.template.color.primary}"
					stroke-width="3"
					stroke-miterlimit="10"
				/>
			</svg>

			<div class="content">
				<div class="title">${article.title}</div>

				<div class="description">${article.description}</div>
			</div>

			<div class="categories">
				${article.categories.map((category) => `<div class="category">${category}</div>`).join('')}
			</div>

			<div class="glow"></div>
		</body>
	</html>
	`;
}

async function generateOGImages(articles) {
	let browser = null;
	let skippedCount = 0;
	let generatedCount = 0;

	try {
		browser = await chromium.launch();

		const page = await browser.newPage();

		await page.setViewportSize(CONFIG.dimensions);

		for (const article of articles) {
			const outputPath = join(CONFIG.paths.output, `${article.slug}.png`);

			if (existsSync(outputPath)) {
				console.log(`  💾 Skipping: ${article.title} (image already exists)`);
				skippedCount++;
				continue;
			}

			console.log(`  🖼 Generating: ${article.title}`);

			const html = getTemplate(article);

			await page.setContent(html, { waitUntil: 'networkidle' });

			await mkdir(CONFIG.paths.output, { recursive: true });

			await page.screenshot({
				path: outputPath,
				type: 'png',
			});

			generatedCount++;
		}

		console.log(
			`\n📊 Summary:\n  🆕 Generated: ${generatedCount}\n  ⏩ Skipped: ${skippedCount}\n`,
		);
	} catch (error) {
		console.error(`Error generating OG images:`, error);
		throw error;
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}

async function buildPreviews() {
	console.log('🎨 Starting preview generation…\n');

	try {
		const articles = await getCollection('blog');

		console.log(`📚 Found ${articles.length} articles`);

		await generateOGImages(articles);

		console.log('✨ Preview generation complete!');
	} catch (error) {
		console.error('❌ Error generating previews:', error);
		process.exit(1);
	}
}

await buildPreviews();
