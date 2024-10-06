import type { Article } from '@/types/Article';

export function getSortedArticles(articles: Article[]): Article[] {
	return articles.toSorted((firstArticle, secondArticle) => {
		const firstDate = new Date(firstArticle.data.pubDate);
		const secondDate = new Date(secondArticle.data.pubDate);

		return secondDate.getTime() - firstDate.getTime();
	});
}
