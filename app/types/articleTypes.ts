const ArticleMap = {
    'article': 'article',
} as const;

export const convertToArticlePath = (path: ArticlePath) => ArticleMap[path];
export type ArticlePath = keyof typeof ArticleMap;
