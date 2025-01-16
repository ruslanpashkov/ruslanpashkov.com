import { global } from '@/data/global';

export function generateTitle(title: string): string {
	return `${title} | ${global.author}`;
}
