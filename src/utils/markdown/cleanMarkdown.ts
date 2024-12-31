import { cleanContent } from '@/utils/markdown/cleanContent.ts';
import { cleanSnippets } from '@/utils/markdown/cleanSnippets.ts';

export function cleanMarkdown(markdown: string): string {
	return cleanContent(cleanSnippets(markdown));
}
