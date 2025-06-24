import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { debounce, throttle } from '@/utils/performance';

describe('performance utilities', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('debounce', () => {
		it('should call function only once after delay', () => {
			const mockFn = vi.fn();
			const debouncedFn = debounce(mockFn, 100);

			debouncedFn();
			debouncedFn();
			debouncedFn();

			expect(mockFn).not.toHaveBeenCalled();

			// Fast-forward time
			vi.advanceTimersByTime(100);

			expect(mockFn).toHaveBeenCalledTimes(1);
		});

		it('should pass arguments to the debounced function', () => {
			const mockFn = vi.fn();
			const debouncedFn = debounce(mockFn, 100);

			debouncedFn('arg1', 'arg2');

			// Fast-forward time
			vi.advanceTimersByTime(100);

			expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
		});

		it('should reset timer on each call', () => {
			const mockFn = vi.fn();
			const debouncedFn = debounce(mockFn, 100);

			debouncedFn();

			// Advance time but not enough to trigger
			vi.advanceTimersByTime(50);
			expect(mockFn).not.toHaveBeenCalled();

			// Call again, should reset timer
			debouncedFn();

			// Advance time again
			vi.advanceTimersByTime(50);
			expect(mockFn).not.toHaveBeenCalled();

			// Advance time to trigger
			vi.advanceTimersByTime(50);

			expect(mockFn).toHaveBeenCalledTimes(1);
		});

		it('should handle zero delay', () => {
			const mockFn = vi.fn();
			const debouncedFn = debounce(mockFn, 0);

			debouncedFn();

			expect(mockFn).toHaveBeenCalledTimes(1);
		});

		it('should handle multiple calls with different arguments', () => {
			const mockFn = vi.fn();
			const debouncedFn = debounce(mockFn, 100);

			debouncedFn('first');
			debouncedFn('second');
			debouncedFn('third');

			// Fast-forward time
			vi.advanceTimersByTime(100);

			expect(mockFn).toHaveBeenCalledTimes(1);
			expect(mockFn).toHaveBeenCalledWith('third');
		});

		it('should handle function that returns values', () => {
			const mockFn = vi.fn().mockReturnValue('result');
			const debouncedFn = debounce(mockFn, 100);

			const result1 = debouncedFn();
			const result2 = debouncedFn();

			// Fast-forward time
			vi.advanceTimersByTime(100);

			expect(result1).toBeUndefined();
			expect(result2).toBeUndefined();
			expect(mockFn).toHaveBeenCalledTimes(1);
		});
	});

	describe('throttle', () => {
		it('should call function immediately on first call', () => {
			const mockFn = vi.fn();
			const throttledFn = throttle(mockFn, 100);

			throttledFn();

			expect(mockFn).toHaveBeenCalledTimes(1);
		});

		it('should throttle subsequent calls within limit', () => {
			const mockFn = vi.fn();
			const throttledFn = throttle(mockFn, 100);

			throttledFn(); // First call - should execute immediately
			throttledFn(); // Second call - should be throttled
			throttledFn(); // Third call - should be throttled

			expect(mockFn).toHaveBeenCalledTimes(1);

			// Advance time to allow next call
			vi.advanceTimersByTime(100);

			throttledFn(); // Should execute now

			expect(mockFn).toHaveBeenCalledTimes(2);
		});

		it('should pass arguments to the throttled function', () => {
			const mockFn = vi.fn();
			const throttledFn = throttle(mockFn, 100);

			throttledFn('arg1', 'arg2');

			expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
		});

		it('should allow calls after throttle period', () => {
			const mockFn = vi.fn();
			const throttledFn = throttle(mockFn, 100);

			throttledFn(); // First call
			throttledFn(); // Throttled

			// Advance time past throttle period
			vi.advanceTimersByTime(100);

			throttledFn(); // Should execute now
			throttledFn(); // Should be throttled again

			expect(mockFn).toHaveBeenCalledTimes(2);

			// Advance time again
			vi.advanceTimersByTime(100);

			throttledFn(); // Should execute now

			expect(mockFn).toHaveBeenCalledTimes(3);
		});

		it('should handle zero limit', () => {
			const mockFn = vi.fn();
			const throttledFn = throttle(mockFn, 0);

			throttledFn();
			throttledFn();
			throttledFn();

			expect(mockFn).toHaveBeenCalledTimes(3);
		});

		it('should handle function that returns values', () => {
			const mockFn = vi.fn().mockReturnValue('result');
			const throttledFn = throttle(mockFn, 100);

			const result1 = throttledFn();
			const result2 = throttledFn();

			expect(result1).toBe('result');
			expect(result2).toBeUndefined();
			expect(mockFn).toHaveBeenCalledTimes(1);
		});

		it('should handle rapid calls with different arguments', () => {
			const mockFn = vi.fn();
			const throttledFn = throttle(mockFn, 100);

			throttledFn('first');
			throttledFn('second');
			throttledFn('third');

			expect(mockFn).toHaveBeenCalledTimes(1);
			expect(mockFn).toHaveBeenCalledWith('first');

			// Advance time
			vi.advanceTimersByTime(100);

			throttledFn('fourth');

			expect(mockFn).toHaveBeenCalledTimes(2);
			expect(mockFn).toHaveBeenCalledWith('fourth');
		});

		it('should handle edge case of exactly throttle limit', () => {
			const mockFn = vi.fn();
			const throttledFn = throttle(mockFn, 100);

			throttledFn(); // First call
			throttledFn(); // Throttled

			// Advance time to exactly the limit
			vi.advanceTimersByTime(100);

			throttledFn(); // Should execute now

			expect(mockFn).toHaveBeenCalledTimes(2);
		});
	});
});
