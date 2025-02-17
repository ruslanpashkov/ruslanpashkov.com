const getRefs = () => ({
	breadcrumbs: document.querySelector('.breadcrumbs') as HTMLElement,
	list: document.querySelector('.breadcrumbs__list') as HTMLOListElement,
});

let refs: ReturnType<typeof getRefs>;

const hasRefs = (references: typeof refs) => Object.values(references).every(Boolean);

const checkScroll = () => {
	const isAtStart = refs.list.scrollLeft <= 1;
	const isAtEnd = refs.list.scrollLeft + refs.list.clientWidth >= refs.list.scrollWidth - 1;

	refs.breadcrumbs.classList.toggle('show-start-fade', !isAtStart);
	refs.breadcrumbs.classList.toggle('show-end-fade', !isAtEnd);
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
	refs?.list?.removeEventListener('scroll', checkScroll);
	window.removeEventListener('resize', handleResize);
};

document.addEventListener('astro:before-swap', cleanup);
document.addEventListener('astro:after-swap', init);
document.addEventListener('astro:page-load', init);

export { cleanup, init };
