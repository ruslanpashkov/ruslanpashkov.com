export class FormattingManager {
	static formatDate(date: string): string {
		return new Date(date).toLocaleDateString('en-US', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		});
	}

	static removeTrailingHash(text: string): string {
		return text.replace(/\s*#\s*$/, '');
	}

	static shortenLanguage(language: string): string {
		return language.substring(0, 2).toLowerCase();
	}

	static slugify(text: string): string {
		return text
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
	}
}
