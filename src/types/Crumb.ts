import type { Link } from '@/types/Link';

export interface Crumb extends Link {
	current?: boolean;
}
