import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';

const CONFIG = {
	paths: {
		output: join(process.cwd(), 'public/images/screenshots'),
		server: 'http://localhost:4321',
	},
	dimensions: {
		desktop: {
			width: 1280,
			height: 720,
		},
		mobile: {
			width: 360,
			height: 800,
		},
	},
};

const SCREENSHOT_PROFILES = [
	{
		name: 'Desktop Light',
		filename: 'desktop-light.png',
		theme: 'light',
		viewport: CONFIG.dimensions.desktop,
	},
	{
		name: 'Desktop Dark',
		filename: 'desktop-dark.png',
		theme: 'dark',
		viewport: CONFIG.dimensions.desktop,
	},
	{
		name: 'Mobile Light',
		filename: 'mobile-light.png',
		theme: 'light',
		viewport: CONFIG.dimensions.mobile,
	},
	{
		name: 'Mobile Dark',
		filename: 'mobile-dark.png',
		theme: 'dark',
		viewport: CONFIG.dimensions.mobile,
	},
];

function startWebServer() {
	console.log('Starting web server…');

	return new Promise((resolve, reject) => {
		const server = spawn('bun', ['run', 'preview'], {
			cwd: process.cwd(),
			stdio: 'pipe',
		});

		resolve(server);

		server.on('error', (error) => {
			reject(new Error(`Failed to start server: ${error.message}`));
		});
	});
}

async function waitForServer(url) {
	console.log('Waiting for server to start…');

	const maxAttempts = 30;
	let attempts = 0;

	while (attempts < maxAttempts) {
		try {
			const response = await fetch(url);

			if (response.ok) {
				console.log('Server is ready!');
				return;
			}
		} catch {
			attempts++;
		}

		await new Promise((resolve) => setTimeout(resolve, 1000));
	}

	throw new Error(`Server failed to start within ${maxAttempts} seconds`);
}

async function generateScreenshotImages() {
	console.log('Generating screenshots…');

	let browser = null;

	try {
		browser = await chromium.launch();

		for (const profile of SCREENSHOT_PROFILES) {
			const outputPath = join(CONFIG.paths.output, profile.filename);

			console.log(`Processing ${profile.name}…`);
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
		}
	} catch (error) {
		console.error('Error generating screenshot images:', error);
		throw error;
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}

async function buildScreenshots() {
	console.log('Starting screenshot generation…');

	let serverProcess = null;

	try {
		serverProcess = await startWebServer();
		await waitForServer(CONFIG.paths.server);
		await generateScreenshotImages();
		console.log('Screenshot generation complete!');
	} catch (error) {
		console.error('Error generating screenshots:', error);
		process.exit(1);
	} finally {
		if (serverProcess) {
			serverProcess.kill();
		}
	}
}

await buildScreenshots();
