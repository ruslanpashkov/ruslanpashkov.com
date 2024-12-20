const getRefs = () => ({
	endMask: document.querySelector('.breadcrumbs__mask--end') as HTMLElement,
	list: document.querySelector('.breadcrumbs__list') as HTMLOListElement,
	startMask: document.querySelector('.breadcrumbs__mask--start') as HTMLElement,
});

let refs: ReturnType<typeof getRefs>;

const hasRefs = (references: typeof refs) => Object.values(references).every(Boolean);

const setMaskOpacity = (mask: HTMLElement, opacity: string) => (mask.style.opacity = opacity);

const checkScroll = () => {
	const { endMask, list, startMask } = refs;
	const isAtStart = list.scrollLeft <= 1;
	const isAtEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 1;

	setMaskOpacity(startMask, isAtStart ? '0' : '1');
	setMaskOpacity(endMask, isAtEnd ? '0' : '1');
};

const handleResize = () => {
	requestAnimationFrame(checkScroll);
};

const initEventListeners = () => {
	refs.list.addEventListener('scroll', checkScroll);
	window.addEventListener('resize', handleResize);
};

const init = () => {
	refs = getRefs();

	if (hasRefs(refs)) {
		checkScroll();
		initEventListeners();
	}
};

const cleanup = () => {
	refs.list?.removeEventListener('scroll', checkScroll);
	window.removeEventListener('resize', handleResize);
};

document.addEventListener('astro:before-swap', cleanup);
document.addEventListener('astro:after-swap', init);
document.addEventListener('astro:page-load', init);

export { cleanup, init };
