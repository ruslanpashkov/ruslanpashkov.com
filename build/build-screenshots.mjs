import { spawn } from 'child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';

const CONFIG = {
	dimensions: {
		desktop: {
			height: 720,
			width: 1280,
		},
		mobile: {
			height: 800,
			width: 360,
		},
	},
	paths: {
		output: join(process.cwd(), 'public/images/screenshots'),
		server: 'http://localhost:4321',
	},
};

const SCREENSHOT_PROFILES = [
	{
		filename: 'desktop-light.png',
		name: 'desktop-light',
		theme: 'light',
		viewport: CONFIG.dimensions.desktop,
	},
	{
		filename: 'desktop-dark.png',
		name: 'desktop-dark',
		theme: 'dark',
		viewport: CONFIG.dimensions.desktop,
	},
	{
		filename: 'mobile-light.png',
		name: 'mobile-light',
		theme: 'light',
		viewport: CONFIG.dimensions.mobile,
	},
	{
		filename: 'mobile-dark.png',
		name: 'mobile-dark',
		theme: 'dark',
		viewport: CONFIG.dimensions.mobile,
	},
];

async function buildScreenshots() {
	console.log('🎬 Starting screenshot generation…\n');

	let serverProcess = null;

	try {
		serverProcess = await startWebServer();

		console.log('  ⏱️  Waiting for server to start…');

		await waitForServer(CONFIG.paths.server);

		console.log('\n📷 Generating screenshots…');

		await generateScreenshots();

		console.log('🎉 Screenshot generation complete!');
	} catch (error) {
		console.error('❌ Error generating screenshots:', error);
		process.exit(1);
	} finally {
		if (serverProcess) {
			serverProcess.kill();
		}
	}
}

async function generateScreenshots() {
	let browser = null;
	let generatedCount = 0;

	try {
		browser = await chromium.launch();

		for (const profile of SCREENSHOT_PROFILES) {
			const outputPath = join(CONFIG.paths.output, profile.filename);

			console.log(`  ✨ Generating: ${profile.name}`);

			const page = await browser.newPage();

			await page.setViewportSize(profile.viewport);
			await page.addInitScript((theme) => {
				localStorage.setItem('theme', theme);
			}, profile.theme);
			await page.goto(CONFIG.paths.server, { waitUntil: 'networkidle' });
			await page.waitForTimeout(2500);
			await mkdir(CONFIG.paths.output, { recursive: true });

			const screenshotBuffer = await page.screenshot({
				fullPage: false,
				type: 'png',
			});

			await writeFile(outputPath, screenshotBuffer);
			await page.close();

			generatedCount++;
		}

		console.log(`\n📈 Summary:\n  🎯 Total processed: ${generatedCount} screenshots\n`);
	} catch (error) {
		console.error(`❌ Error generating screenshots:`, error);
		throw error;
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}

function startWebServer() {
	return new Promise((resolve, reject) => {
		console.log('🚀 Starting web server…');

		const server = spawn('bun', ['run', 'preview'], {
			cwd: process.cwd(),
			stdio: 'pipe',
		});

		resolve(server);

		server.on('error', (error) => {
			reject(new Error(`❌ Failed to start server: ${error.message}`));
		});
	});
}

async function waitForServer(url) {
	const maxAttempts = 30;
	let attempts = 0;

	while (attempts < maxAttempts) {
		try {
			const response = await fetch(url);
			if (response.ok) {
				console.log('  ✅ Server is ready!');
				return;
			}
		} catch {
			// Server not ready yet, continue waiting
		}

		attempts++;
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}

	throw new Error(`💥 Server failed to start within ${maxAttempts} seconds`);
}

await buildScreenshots();
