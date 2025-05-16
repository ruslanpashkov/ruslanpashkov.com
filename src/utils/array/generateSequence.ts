export const generateSequence = (
	length: number,
	startFrom: number = 1,
	step: number = 1,
): number[] => {
	return Array.from({ length }, (_, index) => startFrom + index * step);
};
