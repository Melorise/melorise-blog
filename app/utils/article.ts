/**
 * Query the article collection directly
 */
export const queryArticleCollection = () => queryCollection('article');

export const queryArticlesByCategory = (
    category?: string,
    limit: number = 0,
    filters?: Array<{ key: string; value: string }>
) => {
    let q = queryArticleCollection()
        .select('path', 'title', 'date', 'categories')
        .order('date', 'DESC')
        .limit(limit);

    // 处理分类过滤
    if (category && category !== 'all') {
        // 使用 categories 字段进行分类过滤，而不是路径
        q = q.where('categories', 'LIKE', `%${category}%`);
    }

    // 应用额外过滤条件
    if (filters) {
        for (const filter of filters) {
            q = q.where(filter.key, 'LIKE', filter.value);
        }
    }

    return () => q.all();
};

/**
 * Query all articles from the article collection
 * @param limit - Optional limit for number of results
 * @param filters - Optional additional filters
 * @returns Function that returns all articles matching the criteria
 */
export const queryAllArticles = (
    limit: number = 0,
    filters?: Array<{ key: string; value: string }>
) => {
    let q = queryArticleCollection()
        .select('path', 'title', 'date', 'categories')
        .order('date', 'DESC')
        .limit(limit);

    if (filters) {
        for (const filter of filters) {
            q = q.where(filter.key, 'LIKE', filter.value);
        }
    }

    return () => q.all();
};