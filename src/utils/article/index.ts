import type { Article } from '@/types/Article';

export class ArticleManager {
	static sortByDate(articles: Article[]): Article[] {
		return articles.toSorted((firstArticle, secondArticle) => {
			const firstDate = new Date(firstArticle.data.publishedAt);
			const secondDate = new Date(secondArticle.data.publishedAt);

			return secondDate.getTime() - firstDate.getTime();
		});
	}
}
