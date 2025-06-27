import { describe, expect, it } from 'vitest';
import { categorize, filterByType, sortByType } from '@/utils/project';
import type { Project, ProjectType } from '@/types/Project';

describe('project utilities', () => {
	const mockProjects: Project[] = [
		{
			description: 'A utility project',
			label: 'Utility Project',
			tags: ['utility', 'tool'],
			title: 'Utility Project',
			type: 'Utilities',
			url: 'https://example.com/utility',
		},
		{
			description: 'A web showcase',
			label: 'Web Showcase',
			tags: ['web', 'showcase'],
			title: 'Web Showcase',
			type: 'Web Showcases',
			url: 'https://example.com/showcase',
		},
		{
			description: 'A developer tool',
			label: 'Developer Tool',
			tags: ['dev', 'tool'],
			title: 'Developer Tool',
			type: 'Developer Tools',
			url: 'https://example.com/devtool',
		},
		{
			description: 'Another web showcase',
			label: 'Another Web Showcase',
			tags: ['web', 'showcase'],
			title: 'Another Web Showcase',
			type: 'Web Showcases',
			url: 'https://example.com/showcase2',
		},
	];

	describe('sortByType', () => {
		it('should sort projects by type according to projectTypes order', () => {
			const projects = [...mockProjects];
			const result = sortByType(projects);
			expect(result).toHaveLength(4);
			expect(result[0].type).toBe('Web Showcases');
			expect(result[1].type).toBe('Web Showcases');
			expect(result[2].type).toBe('Utilities');
			expect(result[3].type).toBe('Developer Tools');
		});

		it('should handle empty array', () => {
			const projects: Project[] = [];
			const result = sortByType(projects);
			expect(result).toEqual([]);
		});

		it('should handle single project', () => {
			const projects: Project[] = [mockProjects[0]];
			const result = sortByType(projects);
			expect(result).toHaveLength(1);
			expect(result[0]).toEqual(mockProjects[0]);
		});

		it('should not mutate the original array', () => {
			const projects = [...mockProjects];
			const originalProjects = [...projects];
			sortByType(projects);
			expect(projects).toEqual(originalProjects);
		});

		it('should handle projects with same type', () => {
			const projects: Project[] = [
				{
					description: 'First web showcase',
					label: 'First Web Showcase',
					tags: ['web'],
					title: 'First Web Showcase',
					type: 'Web Showcases',
					url: 'https://example.com/first',
				},
				{
					description: 'Second web showcase',
					label: 'Second Web Showcase',
					tags: ['web'],
					title: 'Second Web Showcase',
					type: 'Web Showcases',
					url: 'https://example.com/second',
				},
			];
			const result = sortByType(projects);
			expect(result).toHaveLength(2);
			expect(result[0].type).toBe('Web Showcases');
			expect(result[1].type).toBe('Web Showcases');
		});
	});

	describe('filterByType', () => {
		it('should filter projects by specified type', () => {
			const projects = [...mockProjects];
			const type: ProjectType = 'Web Showcases';
			const result = filterByType(projects, type);
			expect(result).toHaveLength(2);
			expect(result.every((project) => project.type === 'Web Showcases')).toBe(true);
		});

		it('should return empty array when no projects match type', () => {
			const projects = [...mockProjects];
			const type: ProjectType = 'Web Showcases';
			const filteredProjects = projects.filter((project) => project.type !== 'Web Showcases');
			const result = filterByType(filteredProjects, type);
			expect(result).toEqual([]);
		});

		it('should handle empty projects array', () => {
			const projects: Project[] = [];
			const type: ProjectType = 'Web Showcases';
			const result = filterByType(projects, type);
			expect(result).toEqual([]);
		});

		it('should handle all project types', () => {
			const projects = [...mockProjects];
			const webShowcases = filterByType(projects, 'Web Showcases');
			const utilities = filterByType(projects, 'Utilities');
			const developerTools = filterByType(projects, 'Developer Tools');
			expect(webShowcases).toHaveLength(2);
			expect(utilities).toHaveLength(1);
			expect(developerTools).toHaveLength(1);
		});

		it('should not mutate the original array', () => {
			const projects = [...mockProjects];
			const originalProjects = [...projects];
			const type: ProjectType = 'Web Showcases';
			filterByType(projects, type);
			expect(projects).toEqual(originalProjects);
		});
	});

	describe('categorize', () => {
		it('should categorize projects by type', () => {
			const projects = [...mockProjects];
			const result = categorize(projects);
			expect(result).toHaveProperty('Web Showcases');
			expect(result).toHaveProperty('Utilities');
			expect(result).toHaveProperty('Developer Tools');
			expect(result['Web Showcases']).toHaveLength(2);
			expect(result['Utilities']).toHaveLength(1);
			expect(result['Developer Tools']).toHaveLength(1);
		});

		it('should handle empty projects array', () => {
			const projects: Project[] = [];
			const result = categorize(projects);
			expect(result['Web Showcases']).toEqual([]);
			expect(result['Utilities']).toEqual([]);
			expect(result['Developer Tools']).toEqual([]);
		});

		it('should handle projects with only one type', () => {
			const projects: Project[] = [
				{
					description: 'A web showcase',
					label: 'Web Showcase',
					tags: ['web'],
					title: 'Web Showcase',
					type: 'Web Showcases',
					url: 'https://example.com/showcase',
				},
				{
					description: 'Another web showcase',
					label: 'Another Web Showcase',
					tags: ['web'],
					title: 'Another Web Showcase',
					type: 'Web Showcases',
					url: 'https://example.com/showcase2',
				},
			];
			const result = categorize(projects);
			expect(result['Web Showcases']).toHaveLength(2);
			expect(result['Utilities']).toEqual([]);
			expect(result['Developer Tools']).toEqual([]);
		});

		it('should accept custom types array', () => {
			const projects = [...mockProjects];
			const customTypes: readonly ProjectType[] = ['Utilities', 'Developer Tools'];
			const result = categorize(projects, customTypes);
			expect(result).toHaveProperty('Utilities');
			expect(result).toHaveProperty('Developer Tools');
			expect(result).not.toHaveProperty('Web Showcases');
			expect(result['Utilities']).toHaveLength(1);
			expect(result['Developer Tools']).toHaveLength(1);
		});

		it('should handle empty types array', () => {
			const projects = [...mockProjects];
			const customTypes: readonly ProjectType[] = [];
			const result = categorize(projects, customTypes);
			expect(result).toEqual({});
		});

		it('should not mutate the original array', () => {
			const projects = [...mockProjects];
			const originalProjects = [...projects];
			categorize(projects);
			expect(projects).toEqual(originalProjects);
		});

		it('should handle types that have no matching projects', () => {
			const projects: Project[] = [
				{
					description: 'A utility project',
					label: 'Utility Project',
					tags: ['utility'],
					title: 'Utility Project',
					type: 'Utilities',
					url: 'https://example.com/utility',
				},
			];
			const result = categorize(projects);
			expect(result['Utilities']).toHaveLength(1);
			expect(result['Web Showcases']).toEqual([]);
			expect(result['Developer Tools']).toEqual([]);
		});
	});
});
