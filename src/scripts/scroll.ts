const hasHash = () => window.location.hash !== '';

const handleHashNavigation = () => {
	if (hasHash()) {
		const element = document.querySelector(window.location.hash) as HTMLElement;

		if (element) {
			requestAnimationFrame(() => element.scrollIntoView());
		}
	}
};

const init = () => {
	handleHashNavigation();
	window.addEventListener('hashchange', handleHashNavigation);
};

const cleanup = () => {
	window.removeEventListener('hashchange', handleHashNavigation);
};

document.addEventListener('astro:before-swap', cleanup);
document.addEventListener('astro:page-load', init);

export { cleanup, init };
