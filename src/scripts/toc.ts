const STORAGE_KEY = 'toc-collapsed';

const getRefs = () => ({
	content: document.querySelector('.table-of-contents__content') as HTMLElement,
	list: document.querySelector('.table-of-contents__list') as HTMLElement,
	toc: document.querySelector('.table-of-contents') as HTMLElement,
	toggle: document.querySelector('.table-of-contents__toggle') as HTMLButtonElement,
});

let refs: ReturnType<typeof getRefs>;

const getStoredState = () => window.localStorage.getItem(STORAGE_KEY) === 'true';

const storeState = (isCollapsed: boolean) =>
	window.localStorage.setItem(STORAGE_KEY, isCollapsed.toString());

const setHeight = (height: number) => (refs.content.style.height = `${height}px`);

const setToggleExpanded = (isExpanded: boolean) =>
	refs.toggle.setAttribute('aria-expanded', isExpanded.toString());

const isExpanded = () => refs.toggle.getAttribute('aria-expanded') === 'true';

const expand = () => {
	const height = refs.list.offsetHeight;

	setHeight(height);
	setToggleExpanded(true);
	storeState(false);
};

const collapse = () => {
	setHeight(0);
	setToggleExpanded(false);
	storeState(true);
};

const handleTocToggle = () => {
	if (isExpanded()) {
		collapse();
	} else {
		expand();
	}
};

const handleResize = () => {
	if (isExpanded()) {
		setHeight(refs.list.offsetHeight);
	}
};

const initState = () => {
	const isCollapsed = getStoredState();
	const height = refs.list.offsetHeight;

	setHeight(height);

	if (isCollapsed) {
		collapse();
	} else {
		expand();
	}
};

const initEventListeners = () => {
	refs.toggle.addEventListener('click', handleTocToggle);

	window.addEventListener('resize', () => {
		requestAnimationFrame(handleResize);
	});
};

const init = () => {
	refs = getRefs();

	initState();
	initEventListeners();
};

const cleanup = () => {
	refs.toggle.removeEventListener('click', handleTocToggle);
	window.removeEventListener('resize', handleResize);
};

document.addEventListener('astro:before-swap', cleanup);
document.addEventListener('astro:after-swap', init);
document.addEventListener('astro:page-load', init);
