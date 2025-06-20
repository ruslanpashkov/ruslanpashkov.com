import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';

/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
export const expressiveCodeOptions = {
	customizeTheme: (theme) => {
		theme.name = theme.type;
	},
	defaultProps: {
		showLineNumbers: false,
	},
	plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
	styleOverrides: {
		borderColor: 'var(--color-secondary)',
		borderRadius: '12px',
		borderWidth: '1px',
		codeBackground: 'var(--color-transparent)',
		codeFontFamily: 'Fira Code, monospace',
		codeFontSize: '1.125rem',
		codeLineHeight: 1.65,
		codePaddingBlock: '20px',
		codePaddingInline: '20px',
		focusBorder: 'var(--color-focus)',
		frames: {
			editorActiveTabBackground: 'var(--color-primary)',
			editorActiveTabBorderColor: 'var(--color-secondary)',
			editorActiveTabForeground: 'var(--color-contrast)',
			editorActiveTabIndicatorBottomColor: 'var(--color-focus)',
			editorActiveTabIndicatorHeight: '2px',
			editorActiveTabIndicatorTopColor: 'transparent',
			editorTabBarBackground: 'var(--color-secondary)',
			editorTabBarBorderBottomColor: 'var(--color-secondary)',
			editorTabBarBorderColor: 'var(--color-secondary)',
			frameBoxShadowCssValue: 'none',
			inlineButtonBackground: 'var(--color-primary)',
			inlineButtonBackgroundOpacity: 1,
			inlineButtonBorder: 'var(--color-neutral)',
			inlineButtonBorderOpacity: 0.1,
			inlineButtonForeground: 'var(--color-contrast)',
			terminalBackground: 'var(--color-primary)',
			terminalTitlebarBackground: 'var(--color-secondary)',
			terminalTitlebarBorderBottomColor: 'var(--color-secondary)',
			terminalTitlebarDotsForeground: 'var(--color-focus)',
			terminalTitlebarDotsOpacity: 1,
			terminalTitlebarForeground: 'var(--color-contrast)',
			tooltipSuccessBackground: 'var(--color-secondary)',
			tooltipSuccessForeground: 'var(--color-contrast)',
		},
		lineNumbers: {
			foreground: 'var(--color-neutral)',
		},
	},
};
