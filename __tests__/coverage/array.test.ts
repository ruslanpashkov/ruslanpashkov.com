import { describe, expect, it } from 'vitest';

import { generateSequence } from '@/utils/array/generateSequence';

describe('array utilities', () => {
	describe('generateSequence', () => {
		it('should generate a sequence with default parameters', () => {
			const length = 5;

			const result = generateSequence(length);

			expect(result).toEqual([1, 2, 3, 4, 5]);
		});

		it('should generate a sequence with custom start value', () => {
			const length = 4;
			const startFrom = 10;

			const result = generateSequence(length, startFrom);

			expect(result).toEqual([10, 11, 12, 13]);
		});

		it('should generate a sequence with custom step', () => {
			const length = 5;
			const startFrom = 0;
			const step = 2;

			const result = generateSequence(length, startFrom, step);

			expect(result).toEqual([0, 2, 4, 6, 8]);
		});

		it('should generate a sequence with negative step', () => {
			const length = 4;
			const startFrom = 10;
			const step = -2;

			const result = generateSequence(length, startFrom, step);

			expect(result).toEqual([10, 8, 6, 4]);
		});

		it('should generate an empty sequence when length is 0', () => {
			const length = 0;

			const result = generateSequence(length);

			expect(result).toEqual([]);
		});

		it('should generate a single element sequence', () => {
			const length = 1;
			const startFrom = 42;

			const result = generateSequence(length, startFrom);

			expect(result).toEqual([42]);
		});

		it('should generate a sequence with decimal step', () => {
			const length = 4;
			const startFrom = 0;
			const step = 0.5;

			const result = generateSequence(length, startFrom, step);

			expect(result).toEqual([0, 0.5, 1, 1.5]);
		});

		it('should generate a sequence with negative start value', () => {
			const length = 3;
			const startFrom = -5;

			const result = generateSequence(length, startFrom);

			expect(result).toEqual([-5, -4, -3]);
		});

		it('should generate a large sequence', () => {
			const length = 1000;

			const result = generateSequence(length);

			expect(result).toHaveLength(1000);
			expect(result[0]).toBe(1);
			expect(result[999]).toBe(1000);
			expect(result[499]).toBe(500);
		});
	});
});
