import removeMarkdown from 'remove-markdown';

export const cleanSnippets = (markdown: string): string => {
	const startMarker = '{/* snippet:start */}';
	const endMarker = '{/* snippet:end */}';

	const startIndex = markdown.indexOf(startMarker);
	const endIndex = markdown.indexOf(endMarker);

	if (startIndex === -1 || endIndex === -1) {
		return markdown;
	}

	const beforeImports = markdown.substring(0, startIndex);
	const afterImports = markdown.substring(endIndex + endMarker.length);

	return (beforeImports + afterImports).replace(/\n{3,}/g, '\n\n');
};

export const cleanContent = (markdown: string): string => removeMarkdown(markdown);

export const clean = (markdown: string): string => cleanContent(cleanSnippets(markdown));
