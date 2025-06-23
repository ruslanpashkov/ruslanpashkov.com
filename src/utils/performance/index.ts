export function debounce<T extends (...args: unknown[]) => void>(
	func: T,
	wait: number,
): (...args: Parameters<T>) => void {
	let timeout: number;

	return (...args: Parameters<T>) => {
		window.clearTimeout(timeout);
		timeout = window.setTimeout(() => func(...args), wait);
	};
}

export function throttle<T extends (...args: unknown[]) => void>(
	func: T,
	limit: number,
): (...args: Parameters<T>) => void {
	let inThrottle: boolean;

	return (...args: Parameters<T>) => {
		if (!inThrottle) {
			func(...args);
			inThrottle = true;
			window.setTimeout(() => (inThrottle = false), limit);
		}
	};
}
