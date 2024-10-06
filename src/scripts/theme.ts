import type { ColorTheme, Theme } from '@/types/Theme';

import moonSvg from '@/assets/svg/moon.svg?raw';
import sunSvg from '@/assets/svg/sun.svg?raw';

const THEME_STORAGE_KEY = 'theme';
const themes: Theme[] = ['system', 'light', 'dark'];

let refs: ReturnType<typeof getRefs>;
let darkMediaQuery: MediaQueryList;

const getRefs = () => ({
	lightStyles: document.getElementById('style-media-light') as HTMLStyleElement,
	darkStyles: document.getElementById('style-media-dark') as HTMLStyleElement,
	lightThemeColor: document.getElementById('theme-color-light') as HTMLMetaElement,
	darkThemeColor: document.getElementById('theme-color-dark') as HTMLMetaElement,
	themeToggler: document.getElementById('theme-toggler') as HTMLButtonElement,
});

const getSystemTheme = (): ColorTheme => (darkMediaQuery.matches ? 'dark' : 'light');

const getStoredTheme = () => window.localStorage.getItem(THEME_STORAGE_KEY) as null | Theme;

const removeStoredTheme = () => window.localStorage.removeItem(THEME_STORAGE_KEY);

const storeTheme = (theme: ColorTheme) => window.localStorage.setItem(THEME_STORAGE_KEY, theme);

const getColorTheme = (): Theme => getStoredTheme() ?? 'system';

const setLocalStorageTheme = (theme: Theme) =>
	theme === 'system' ? removeStoredTheme() : storeTheme(theme);

const setDocumentTheme = (theme: ColorTheme) => {
	document.documentElement.dataset.theme = theme;
};

const getMediaForTheme = (theme: ColorTheme, targetTheme: ColorTheme) =>
	theme === targetTheme ? 'all' : 'not all';

const updateStylesheetsForTheme = (theme: ColorTheme) => {
	const lightMedia = getMediaForTheme(theme, 'light');
	const darkMedia = getMediaForTheme(theme, 'dark');

	refs.lightStyles.media = lightMedia;
	refs.darkStyles.media = darkMedia;
	refs.lightThemeColor.media = lightMedia;
	refs.darkThemeColor.media = darkMedia;
};

const getThemeIcon = (theme: ColorTheme) => (theme === 'light' ? sunSvg : moonSvg);

const getThemeConfig = (theme: Theme, systemTheme: ColorTheme) =>
	({
		dark: { icon: moonSvg, text: 'Dark' },
		light: { icon: sunSvg, text: 'Light' },
		system: { icon: getThemeIcon(systemTheme), text: 'System' },
	})[theme];

const updateTogglerUI = (theme: Theme) => {
	const [icon, text] = Array.from(refs.themeToggler.children) as [HTMLElement, HTMLElement];
	const { icon: iconSvg, text: themeText } = getThemeConfig(theme, getSystemTheme());

	text.innerText = themeText;
	icon.innerHTML = iconSvg;
};

const applyTheme = (theme: Theme) => {
	const effectiveTheme = getEffectiveTheme(theme);

	setLocalStorageTheme(theme);
	setDocumentTheme(effectiveTheme);
	updateStylesheetsForTheme(effectiveTheme);
	updateTogglerUI(theme);
};

const getEffectiveTheme = (theme: Theme) => (theme === 'system' ? getSystemTheme() : theme);

const getNextIndex = (currentIndex: number, arrayLength: number) =>
	(currentIndex + 1) % arrayLength;

const getNextTheme = (currentTheme: Theme) => {
	const currentIndex = themes.indexOf(currentTheme);
	const nextIndex = getNextIndex(currentIndex, themes.length);

	return themes[nextIndex];
};

const handleSystemThemeChange = () => {
	const currentTheme = getColorTheme();

	if (currentTheme === 'system') {
		applyTheme('system');
	}
};

const handleThemeToggle = () => {
	const currentTheme = getColorTheme();
	const nextTheme = getNextTheme(currentTheme);

	applyTheme(nextTheme);
};

const setupSystemThemeListener = () => {
	handleSystemThemeChange();

	darkMediaQuery.addEventListener('change', handleSystemThemeChange);
};

const setupThemeToggler = () => {
	refs.themeToggler.addEventListener('click', handleThemeToggle);
};

const init = () => {
	refs = getRefs();
	darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

	const initialTheme = getColorTheme();

	applyTheme(initialTheme);
	setupThemeToggler();
	setupSystemThemeListener();
};

const cleanup = () => {
	darkMediaQuery.removeEventListener('change', handleSystemThemeChange);
	refs.themeToggler.removeEventListener('click', handleThemeToggle);
};

document.addEventListener('astro:before-swap', cleanup);
document.addEventListener('astro:after-swap', init);
document.addEventListener('astro:page-load', init);
