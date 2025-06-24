import { describe, expect, it } from 'vitest';

import { formatDate, removeTrailingHash, shortenLanguage, slugify } from '@/utils/formatting';

describe('formatting utilities', () => {
	describe('slugify', () => {
		it('should convert text to URL-friendly slug', () => {
			const text = 'Hello World!';

			const result = slugify(text);

			expect(result).toBe('hello-world');
		});

		it('should handle text with special characters', () => {
			const text = 'Café & Résumé (2023)';

			const result = slugify(text);

			expect(result).toBe('cafe-resume-2023');
		});

		it('should handle text with multiple spaces and punctuation', () => {
			const text = '  Multiple   Spaces  &  Punctuation!!!  ';

			const result = slugify(text);

			expect(result).toBe('multiple-spaces-punctuation');
		});

		it('should handle text with numbers', () => {
			const text = 'Article 123: The Best of 2023';

			const result = slugify(text);

			expect(result).toBe('article-123-the-best-of-2023');
		});

		it('should handle text with accented characters', () => {
			const text = 'São Paulo - Brasil';

			const result = slugify(text);

			expect(result).toBe('sao-paulo-brasil');
		});

		it('should handle empty string', () => {
			const text = '';

			const result = slugify(text);

			expect(result).toBe('');
		});

		it('should handle text with only special characters', () => {
			const text = '!@#$%^&*()';

			const result = slugify(text);

			expect(result).toBe('');
		});

		it('should handle text with leading/trailing hyphens', () => {
			const text = '-Hello World-';

			const result = slugify(text);

			expect(result).toBe('hello-world');
		});
	});

	describe('removeTrailingHash', () => {
		it('should remove trailing hash from text', () => {
			const text = 'Hello World #';

			const result = removeTrailingHash(text);

			expect(result).toBe('Hello World');
		});

		it('should remove trailing hash and spaces', () => {
			const text = 'Hello World   #   ';

			const result = removeTrailingHash(text);

			expect(result).toBe('Hello World');
		});

		it('should handle text without trailing hash', () => {
			const text = 'Hello World';

			const result = removeTrailingHash(text);

			expect(result).toBe('Hello World');
		});

		it('should handle text with hash in the middle', () => {
			const text = 'Hello # World';

			const result = removeTrailingHash(text);

			expect(result).toBe('Hello # World');
		});

		it('should handle empty string', () => {
			const text = '';

			const result = removeTrailingHash(text);

			expect(result).toBe('');
		});

		it('should handle text with only hash and spaces', () => {
			const text = '   #   ';

			const result = removeTrailingHash(text);

			expect(result).toBe('');
		});
	});

	describe('shortenLanguage', () => {
		it('should shorten language code to first two characters', () => {
			const language = 'English';

			const result = shortenLanguage(language);

			expect(result).toBe('en');
		});

		it('should handle short language names', () => {
			const language = 'En';

			const result = shortenLanguage(language);

			expect(result).toBe('en');
		});

		it('should handle single character language', () => {
			const language = 'E';

			const result = shortenLanguage(language);

			expect(result).toBe('e');
		});

		it('should handle empty string', () => {
			const language = '';

			const result = shortenLanguage(language);

			expect(result).toBe('');
		});

		it('should handle language with mixed case', () => {
			const language = 'SPANISH';

			const result = shortenLanguage(language);

			expect(result).toBe('sp');
		});
	});

	describe('formatDate', () => {
		it('should format date string correctly', () => {
			const date = '2023-12-25';

			const result = formatDate(date);

			expect(result).toBe('December 25, 2023');
		});

		it('should handle ISO date string', () => {
			const date = '2023-12-25T10:30:00Z';

			const result = formatDate(date);

			expect(result).toBe('December 25, 2023');
		});

		it('should handle different date formats', () => {
			const date = '2023-01-01';

			const result = formatDate(date);

			expect(result).toBe('January 1, 2023');
		});

		it('should handle leap year date', () => {
			const date = '2024-02-29';

			const result = formatDate(date);

			expect(result).toBe('February 29, 2024');
		});

		it('should handle date with timezone', () => {
			const date = '2023-06-15T14:30:00-05:00';

			const result = formatDate(date);

			expect(result).toBe('June 15, 2023');
		});

		it('should handle invalid date gracefully', () => {
			const date = 'invalid-date';

			const result = formatDate(date);

			expect(result).toBe('Invalid Date');
		});
	});
});
