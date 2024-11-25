import type { Article } from '@/types/Article';

export function sortArticlesByDate(articles: Article[]): Article[] {
	return [...articles].sort((firstArticle, secondArticle) => {
		const firstDate = new Date(firstArticle.data.publishedAt);
		const secondDate = new Date(secondArticle.data.publishedAt);

		return secondDate.getTime() - firstDate.getTime();
	});
}
