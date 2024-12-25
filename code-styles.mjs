/**
 * This module exports configuration options for the `astro-expressive-code` package.
 *
 * The `expressiveCodeOptions` object customizes the appearance and behavior of code blocks
 * rendered by the `astro-expressive-code` package. This includes setting theme properties,
 * style overrides, and other visual customizations to ensure the code blocks match the
 * overall design and theme of the website.
 *
 * The customization options provided here allow for a consistent and visually appealing
 * presentation of code snippets, enhancing readability and user experience.
 */

/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
export const expressiveCodeOptions = {
	customizeTheme: (theme) => {
		theme.name = theme.type;
	},
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
			frameBoxShadowCssValue: 'none',
			inlineButtonBackground: 'var(--color-primary)',
			inlineButtonBackgroundOpacity: 1,
			inlineButtonBorder: 'var(--color-neutral)',
			inlineButtonBorderOpacity: 0.1,
			inlineButtonForeground: 'var(--color-contrast)',
			tooltipSuccessBackground: 'var(--color-secondary)',
			tooltipSuccessForeground: 'var(--color-contrast)',
		},
	},
};
