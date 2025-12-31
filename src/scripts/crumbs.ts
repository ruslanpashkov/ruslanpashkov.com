import { debounce } from '@/utils/performance';

const breadcrumbs = document.getElementById('breadcrumbs');
const list = document.getElementById('breadcrumbs-list');

if (!breadcrumbs || !list) {
	throw new Error('Required breadcrumbs elements not found');
}

const updateFades = () => {
	const isAtStart = list.scrollLeft <= 1;
	const isAtEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 1;
	breadcrumbs.classList.toggle('show-start-fade', !isAtStart);
	breadcrumbs.classList.toggle('show-end-fade', !isAtEnd);
};

const init = () => {
	list.addEventListener('scroll', debounce(updateFades));
	window.addEventListener('resize', debounce(updateFades));

	updateFades();
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
