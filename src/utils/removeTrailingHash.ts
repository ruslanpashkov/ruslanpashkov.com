export function removeTrailingHash(text: string): string {
	return text.replace(/\s*#\s*$/, '');
}
