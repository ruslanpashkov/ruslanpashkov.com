import type { Contact } from '@/types/Contact';

export const contacts: Contact[] = [
	{
		title: 'hi@ruslanpashkov.com',
		url: 'mailto:hi@ruslanpashkov.com',
		label: 'Email',
		icon: 'email',
	},
	{
		title: '@ruslanpashkov.com',
		url: 'https://bsky.app/profile/ruslanpashkov.com',
		label: 'Bluesky',
		icon: 'bluesky',
	},
	{
		title: '@ruslanpashkov',
		url: 'https://mastodon.social/@ruslanpashkov',
		label: 'Mastodon',
		icon: 'mastodon',
	},
	{
		title: '/in/ruslanpashkov',
		url: 'https://www.linkedin.com/in/ruslanpashkov',
		label: 'LinkedIn',
		icon: 'linkedin',
	},
	{
		title: 't.me/ruslanpashkov',
		url: 'https://t.me/ruslanpashkov',
		label: 'Telegram',
		icon: 'telegram',
	},
];
