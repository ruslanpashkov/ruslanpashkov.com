import moonSvg from '@/assets/svg/moon.svg?raw';
import sunSvg from '@/assets/svg/sun.svg?raw';
import { debounce } from '@/utils/performance';

(() => {
	const toggler = document.getElementById('theme-toggler');
	const darkStyles = document.getElementById('style-media-dark');
	const darkThemeColor = document.getElementById('theme-color-dark');
	const lightStyles = document.getElementById('style-media-light');
	const lightThemeColor = document.getElementById('theme-color-light');

	if (!toggler || !darkStyles || !darkThemeColor || !lightStyles || !lightThemeColor) {
		console.error('Required theme elements not found');
		return;
	}

	type Theme = 'dark' | 'light';
	type ThemeMode = 'system' | Theme;

	const THEME_STORAGE_KEY = 'theme';
	const themes: ThemeMode[] = ['system', 'light', 'dark'];
	const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

	const getSavedTheme = () => window.localStorage.getItem(THEME_STORAGE_KEY) as null | Theme;

	const saveTheme = (theme: Theme) => window.localStorage.setItem(THEME_STORAGE_KEY, theme);

	const clearTheme = () => window.localStorage.removeItem(THEME_STORAGE_KEY);

	const getCurrentTheme = () => getSavedTheme() ?? 'system';

	const getSystemTheme = () => (darkMediaQuery.matches ? 'dark' : 'light');

	const getSystemThemeIcon = () => (getSystemTheme() === 'light' ? sunSvg : moonSvg);

	const getNextTheme = (themeMode: ThemeMode) => {
		const currentIndex = themes.indexOf(themeMode);
		const nextIndex = (currentIndex + 1) % themes.length;
		return themes[nextIndex];
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

	const getMediaForTheme = (themeMode: ThemeMode, targetTheme: ThemeMode) =>
		themeMode === targetTheme ? 'all' : 'not all';

	const setDocumentTheme = (theme: Theme) => {
		document.documentElement.dataset.theme = theme;
	};

	const updateStylesheetsForTheme = (theme: Theme) => {
		const lightMedia = getMediaForTheme(theme, 'light');
		const darkMedia = getMediaForTheme(theme, 'dark');
		lightStyles.setAttribute('media', lightMedia);
		darkStyles.setAttribute('media', darkMedia);
		lightThemeColor.setAttribute('media', lightMedia);
		darkThemeColor.setAttribute('media', darkMedia);
	};

	const updateTogglerUI = (themeMode: ThemeMode) => {
		const [icon, text] = Array.from(toggler.children);
		const themeConfig = getThemeConfig(themeMode);
		text.textContent = themeConfig.text;
		icon.innerHTML = themeConfig.icon;
		toggler.setAttribute('aria-label', themeConfig.label);
	};

	const applyTheme = (themeMode: ThemeMode) => {
		const isSystemTheme = themeMode === 'system';
		if (isSystemTheme) {
			clearTheme();
		} else {
			saveTheme(themeMode);
		}
		const theme = isSystemTheme ? getSystemTheme() : themeMode;
		setDocumentTheme(theme);
		updateStylesheetsForTheme(theme);
		updateTogglerUI(themeMode);
	};

	const toggleTheme = () => {
		const currentTheme = getCurrentTheme();
		const nextTheme = getNextTheme(currentTheme);
		applyTheme(nextTheme);
	};

	const onSchemeChange = () => {
		if (getCurrentTheme() === 'system') {
			applyTheme('system');
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
})();
