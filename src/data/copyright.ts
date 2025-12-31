import type { Link } from '@/types/Link.ts';

export const licenses: Link[] = [
	{
		title: 'MIT',
		url: 'https://github.com/ruslanpashkov/ruslanpashkov.com/blob/main/LICENSE',
		label: 'Code',
	},
	{
		title: 'CC BY-NC-SA 4.0',
		url: 'https://github.com/ruslanpashkov/ruslanpashkov.com/blob/main/CC.md',
		label: 'Content',
	},
	{
		title: 'SIL OFL',
		url: 'https://github.com/ruslanpashkov/ruslanpashkov.com/blob/main/OFL.md',
		label: 'Fonts',
	},
];

export const copyright = {
	licenses,
	year: 2026,
} as const;
