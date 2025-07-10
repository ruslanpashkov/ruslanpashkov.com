import rehypeSlug from 'rehype-slug';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';
import type { AstroUserConfig } from 'astro';
import type { Root } from 'mdast';
import type { VFile } from 'vfile';

export const markdown: AstroUserConfig['markdown'] = {
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
				behavior: 'append',
				content: {
					children: [{ type: 'text', value: '#' }],
					tagName: 'span',
					type: 'element',
				},
				properties: {
					ariaHidden: 'true',
					className: ['heading-link', 'hover'],
					tabIndex: -1,
				},
			},
		],
	],
	remarkPlugins: [
		function remarkReadingTime() {
			return function (tree: Root, file: VFile) {
				const textOnPage = toString(tree);
				const readingTime = getReadingTime(textOnPage);
				file.data.astro!.frontmatter!.minutesRead = readingTime.text;
			};
		},
	],
};
