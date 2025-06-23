export function debounce<T extends (...args: unknown[]) => unknown>(
	func: T,
	wait: number,
): (...args: Parameters<T>) => ReturnType<T> | void {
	let timeout: number;

	return (...args: Parameters<T>): ReturnType<T> | void => {
		window.clearTimeout(timeout);

		if (wait === 0) {
			return func(...args) as ReturnType<T>;
		}

		timeout = window.setTimeout(() => func(...args), wait);
	};
}

export function throttle<T extends (...args: unknown[]) => unknown>(
	func: T,
	limit: number,
): (...args: Parameters<T>) => ReturnType<T> | void {
	let inThrottle = false;

	return (...args: Parameters<T>): ReturnType<T> | void => {
		if (!inThrottle) {
			const result = func(...args) as ReturnType<T>;
			inThrottle = true;

			if (limit === 0) {
				inThrottle = false;
			} else {
				window.setTimeout(() => (inThrottle = false), limit);
			}

			return result;
		}
	};
}
