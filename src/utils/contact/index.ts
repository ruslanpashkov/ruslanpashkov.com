import type { Contact } from '@/types/Contact';

export class ContactManager {
	static findEmail(contacts: Contact[]): Contact {
		return contacts.find((contact) => contact.label === 'Email')!;
	}

	static findEmailURL(contacts: Contact[]): string {
		return this.findEmail(contacts).url;
	}

	static findOnlineProfiles(contacts: Contact[]): Contact[] {
		return contacts.filter((contact) => contact.label !== 'Email');
	}

	static findOnlineProfilesURLs(contacts: Contact[]): string[] {
		return this.findOnlineProfiles(contacts).map((contact) => contact.url);
	}
}
