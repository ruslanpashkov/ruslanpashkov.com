import type { Article } from '@/types/Article';

export const sortByDate = (articles: Article[]): Article[] =>
	articles.toSorted((firstArticle, secondArticle) => {
		const firstDate = firstArticle.data.publishedAt;
		const secondDate = secondArticle.data.publishedAt;
		return secondDate.getTime() - firstDate.getTime();
	});
