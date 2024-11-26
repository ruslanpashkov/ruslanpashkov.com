import { readFile } from 'fs/promises';
import matter from 'gray-matter';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const contentDir = join(process.cwd(), 'src/content');
const __dirname = dirname(fileURLToPath(import.meta.url));

async function getCollection(name) {
	const { globby } = await import('globby');

	try {
		const paths = await globby(`${contentDir}/${name}/**/*.md`);

		const articles = await Promise.all(
			paths.map(async (path) => {
				const content = await readFile(path, 'utf-8');
				const { data: article } = matter(content);

				return {
					categories: article.categories,
					description: article.description,
					slug: article.slug,
					title: article.title,
				};
			}),
		);

		return articles;
	} catch (error) {
		console.error(`Error getting collection ${name}:`, error);
		throw error;
	}
}

async function generateOGImage(article) {
	let browser = null;

	try {
		browser = await chromium.launch();
		const page = await browser.newPage();

		await page.setViewportSize({
			height: 630,
			width: 1200,
		});

		const html = `
			<!DOCTYPE html>
			<html>
				<head>
					<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400&display=swap" rel="stylesheet">

					<style>
						html {
							font-family: Montserrat;
							line-height: 1.2;
							color: #121212;
						}

						body {
							box-sizing: border-box;
							position: relative;
							margin: 0;
							width: 1200px;
							height: 630px;
						}

						.preview-template {
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							align-items: flex-start;
							padding: 40px;
							position: relative;
							width: 1200px;
							height: 630px;
							background: #FFFFFF;
							isolation: isolate;
						}

						.logo {
							width: 60px;
							height: 72px;
							background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABMCAMAAADqdUGXAAACW1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgICAcHBwaGhoXFxcVFRUUFBQSEhIREREQEBAPDw8ODg4NDQ0MDAwWFhYVFRUUFBQUFBQTExMSEhISEhIREREQEBAPDw8PDw8VFRUVFRUUFBQUFBQTExMTExMSEhISEhIREREREREQEBAQEBAUFBQUFBQTExMTExMSEhISEhIREREREREREREUFBQUFBQTExMTExMSEhISEhISEhIREREREREREREUFBQTExMTExMTExMTExMSEhISEhISEhIRERERERERERETExMTExMTExMSEhISEhISEhISEhISEhIRERERERERERETExMTExMTExMSEhISEhISEhISEhIRERERERERERERERETExMTExMTExMSEhISEhISEhISEhISEhISEhISEhIRERERERETExMTExMTExMSEhISEhISEhISEhISEhISEhIRERERERERERETExMSEhISEhISEhISEhISEhISEhISEhIRERETExMTExMSEhISEhISEhISEhIRERERERERERETExMSEhISEhISEhISEhISEhIRERERERETExMSEhISEhISEhISEhISEhISEhISEhISEhITExMSEhISEhISEhISEhISEhISEhISEhISEhISEhISEhIRERESEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhITExMSEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhITExMSEhISEhISEhISEhISEhISEhISEhL////xsIztAAAAx3RSTlMAAQIDBAUGBwgJCgsMDQ4PEBESFBUXGBkaGxwdHiAiIyQlJicoKSorLS4vMTM0NTY5Ojs8PUBBQkNFR0hJSkxOT1BRUlNVV1hZXF5fYGFiZGVmZ2hqa2xtb3BxcnV2d3h5enx9fn+AgYKDhIWHiImKi4yOj5GSk5SWmJmbnJ2foKGkpaqrrK6vsLGytbi6u72+v8DBwsTGycrLzM7P0NHS09XW19ja293e3+Di4+Tl5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+YuynDAAAAAFiS0dEyB26V8oAAAO8SURBVFjDpdjrXxRlFMDxs7uugFpIaJjhakaAVmZaqUWWAd7KcLUMzSi7aFkQWZChZQl5JS8lVmpeUtkQEBBWWAhwEeb3b/ViCXaf3Z15Zva8mp1n5vvZuTznnGdkeYVF7PS/nCsmsRuN6DpY5E4JAG5scicFmirNourA6SAAfyxOBuwWi3A9U30XGC5zCojIjE+GgM+cAyKPXQL2pgBIxgmgLAVAvCdgeFEKgEy/CJenpADIwgEoTwWQndCZbgrMrjeLH78bgzdNAZ/1S32r2JMaADdeNQU6S5PGxm01AQAask2AgOlt3BD5Ey2FToFHIFRnQGipQ8Adxpi6ug9Ci5wB0gZzpaADbmY6A7ohWyQ/BEddjoAweEWk2ICtToAMGBQRkWroecgBUAD/iIhIWjPscQCsh2ORrVIIZtgHKuHT8Qd6E9bZBy7D/zNhFxyxDSyEwemT270eu8Dn8HP0O1VgE8gKwZqJXyehxCbwJVydrJG18I49YNkorI25nl22gEdbodEV80gr7AA5f0NwTtSO/fCWDeDpNrj3QvSeBlivDaTvGYGR4ph9V2CJJjBz+20guDLWHIYHNQBP3tvHhwDOzY8dWAnXLV5l18ELF1vCkTzcvkVtkvZBjdVcWNA3Xksu+NPVy5raBassJ1OJAUNHtvoS3JfX4ZbbejZ+DSPLEj2WtBZ4XyMjeZugbVYC4Au484BOSsvtgcb4JnPFfdisl5WLxuBj9fz8IJzSrQt7YTT2FZLCTmjP0a1MnjPQFT2JpLQfQk/p18aHO+C3ye5s3mGgz1Z1fn4UKse3874NA835yfuDbn98nAfjI7/fX15zDYBDmSn1SL8uj86zPl9WLNDbZ3r2QP0qs7zvg8AaA1rrlDgQhu66b3YUpZtXfx8EpArGXlRHyoEN1r2sDwLi+QWC89ShBhh4Qg+Q2e3we5q6aLkOV6fpAbI0DLXqWOEg/KQJyLvARnWwDNikCUg9/Fugjv4Aw09qAjOuTXSCUR3WX9CcqQfI4/1wzKX2FyGo1wRkHbBDHV8LbNMEpBbuP6cesB9GntUEvE3QMUdNxn9Ca7YeIHPvwFl1mZfbAyddeoCsiEokE7HagApNQD4Eo0Q9pjo+ySYFXEehP085Zso56MzRAyQrAFemJUiyZz16gCwegsNxZWl0omO2BGQzsCXBkn3sJU1Avod7S9SlV2NUyon5alQVD2Rcghb169JXwHlv5AA17cYVlvm9SRL0Pk1AXjESA8ZrkYZViffi78wbSb4xfeCW/wBLB7VQPK4rRgAAAABJRU5ErkJggg==");
							background-size: 60px 72px;
						}

						.content {
							display: flex;
							flex-direction: column;
							align-items: flex-start;
							gap: 12px;
							width: 840px;
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
							border: 2px solid #121212;
							border-radius: 24px;
						}

						.glow {
							position: absolute;
							width: 400px;
							height: 400px;
							left: 900px;
							top: 132px;
							background: rgba(204, 255, 119, 0.75);
							filter: blur(100px);
							z-index: 3;
						}
					</style>
				</head>

				<body class="preview-template">
					<div class="logo"></div>

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

		await page.setContent(html, { waitUntil: 'networkidle' });

		const outputDir = join(__dirname, '/public/images/previews');
		await mkdir(outputDir, { recursive: true });

		const outputPath = join(outputDir, `${article.slug}.png`);
		await page.screenshot({
			path: outputPath,
			type: 'png',
		});
	} catch (error) {
		console.error(`Error generating OG image for ${article.title}:`, error);
		throw error;
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}

async function buildPreviews() {
	console.log('🎨 Starting preview generation...');

	try {
		const articles = await getCollection('blog');
		console.log(`📚 Found ${articles.length} articles`);

		for (const article of articles) {
			console.log(`  🖼 Generating: ${article.title}`);
			await generateOGImage(article);
		}

		console.log('✨ Preview generation complete!');
	} catch (error) {
		console.error('❌ Error generating previews:', error);
		process.exit(1);
	}
}

buildPreviews();
