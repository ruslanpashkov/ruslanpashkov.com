import type { Article } from '@/types/Article';

export const sortByDate = (articles: Article[]): Article[] =>
	articles.toSorted((firstArticle, secondArticle) => {
		const firstDate = new Date(firstArticle.data.publishedAt);
		const secondDate = new Date(secondArticle.data.publishedAt);
		return secondDate.getTime() - firstDate.getTime();
	});
