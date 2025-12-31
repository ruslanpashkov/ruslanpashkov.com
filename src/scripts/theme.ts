import moonSvg from '@/assets/svg/moon.svg?raw';
import sunSvg from '@/assets/svg/sun.svg?raw';
import { debounce } from '@/utils/performance';

const toggler = document.getElementById('theme-toggler');
const colorSchemeLight = document.getElementById('color-scheme-light');
const colorSchemeDark = document.getElementById('color-scheme-dark');
const themeColorLight = document.getElementById('theme-color-light');
const themeColorDark = document.getElementById('theme-color-dark');

if (!toggler || !colorSchemeLight || !colorSchemeDark || !themeColorLight || !themeColorDark) {
	throw new Error('Required theme elements not found');
}

type Theme = 'dark' | 'light';
type ThemeMode = 'system' | Theme;

const THEME_STORAGE_KEY = 'theme';
const MEDIA_LIGHT = '(prefers-color-scheme: light)';
const MEDIA_DARK = '(prefers-color-scheme: dark)';
const themes: ThemeMode[] = ['system', 'light', 'dark'];
const darkMediaQuery = window.matchMedia(MEDIA_DARK);

const getSavedTheme = () => window.localStorage.getItem(THEME_STORAGE_KEY) as null | ThemeMode;

const saveTheme = (themeMode: ThemeMode) =>
	window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);

const clearTheme = () => window.localStorage.removeItem(THEME_STORAGE_KEY);

const getCurrentTheme = () => getSavedTheme() ?? 'system';

const getSystemTheme = (): Theme => (darkMediaQuery.matches ? 'dark' : 'light');

const getSystemThemeIcon = () => (getSystemTheme() === 'light' ? sunSvg : moonSvg);

const getNextTheme = (themeMode: ThemeMode) => {
	const currentIndex = themes.indexOf(themeMode);
	const nextIndex = (currentIndex + 1) % themes.length;
	return themes[nextIndex]!;
};

const getThemeConfig = (themeMode: ThemeMode) =>
	({
		dark: {
			icon: moonSvg,
			label: 'Use system theme',
			text: 'Dark',
		},
		light: {
			icon: sunSvg,
			label: 'Use dark theme',
			text: 'Light',
		},
		system: {
			icon: getSystemThemeIcon(),
			label: 'Use light theme',
			text: 'System',
		},
	})[themeMode];

const getSchemeMedia = (themeMode: ThemeMode) => {
	if (themeMode === 'system') {
		return { light: MEDIA_LIGHT, dark: MEDIA_DARK };
	}

	return {
		light: themeMode === 'light' ? 'all' : 'not all',
		dark: themeMode === 'dark' ? 'all' : 'not all',
	};
};

const switchScheme = (themeMode: ThemeMode) => {
	const media = getSchemeMedia(themeMode);

	colorSchemeLight.setAttribute('media', media.light);
	colorSchemeDark.setAttribute('media', media.dark);
	themeColorLight.setAttribute('media', media.light);
	themeColorDark.setAttribute('media', media.dark);
};

const updateTogglerUI = (themeMode: ThemeMode) => {
	const icon = toggler.children[0];
	const text = toggler.children[1];
	const themeConfig = getThemeConfig(themeMode);

	if (icon && text) {
		text.textContent = themeConfig.text;
		icon.innerHTML = themeConfig.icon;
	}

	toggler.setAttribute('aria-label', themeConfig.label);
};

const applyTheme = (themeMode: ThemeMode) => {
	if (themeMode === 'system') {
		clearTheme();
	} else {
		saveTheme(themeMode);
	}

	switchScheme(themeMode);
	updateTogglerUI(themeMode);
};

const toggleTheme = () => {
	const currentTheme = getCurrentTheme();
	const nextTheme = getNextTheme(currentTheme);
	applyTheme(nextTheme);
};

const onSchemeChange = () => {
	const currentTheme = getCurrentTheme();

	if (currentTheme === 'system') {
		updateTogglerUI('system');
	}
};

const init = () => {
	toggler.addEventListener('click', toggleTheme);
	darkMediaQuery.addEventListener('change', debounce(onSchemeChange));

	const initialTheme = getCurrentTheme();
	applyTheme(initialTheme);
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
