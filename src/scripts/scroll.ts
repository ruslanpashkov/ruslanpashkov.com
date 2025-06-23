const hasHash = () => window.location.hash !== '';

const handleHashNavigation = () => {
	if (hasHash()) {
		const element = document.querySelector(window.location.hash) as HTMLElement;

		if (element) {
			requestAnimationFrame(() => element.scrollIntoView());
		}
	}
};

const initEventListeners = () => {
	window.addEventListener('hashchange', handleHashNavigation);
};

const initState = () => {
	handleHashNavigation();
};

const init = () => {
	initState();
	initEventListeners();
};

const cleanup = () => {
	window.removeEventListener('hashchange', handleHashNavigation);
};

document.addEventListener('astro:before-swap', cleanup);
document.addEventListener('astro:page-load', init);

export { cleanup, init };
