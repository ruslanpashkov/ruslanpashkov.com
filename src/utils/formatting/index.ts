export const slugify = (text: string): string =>
	text
		.normalize('NFD')
		.replace(/\p{Mark}/gu, '')
		.toLowerCase()
		.replace(/[^\p{L}\p{N}]+/gu, '-')
		.replace(/^-+|-+$/g, '');

export const shortenLanguage = (language: string): string => language.substring(0, 2).toLowerCase();

export const formatDate = (date: string): string =>
	new Date(date).toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
