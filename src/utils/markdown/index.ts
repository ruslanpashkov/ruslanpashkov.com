import removeMarkdown from 'remove-markdown';

export const cleanSnippets = (markdown: string): string =>
	markdown
		.replace(/\{\/\* snippet:start \*\/\}[\s\S]*?\{\/\* snippet:end \*\/\}/g, '')
		.replace(/\n{3,}/g, '\n\n');

export const cleanNewlines = (text: string): string =>
	text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();

export const cleanContent = (markdown: string): string =>
	cleanNewlines(removeMarkdown(markdown.trim()));

export const clean = (markdown: string): string => cleanContent(cleanSnippets(markdown));
