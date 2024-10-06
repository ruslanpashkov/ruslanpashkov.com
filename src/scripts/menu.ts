import { createFocusTrap } from 'focus-trap';

const getRefs = () => ({
	body: document.getElementById('body') as HTMLElement,
	header: document.getElementById('header') as HTMLElement,
	menu: document.getElementById('menu') as HTMLElement,
	navigation: document.getElementById('navigation') as HTMLElement,
	feed: document.getElementById('feed') as HTMLLinkElement,
	menuToggler: document.getElementById('menu-toggler') as HTMLButtonElement,
});

let refs: ReturnType<typeof getRefs>;
let focusTrap: ReturnType<typeof createFocusTrap>;
let mobileMediaQuery: MediaQueryList;

const toggleBodyClip = (shouldClip: boolean) =>
	refs.body.classList.toggle('page__body--clip', shouldClip);

const toggleClosedMenuClass = (shouldClose: boolean) =>
	refs.menu.classList.toggle('menu--closed', shouldClose);

const toggleOpenMenuClass = (shouldOpen: boolean) =>
	refs.menu.classList.toggle('menu--open', shouldOpen);

const toggleHeaderAnimation = (shouldAnimate: boolean) =>
	refs.header.classList.toggle('header--animation', shouldAnimate);

const setMenuTogglerExpanded = (isExpanded: boolean) =>
	refs.menuToggler.setAttribute('aria-expanded', isExpanded.toString());

const isClosed = () => refs.menu.classList.contains('menu--closed');
const isOpen = () => refs.menu.classList.contains('menu--open');
const isMenuOpen = () => refs.menuToggler.getAttribute('aria-expanded') === 'true';

const showMenuIfNotClosed = () => {
	if (!isClosed()) {
		toggleOpenMenuClass(true);
	}
};

const hideMenuIfNotOpen = () => {
	if (!isOpen()) {
		toggleClosedMenuClass(true);
	}
};

const showMenu = () => {
	requestAnimationFrame(showMenuIfNotClosed);
};

const hideMenu = () => {
	refs.menu.addEventListener('transitionend', hideMenuIfNotOpen, { once: true });
};

const openMenu = () => {
	toggleBodyClip(true);
	toggleClosedMenuClass(false);
	toggleHeaderAnimation(false);
	setMenuTogglerExpanded(true);
	showMenu();
	focusTrap.activate();
};

const closeMenu = () => {
	toggleBodyClip(false);
	toggleOpenMenuClass(false);
	toggleHeaderAnimation(true);
	setMenuTogglerExpanded(false);
	hideMenu();
	focusTrap.deactivate();
};

const handleMenuToggle = () => {
	if (isMenuOpen()) {
		closeMenu();
	} else {
		openMenu();
	}
};

const handleEscapeKey = (event: KeyboardEvent) => {
	if (event.key === 'Escape' && isMenuOpen()) {
		closeMenu();
	}
};

const handleMediaQueryChange = (event: MediaQueryListEvent) => {
	if (event.matches) {
		refs.feed.after(refs.navigation);
	} else {
		refs.feed.before(refs.navigation);
		closeMenu();
	}
};

const initEventListeners = () => {
	refs.menuToggler.addEventListener('click', handleMenuToggle);
	document.addEventListener('keydown', handleEscapeKey);
	mobileMediaQuery.addEventListener('change', handleMediaQueryChange);
};

const init = () => {
	refs = getRefs();
	focusTrap = createFocusTrap(refs.header);
	mobileMediaQuery = window.matchMedia('(max-width: 1023px)');

	initEventListeners();

	if (mobileMediaQuery.matches) {
		refs.feed.after(refs.navigation);
	}
};

const cleanup = () => {
	refs.menuToggler.removeEventListener('click', handleMenuToggle);
	document.removeEventListener('keydown', handleEscapeKey);
	mobileMediaQuery.removeEventListener('change', handleMediaQueryChange);
	focusTrap.deactivate();
};

document.addEventListener('astro:before-swap', cleanup);
document.addEventListener('astro:after-swap', init);
document.addEventListener('astro:page-load', init);
