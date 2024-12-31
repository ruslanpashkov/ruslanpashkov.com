import removeMarkdown from 'remove-markdown';

export function cleanContent(markdown: string): string {
	return removeMarkdown(markdown);
}
