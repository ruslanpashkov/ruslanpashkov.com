import { global } from '@/data/global';

export const generateTitle = (title: string): string => `${title} — ${global.author}`;
