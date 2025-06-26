import { createFocusTrap } from 'focus-trap';

import { debounce } from '@/utils/performance';

(() => {
	const body = document.getElementById('body');
	const header = document.getElementById('header');
	const logo = document.getElementById('logo');
	const menu = document.getElementById('menu');
	const navigation = document.getElementById('navigation');
	const toggler = document.getElementById('menu-toggler');
	const feed = document.getElementById('feed');

	if (!body || !header || !logo || !menu || !feed || !toggler || !navigation) {
		console.error('Required menu elements not found');
		return;
	}

	const focusTrap = createFocusTrap(header);
	const mobileMediaQuery = window.matchMedia('(max-width: 1023px)');

	const isMenuOpen = () => toggler.getAttribute('aria-expanded') === 'true';

	const openMenu = () => {
		body.classList.add('page__body--clip');
		menu.classList.remove('menu--closed');
		header.classList.remove('header--animation');
		logo.setAttribute('tabindex', '-1');
		toggler.setAttribute('aria-expanded', 'true');
		toggler.setAttribute('aria-label', 'Close menu');
		requestAnimationFrame(() => {
			menu.classList.add('menu--open');
		});
		focusTrap.activate();
	};

	const closeMenu = () => {
		body.classList.remove('page__body--clip');
		menu.classList.remove('menu--open');
		header.classList.add('header--animation');
		logo.removeAttribute('tabindex');
		toggler.setAttribute('aria-expanded', 'false');
		toggler.setAttribute('aria-label', 'Open menu');
		menu.addEventListener(
			'transitionend',
			() => {
				menu.classList.add('menu--closed');
			},
			{ once: true },
		);
		focusTrap.deactivate();
	};

	const toggleMenu = () => {
		if (isMenuOpen()) {
			closeMenu();
		} else {
			openMenu();
		}
	};

	const onEscape = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && isMenuOpen()) {
			closeMenu();
		}
	};

	const onResize = (event: MediaQueryListEvent) => {
		if (event.matches) {
			feed.after(navigation);
		} else {
			feed.before(navigation);
			closeMenu();
		}
	};

	const init = () => {
		toggler.addEventListener('click', toggleMenu);
		document.addEventListener('keydown', onEscape);
		mobileMediaQuery.addEventListener('change', debounce(onResize));

		if (mobileMediaQuery.matches) {
			feed.after(navigation);
		}
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
