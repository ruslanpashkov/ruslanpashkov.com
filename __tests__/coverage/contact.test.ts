import { describe, expect, it } from 'vitest';

import type { Contact } from '@/types/Contact';

import {
	findEmail,
	findEmailURL,
	findOnlineProfiles,
	findOnlineProfilesURLs,
} from '@/utils/contact';

describe('contact utilities', () => {
	const mockContacts: Contact[] = [
		{
			icon: 'email',
			label: 'Email',
			title: 'test@example.com',
			url: 'mailto:test@example.com',
		},
		{
			icon: 'linkedin',
			label: 'LinkedIn',
			title: '/in/testuser',
			url: 'https://linkedin.com/in/testuser',
		},
		{
			icon: 'github',
			label: 'GitHub',
			title: 'github.com/testuser',
			url: 'https://github.com/testuser',
		},
		{
			icon: 'twitter',
			label: 'Twitter',
			title: '@testuser',
			url: 'https://twitter.com/testuser',
		},
	];

	describe('findEmail', () => {
		it('should find email contact', () => {
			const contacts = [...mockContacts];
			const result = findEmail(contacts);
			expect(result).toEqual({
				icon: 'email',
				label: 'Email',
				title: 'test@example.com',
				url: 'mailto:test@example.com',
			});
		});

		it('should return undefined when no email contact exists', () => {
			const contacts: Contact[] = [
				{
					icon: 'linkedin',
					label: 'LinkedIn',
					title: '/in/testuser',
					url: 'https://linkedin.com/in/testuser',
				},
			];
			const result = findEmail(contacts);
			expect(result).toBeUndefined();
		});

		it('should handle empty contacts array', () => {
			const contacts: Contact[] = [];
			const result = findEmail(contacts);
			expect(result).toBeUndefined();
		});
	});

	describe('findEmailURL', () => {
		it('should return email URL', () => {
			const contacts = [...mockContacts];
			const result = findEmailURL(contacts);
			expect(result).toBe('mailto:test@example.com');
		});

		it('should throw error when no email contact exists', () => {
			const contacts: Contact[] = [
				{
					icon: 'linkedin',
					label: 'LinkedIn',
					title: '/in/testuser',
					url: 'https://linkedin.com/in/testuser',
				},
			];
			expect(() => findEmailURL(contacts)).toThrow();
		});
	});

	describe('findOnlineProfiles', () => {
		it('should find all online profiles excluding email', () => {
			const contacts = [...mockContacts];
			const result = findOnlineProfiles(contacts);
			expect(result).toHaveLength(3);
			expect(result).toEqual([
				{
					icon: 'linkedin',
					label: 'LinkedIn',
					title: '/in/testuser',
					url: 'https://linkedin.com/in/testuser',
				},
				{
					icon: 'github',
					label: 'GitHub',
					title: 'github.com/testuser',
					url: 'https://github.com/testuser',
				},
				{
					icon: 'twitter',
					label: 'Twitter',
					title: '@testuser',
					url: 'https://twitter.com/testuser',
				},
			]);
		});

		it('should return empty array when only email contact exists', () => {
			const contacts: Contact[] = [
				{
					icon: 'email',
					label: 'Email',
					title: 'test@example.com',
					url: 'mailto:test@example.com',
				},
			];
			const result = findOnlineProfiles(contacts);
			expect(result).toEqual([]);
		});

		it('should handle empty contacts array', () => {
			const contacts: Contact[] = [];
			const result = findOnlineProfiles(contacts);
			expect(result).toEqual([]);
		});

		it('should handle contacts with different label cases', () => {
			const contacts: Contact[] = [
				{
					icon: 'email',
					label: 'EMAIL',
					title: 'test@example.com',
					url: 'mailto:test@example.com',
				},
				{
					icon: 'linkedin',
					label: 'LinkedIn',
					title: '/in/testuser',
					url: 'https://linkedin.com/in/testuser',
				},
			];
			const result = findOnlineProfiles(contacts);
			expect(result).toHaveLength(1);
			expect(result[0].label).toBe('LinkedIn');
		});
	});

	describe('findOnlineProfilesURLs', () => {
		it('should return URLs of all online profiles', () => {
			const contacts = [...mockContacts];
			const result = findOnlineProfilesURLs(contacts);
			expect(result).toHaveLength(3);
			expect(result).toEqual([
				'https://linkedin.com/in/testuser',
				'https://github.com/testuser',
				'https://twitter.com/testuser',
			]);
		});

		it('should return empty array when no online profiles exist', () => {
			const contacts: Contact[] = [
				{
					icon: 'email',
					label: 'Email',
					title: 'test@example.com',
					url: 'mailto:test@example.com',
				},
			];
			const result = findOnlineProfilesURLs(contacts);
			expect(result).toEqual([]);
		});

		it('should handle empty contacts array', () => {
			const contacts: Contact[] = [];
			const result = findOnlineProfilesURLs(contacts);
			expect(result).toEqual([]);
		});
	});
});
