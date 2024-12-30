import type { Link } from '@/types/Link.ts';

export const licenses: Link[] = [
	{
		label: 'Code',
		title: 'MIT',
		url: 'https://github.com/ruslanpashkov/ruslanpashkov.com/blob/main/LICENSE',
	},
	{
		label: 'Content',
		title: 'CC BY-NC-SA 4.0',
		url: 'https://github.com/ruslanpashkov/ruslanpashkov.com/blob/main/CC.md',
	},
	{
		label: 'Fonts',
		title: 'SIL OFL',
		url: 'https://github.com/ruslanpashkov/ruslanpashkov.com/blob/main/OFL.md',
	},
];

export const copyright = {
	licenses,
	year: 2024,
};
