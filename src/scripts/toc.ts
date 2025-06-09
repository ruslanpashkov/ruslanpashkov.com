const STORAGE_KEY = 'toc-collapsed';

const getRefs = () => ({
	content: document.querySelector('.table-of-contents__content') as HTMLElement,
	list: document.querySelector('.table-of-contents__list') as HTMLElement,
	toc: document.querySelector('.table-of-contents') as HTMLElement,
	toggle: document.querySelector('.table-of-contents__toggle') as HTMLButtonElement,
});

let refs: ReturnType<typeof getRefs>;
let currentTransitionHandler: ((event: TransitionEvent) => void) | null = null;

const hasRefs = (references: typeof refs) => Object.values(references).every(Boolean);

const getStoredState = () => window.localStorage.getItem(STORAGE_KEY) === 'true';

const storeState = (isCollapsed: boolean) =>
	window.localStorage.setItem(STORAGE_KEY, isCollapsed.toString());

const setHeight = (height: number) => {
	requestAnimationFrame(() => {
		refs.content.style.height = `${height}px`;
	});
};

const setVisibility = (isVisible: boolean) => {
	refs.content.style.visibility = isVisible ? 'visible' : 'hidden';
	refs.content.setAttribute('aria-hidden', (!isVisible).toString());
};

const setToggleExpanded = (isExpanded: boolean) =>
	refs.toggle.setAttribute('aria-expanded', isExpanded.toString());

const isExpanded = () => refs.toggle.getAttribute('aria-expanded') === 'true';

const cleanupTransition = () => {
	if (currentTransitionHandler) {
		refs?.content?.removeEventListener('transitionend', currentTransitionHandler);
		currentTransitionHandler = null;
	}
};

const expandContent = (height: number) => {
	cleanupTransition();
	setVisibility(true);

	requestAnimationFrame(() => {
		setHeight(height);
		setToggleExpanded(true);
	});
};

const collapseContent = (immediate = false) => {
	cleanupTransition();

	if (immediate) {
		setVisibility(false);
	}

	requestAnimationFrame(() => {
		setHeight(0);
		setToggleExpanded(false);
	});
};

const expand = () => {
	const height = refs.list.offsetHeight;

	expandContent(height);
	storeState(false);
};

const collapse = () => {
	collapseContent();
	storeState(true);

	const handleTransitionEnd = (event: TransitionEvent) => {
		if (event.propertyName === 'height') {
			setVisibility(false);
			cleanupTransition();
		}
	};

	currentTransitionHandler = handleTransitionEnd;
	refs.content.addEventListener('transitionend', handleTransitionEnd);
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

	if (isCollapsed) {
		collapseContent(true);
	} else {
		expandContent(height);
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

	if (hasRefs(refs)) {
		initState();
		initEventListeners();
	}
};

document.addEventListener('astro:page-load', init);

export { init };
