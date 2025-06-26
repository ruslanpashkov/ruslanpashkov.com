import { describe, expect, it } from 'vitest';

import type { Article } from '@/types/Article';

import { sortByDate } from '@/utils/article';

describe('article utilities', () => {
	describe('sortByDate', () => {
		it('should sort articles by published date in descending order', () => {
			const articles: Article[] = [
				{
					body: 'content1',
					collection: 'blog',
					data: {
						categories: ['test'],
						description: 'Test article 1',
						publishedAt: '2025-01-01',
						slug: 'test-1',
						title: 'Test Article 1',
						topic: 'Testing',
					},
					id: 'test-1',
				},
				{
					body: 'content2',
					collection: 'blog',
					data: {
						categories: ['test'],
						description: 'Test article 2',
						publishedAt: '2025-01-03',
						slug: 'test-2',
						title: 'Test Article 2',
						topic: 'Testing',
					},
					id: 'test-2',
				},
				{
					body: 'content3',
					collection: 'blog',
					data: {
						categories: ['test'],
						description: 'Test article 3',
						publishedAt: '2025-01-02',
						slug: 'test-3',
						title: 'Test Article 3',
						topic: 'Testing',
					},
					id: 'test-3',
				},
			];
			const result = sortByDate(articles);
			expect(result).toHaveLength(3);
			expect(result[0].data.publishedAt).toBe('2025-01-03');
			expect(result[1].data.publishedAt).toBe('2025-01-02');
			expect(result[2].data.publishedAt).toBe('2025-01-01');
		});

		it('should handle empty array', () => {
			const articles: Article[] = [];
			const result = sortByDate(articles);
			expect(result).toEqual([]);
		});

		it('should handle single article', () => {
			const articles: Article[] = [
				{
					body: 'content',
					collection: 'blog',
					data: {
						categories: ['test'],
						description: 'Test article',
						publishedAt: '2025-01-01',
						slug: 'test',
						title: 'Test Article',
						topic: 'Testing',
					},
					id: 'test',
				},
			];
			const result = sortByDate(articles);
			expect(result).toHaveLength(1);
			expect(result[0].data.publishedAt).toBe('2025-01-01');
		});

		it('should handle articles with same date', () => {
			const articles: Article[] = [
				{
					body: 'content1',
					collection: 'blog',
					data: {
						categories: ['test'],
						description: 'Test article 1',
						publishedAt: '2025-01-01',
						slug: 'test-1',
						title: 'Test Article 1',
						topic: 'Testing',
					},
					id: 'test-1',
				},
				{
					body: 'content2',
					collection: 'blog',
					data: {
						categories: ['test'],
						description: 'Test article 2',
						publishedAt: '2025-01-01',
						slug: 'test-2',
						title: 'Test Article 2',
						topic: 'Testing',
					},
					id: 'test-2',
				},
			];
			const result = sortByDate(articles);
			expect(result).toHaveLength(2);
			expect(result[0].data.publishedAt).toBe('2025-01-01');
			expect(result[1].data.publishedAt).toBe('2025-01-01');
		});

		it('should handle different date formats', () => {
			const articles: Article[] = [
				{
					body: 'content1',
					collection: 'blog',
					data: {
						categories: ['test'],
						description: 'Test article 1',
						publishedAt: '2024-12-31T23:59:59Z',
						slug: 'test-1',
						title: 'Test Article 1',
						topic: 'Testing',
					},
					id: 'test-1',
				},
				{
					body: 'content2',
					collection: 'blog',
					data: {
						categories: ['test'],
						description: 'Test article 2',
						publishedAt: '2025-01-01T00:00:00Z',
						slug: 'test-2',
						title: 'Test Article 2',
						topic: 'Testing',
					},
					id: 'test-2',
				},
			];
			const result = sortByDate(articles);
			expect(result).toHaveLength(2);
			expect(result[0].data.publishedAt).toBe('2025-01-01T00:00:00Z');
			expect(result[1].data.publishedAt).toBe('2024-12-31T23:59:59Z');
		});

		it('should not mutate the original array', () => {
			const articles: Article[] = [
				{
					body: 'content1',
					collection: 'blog',
					data: {
						categories: ['test'],
						description: 'Test article 1',
						publishedAt: '2025-01-01',
						slug: 'test-1',
						title: 'Test Article 1',
						topic: 'Testing',
					},
					id: 'test-1',
				},
				{
					body: 'content2',
					collection: 'blog',
					data: {
						categories: ['test'],
						description: 'Test article 2',
						publishedAt: '2025-01-03',
						slug: 'test-2',
						title: 'Test Article 2',
						topic: 'Testing',
					},
					id: 'test-2',
				},
			];
			const originalArticles = [...articles];
			sortByDate(articles);
			expect(articles).toEqual(originalArticles);
		});
	});
});
