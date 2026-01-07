const CACHE_VERSION = 'v1';
const PRECACHE_NAME = `precache-${CACHE_VERSION}`;
const PAGES_NAME = `pages-${CACHE_VERSION}`;
const ASSETS_NAME = `assets-${CACHE_VERSION}`;

const OFFLINE_URL = '/offline/';

const PRECACHE_URLS = [
	'/',
	OFFLINE_URL,
	'/manifest.webmanifest',
	'/favicon.ico',
	'/icon.svg',
	'/icon-192x192.png',
	'/icon-512x512.png',
	'/icon-maskable.png',
	'/apple-touch-icon.png',
	'/apple-touch-icon-precomposed.png',
];

const ASSET_DESTINATIONS = new Set(['style', 'script', 'image', 'font', 'manifest']);

const isSameOriginGet = (request) => {
	if (request.method !== 'GET') return false;
	const url = new URL(request.url);
	return url.origin === self.location.origin;
};

const cacheResponse = async (cacheName, request, response) => {
	if (response && response.ok) {
		const cache = await caches.open(cacheName);
		await cache.put(request, response.clone());
	}
	return response;
};

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(PRECACHE_NAME)
			.then((cache) => cache.addAll(PRECACHE_URLS))
			.then(() => self.skipWaiting()),
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys
						.filter((key) => ![PRECACHE_NAME, PAGES_NAME, ASSETS_NAME].includes(key))
						.map((key) => caches.delete(key)),
				),
			)
			.then(() => self.clients.claim()),
	);
});

self.addEventListener('fetch', (event) => {
	const { request } = event;

	if (!isSameOriginGet(request)) return;

	if (request.mode === 'navigate') {
		event.respondWith(
			(async () => {
				try {
					const response = await fetch(request);
					await cacheResponse(PAGES_NAME, request, response);
					return response;
				} catch {
					const cached = await caches.match(request);
					if (cached) return cached;

					const fallback = await caches.match(OFFLINE_URL);
					return fallback || new Response('Offline', { status: 503 });
				}
			})(),
		);
		return;
	}

	if (ASSET_DESTINATIONS.has(request.destination)) {
		event.respondWith(
			(async () => {
				const cached = await caches.match(request);
				if (cached) {
					event.waitUntil(
						fetch(request)
							.then((response) => cacheResponse(ASSETS_NAME, request, response))
							.catch(() => null),
					);

					return cached;
				}

				try {
					const response = await fetch(request);
					return await cacheResponse(ASSETS_NAME, request, response);
				} catch {
					return cached || new Response('', { status: 504 });
				}
			})(),
		);
	}
});
