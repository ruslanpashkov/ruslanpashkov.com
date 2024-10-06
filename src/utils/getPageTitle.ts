import { global } from '@/data/global';

export function getPageTitle(title: string): string {
	return `${title} | ${global.author}`;
}
