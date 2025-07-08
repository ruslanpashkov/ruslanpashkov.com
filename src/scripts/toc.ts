import { debounce } from '@/utils/performance';

(() => {
	const toc = document.getElementById('toc');
	const content = document.getElementById('toc-content');
	const list = document.getElementById('toc-list');
	const toggler = document.getElementById('toc-toggler');

	if (!toc || !content || !list || !toggler) {
		console.error('Required table of contents elements not found');
		return;
	}

	type TocStatus = 'collapsed' | 'expanded';

	const STORAGE_KEY = 'toc-status';

	const isTocOpen = () => toggler.getAttribute('aria-expanded') === 'true';

	const getSavedStatus = () => window.localStorage.getItem(STORAGE_KEY) as null | TocStatus;

	const saveStatus = (status: TocStatus) => {
		window.localStorage.setItem(STORAGE_KEY, status);
	};

	const setTocVisibility = (isVisible: boolean) => {
		content.style.visibility = isVisible ? 'visible' : 'hidden';
	};

	const setTocHeight = (height: number) => {
		content.style.height = `${height}px`;
	};

	const onTransitionEnd = (event: TransitionEvent) => {
		if (event.propertyName === 'height') {
			setTocVisibility(false);
		}
	};

	const expandTocContent = (height: number) => {
		content.removeEventListener('transitionend', onTransitionEnd);
		setTocVisibility(true);
		setTocHeight(height);
		toggler.setAttribute('aria-expanded', 'true');
	};

	const collapseTocContent = () => {
		setTocHeight(0);
		toggler.setAttribute('aria-expanded', 'false');
	};

	const openToc = () => {
		expandTocContent(list.offsetHeight);
		saveStatus('expanded');
	};

	const closeToc = () => {
		collapseTocContent();
		saveStatus('collapsed');
		content.addEventListener('transitionend', onTransitionEnd);
	};

	const toggleToc = () => {
		if (isTocOpen()) {
			closeToc();
		} else {
			openToc();
		}
	};

	const onResize = () => {
		if (isTocOpen()) {
			setTocHeight(list.offsetHeight);
		}
	};

	const init = () => {
		toggler.addEventListener('click', toggleToc);
		window.addEventListener('resize', debounce(onResize));

		if (getSavedStatus() === 'collapsed') {
			collapseTocContent();
		} else {
			expandTocContent(list.offsetHeight);
		}
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
