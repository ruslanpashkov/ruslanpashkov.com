import { describe, expect, it } from 'vitest';
import { clean, cleanContent, cleanNewlines, cleanSnippets } from '@/utils/markdown';

describe('markdown utilities', () => {
	describe('cleanSnippets', () => {
		it('should remove snippet blocks from markdown', () => {
			const markdown = `
				# Title

				Some content here.

				{/* snippet:start */}
				This should be removed
				{/* snippet:end */}

				More content here.
			`;
			const result = cleanSnippets(markdown);
			expect(result).toContain('# Title');
			expect(result).toContain('Some content here.');
			expect(result).toContain('More content here.');
			expect(result).not.toContain('This should be removed');
			expect(result).not.toContain('{/* snippet:start */}');
			expect(result).not.toContain('{/* snippet:end */}');
		});

		it('should remove multiple snippet blocks', () => {
			const markdown = `
				{/* snippet:start */}
				First snippet
				{/* snippet:end */}

				Content

				{/* snippet:start */}
				Second snippet
				{/* snippet:end */}
			`;
			const result = cleanSnippets(markdown);
			expect(result).toContain('Content');
			expect(result).not.toContain('First snippet');
			expect(result).not.toContain('Second snippet');
		});

		it('should handle markdown without snippets', () => {
			const markdown = '# Title\n\nSome content here.';
			const result = cleanSnippets(markdown);
			expect(result).toBe(markdown);
		});

		it('should handle empty markdown', () => {
			const markdown = '';
			const result = cleanSnippets(markdown);
			expect(result).toBe('');
		});

		it('should reduce multiple newlines to double newlines', () => {
			const markdown = 'Line 1\n\n\n\nLine 2\n\n\nLine 3';
			const result = cleanSnippets(markdown);
			expect(result).toBe('Line 1\n\nLine 2\n\nLine 3');
		});
	});

	describe('cleanNewlines', () => {
		it('should replace multiple newlines with single space', () => {
			const text = 'Line 1\n\n\nLine 2\nLine 3';
			const result = cleanNewlines(text);
			expect(result).toBe('Line 1 Line 2 Line 3');
		});

		it('should replace multiple spaces with single space', () => {
			const text = 'Word1    Word2   Word3';
			const result = cleanNewlines(text);
			expect(result).toBe('Word1 Word2 Word3');
		});

		it('should trim whitespace', () => {
			const text = '  \n  Hello World  \n  ';
			const result = cleanNewlines(text);
			expect(result).toBe('Hello World');
		});

		it('should handle empty string', () => {
			const text = '';
			const result = cleanNewlines(text);
			expect(result).toBe('');
		});

		it('should handle string with only whitespace', () => {
			const text = '   \n\n   ';
			const result = cleanNewlines(text);
			expect(result).toBe('');
		});

		it('should handle single word', () => {
			const text = 'Hello';
			const result = cleanNewlines(text);
			expect(result).toBe('Hello');
		});
	});

	describe('cleanContent', () => {
		it('should remove markdown and clean content', () => {
			const markdown =
				'# Title\n\n**Bold text** and *italic text*.\n\n- List item 1\n- List item 2';
			const result = cleanContent(markdown);
			expect(result).toBe('Title Bold text and italic text. List item 1 List item 2');
		});

		it('should handle markdown with links', () => {
			const markdown = 'Check out [this link](https://example.com) for more info.';
			const result = cleanContent(markdown);
			expect(result).toBe('Check out this link for more info.');
		});

		it('should handle markdown with code blocks', () => {
			const markdown =
				'Here is some `code` and a code block:\n\n```javascript\nconsole.log("hello");\n```';
			const result = cleanContent(markdown);
			expect(result).toBe('Here is some code and a code block: console.log("hello");');
		});

		it('should trim whitespace from markdown', () => {
			const markdown = '  \n  # Title\n\n  Content  \n  ';
			const result = cleanContent(markdown);
			expect(result).toBe('Title Content');
		});

		it('should handle empty markdown', () => {
			const markdown = '';
			const result = cleanContent(markdown);
			expect(result).toBe('');
		});

		it('should handle markdown with only whitespace', () => {
			const markdown = '   \n\n   ';
			const result = cleanContent(markdown);
			expect(result).toBe('');
		});
	});

	describe('clean', () => {
		it('should clean snippets and content from markdown', () => {
			const markdown = `
				# Title

				{/* snippet:start */}
				Snippet content
				{/* snippet:end */}

				**Bold text** and regular text.

				{/* snippet:start */}
				Another snippet
				{/* snippet:end */}

				More content.
			`;
			const result = clean(markdown);
			expect(result).toBe('Title Bold text and regular text. More content.');
		});

		it('should handle markdown without snippets', () => {
			const markdown = '# Title\n\n**Bold text** and regular text.';
			const result = clean(markdown);
			expect(result).toBe('Title Bold text and regular text.');
		});

		it('should handle empty markdown', () => {
			const markdown = '';
			const result = clean(markdown);
			expect(result).toBe('');
		});

		it('should handle complex markdown with multiple elements', () => {
			const markdown = `
				# Main Title

				{/* snippet:start */}
				Code snippet here
				{/* snippet:end */}

				## Subtitle

				**Important text** with [a link](https://example.com).

				- List item 1
				- List item 2

				\`inline code\`

				{/* snippet:start */}
				Another code block
				{/* snippet:end */}

				Final paragraph.
			`;
			const result = clean(markdown);
			expect(result).toBe(
				'Main Title Subtitle Important text with a link. List item 1 List item 2 inline code Final paragraph.',
			);
		});
	});
});
