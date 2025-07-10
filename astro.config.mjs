import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import expressiveCode from 'astro-expressive-code';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import Compress from '@playform/compress';
import rehypeSlug from 'rehype-slug';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import { readingTime } from 'reading-time-estimator';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import browserslist from 'browserslist';

export default defineConfig({
	site: 'https://ruslanpashkov.com',
	trailingSlash: 'always',
	output: 'static',
	prefetch: true,
	integrations: [
		icon({ iconDir: 'src/assets/svg' }),
		expressiveCode({
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
				codeLineHeight: '1.65',
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
					inlineButtonBorder: 'var(--color-neutral)',
					inlineButtonBorderOpacity: '0.1',
					inlineButtonForeground: 'var(--color-contrast)',
					terminalBackground: 'var(--color-primary)',
					terminalTitlebarBackground: 'var(--color-secondary)',
					terminalTitlebarBorderBottomColor: 'var(--color-secondary)',
					terminalTitlebarDotsForeground: 'var(--color-focus)',
					terminalTitlebarDotsOpacity: '1',
					terminalTitlebarForeground: 'var(--color-contrast)',
					tooltipSuccessBackground: 'var(--color-secondary)',
					tooltipSuccessForeground: 'var(--color-contrast)',
				},
				lineNumbers: {
					foreground: 'var(--color-neutral)',
				},
			},
		}),
		mdx(),
		sitemap(),
		Compress(),
	],
	markdown: {
		rehypePlugins: [
			[
				rehypeSlug,
				{
					prefix: null,
				},
			],
			[
				rehypeExternalLinks,
				{
					rel: ['nofollow', 'noreferrer'],
					target: '_blank',
				},
			],
			[
				rehypeAutolinkHeadings,
				{
					behavior: 'after',
					content: [
						{
							type: 'element',
							tagName: 'span',
							children: [{ type: 'text', value: '#' }],
							properties: { ariaHidden: 'true' },
						},
						{
							type: 'element',
							tagName: 'span',
							children: [{ type: 'text', value: 'anchor' }],
							properties: { className: 'visually-hidden' },
						},
					],
					properties: {
						className: ['heading-link', 'hover'],
					},
				},
			],
			[
				function rehypeWrapHeadings() {
					return (tree) => {
						visit(tree, 'element', (node, index, parent) => {
							if (node.tagName && /^h[1-6]$/.test(node.tagName)) {
								const nextSibling = parent.children[index + 1];

								if (
									nextSibling &&
									nextSibling.type === 'element' &&
									nextSibling.tagName === 'a'
								) {
									const wrapper = {
										type: 'element',
										tagName: 'div',
										children: [node, nextSibling],
										properties: { className: ['heading-wrapper'] },
									};

									parent.children[index] = wrapper;
									parent.children.splice(index + 1, 1);
								}
							}
						});
					};
				},
			],
		],
		remarkPlugins: [
			function remarkReadingTime() {
				return function (tree, file) {
					const textOnPage = toString(tree);
					const timeToRead = readingTime(textOnPage);
					file.data.astro.frontmatter.minutesRead = timeToRead.text;
				};
			},
		],
	},
	build: {
		inlineStylesheets: 'always',
	},
	vite: {
		build: {
			target: browserslistToEsbuild(browserslist()),
			rollupOptions: {
				output: {
					manualChunks: (id) => {
						const chunkStrategies = [
							{
								matches: (id) => id.includes('three') && id.includes('core'),
								name: 'three-core',
							},
							{
								matches: (id) => id.includes('three') && id.includes('modules'),
								name: 'three-modules',
							},
							{
								matches: (id) => id.includes('three') && id.includes('examples'),
								name: 'three-examples',
							},
							{
								matches: (id) => id.includes('three'),
								name: 'three-misc',
							},
						];

						const matchedStrategy = chunkStrategies.find((strategy) =>
							strategy.matches(id),
						);

						return matchedStrategy ? matchedStrategy.name : null;
					},
				},
			},
		},
		css: {
			transformer: 'lightningcss',
		},
	},
	experimental: {
		contentIntellisense: true,
	},
});
