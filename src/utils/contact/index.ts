import type { Contact } from '@/types/Contact';

export const findEmail = (contacts: Contact[]): Contact =>
	contacts.find((contact) => contact.label === 'Email') as Contact;

export const findEmailURL = (contacts: Contact[]): string => findEmail(contacts).url;

export const findOnlineProfiles = (contacts: Contact[]): Contact[] =>
	contacts.filter((contact) => contact.label !== 'Email');

export const findOnlineProfilesURLs = (contacts: Contact[]): string[] =>
	findOnlineProfiles(contacts).map((contact) => contact.url);
