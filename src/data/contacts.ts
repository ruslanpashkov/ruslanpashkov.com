import type { Contact } from '@/types/Contact';

export const contacts: Contact[] = [
	{
		icon: 'email',
		label: 'Email',
		title: 'hi@ruslanpashkov.com',
		url: 'mailto:hi@ruslanpashkov.com',
	},
	{
		icon: 'bluesky',
		label: 'Bluesky',
		title: '@ruslanpashkov.com',
		url: 'https://bsky.app/profile/ruslanpashkov.com',
	},
	{
		icon: 'mastodon',
		label: 'Mastodon',
		title: '@ruslanpashkov',
		url: 'https://mastodon.social/@ruslanpashkov',
	},
	{
		icon: 'linkedin',
		label: 'LinkedIn',
		title: '/in/ruslanpashkov',
		url: 'https://www.linkedin.com/in/ruslanpashkov',
	},
	{
		icon: 'telegram',
		label: 'Telegram',
		title: 't.me/ruslanpashkov',
		url: 'https://t.me/ruslanpashkov',
	},
];
