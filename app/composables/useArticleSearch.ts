import MiniSearch from 'minisearch';
import type { Section } from '@nuxt/content';
import {
  computed,
  ref,
  toValue,
  type MaybeRefOrGetter
} from 'vue';

export type ArticleSearchSection = Section & {
  date?: string | Date;
};

export type ArticleSearchResult = {
  id: string;
  title: string;
  articleTitle: string;
  breadcrumb: string[];
  content: string;
  date?: string | Date;
  score: number;
};

export type ArticleSearchHighlightPart = {
  text: string;
  matched: boolean;
};

type StoredArticleSearchResult = ArticleSearchSection & {
  score: number;
};

const HAN_RUN = /^\p{Script=Han}+$/u;
const SEARCH_PARTS = /\p{Script=Han}+|[\p{L}\p{N}]+/gu;
const RESULT_LIMIT = 30;

/**
 * Splits Chinese text into single characters and adjacent bigrams, while
 * keeping Latin words and numbers whole. MiniSearch uses this for both
 * indexing and querying, so contiguous Chinese text remains searchable.
 */
export const tokenizeArticleSearchText = (text: string) => {
  const parts = text
    .normalize('NFKC')
    .toLocaleLowerCase()
    .match(SEARCH_PARTS) ?? [];

  return parts.flatMap((part) => {
    if (!HAN_RUN.test(part)) return [part];

    const characters = Array.from(part);
    const bigrams = characters.slice(0, -1).map((character, index) =>
      `${character}${characters[index + 1]}`
    );

    return [...characters, ...bigrams];
  });
};

const createSearchIndex = (sections: readonly ArticleSearchSection[]) => {
  const index = new MiniSearch<ArticleSearchSection>({
    fields: ['title', 'content'],
    storeFields: ['id', 'title', 'titles', 'content', 'date', 'level'],
    tokenize: tokenizeArticleSearchText
  });

  index.addAll([...sections]);
  return index;
};

const normalizeSearchResult = (
  result: StoredArticleSearchResult
): ArticleSearchResult => {
  const title = String(result.title || '');
  const breadcrumb = Array.isArray(result.titles)
    ? result.titles.map((item) => String(item))
    : [];
  const date =
    typeof result.date === 'string' || result.date instanceof Date
      ? result.date
      : undefined;

  return {
    id: String(result.id),
    title,
    articleTitle: breadcrumb[0] || title,
    breadcrumb,
    content: typeof result.content === 'string' ? result.content : '',
    date,
    score: Number(result.score) || 0
  };
};

export const formatArticleSearchDate = (date?: string | Date) => {
  if (!date) return '';
  if (date instanceof Date) return date.toISOString().slice(0, 10);
  return date.slice(0, 10);
};

export const getArticleSearchSectionLabel = (result: ArticleSearchResult) => {
  if (result.breadcrumb.length === 0) return '';

  return [...result.breadcrumb.slice(1), result.title]
    .filter(Boolean)
    .join(' · ');
};

const getHighlightRanges = (text: string, query: string) => {
  const terms = [...new Set(
    query
      .normalize('NFKC')
      .toLocaleLowerCase()
      .match(SEARCH_PARTS) ?? []
  )].sort((left, right) => right.length - left.length);

  if (!text || terms.length === 0) return [];

  let normalizedText = '';
  const normalizedToOriginal: Array<{ start: number; end: number }> = [];
  let originalOffset = 0;

  for (const character of text) {
    const start = originalOffset;
    originalOffset += character.length;
    const normalizedCharacter = character.normalize('NFKC').toLocaleLowerCase();

    normalizedText += normalizedCharacter;
    for (let index = 0; index < normalizedCharacter.length; index += 1) {
      normalizedToOriginal.push({ start, end: originalOffset });
    }
  }

  const ranges: Array<{ start: number; end: number }> = [];

  for (const term of terms) {
    let searchFrom = 0;
    let matchIndex = normalizedText.indexOf(term, searchFrom);

    while (matchIndex !== -1) {
      const firstCharacter = normalizedToOriginal[matchIndex];
      const lastCharacter = normalizedToOriginal[matchIndex + term.length - 1];

      if (firstCharacter && lastCharacter) {
        ranges.push({ start: firstCharacter.start, end: lastCharacter.end });
      }

      searchFrom = matchIndex + Math.max(term.length, 1);
      matchIndex = normalizedText.indexOf(term, searchFrom);
    }
  }

  return ranges
    .sort((left, right) => left.start - right.start || left.end - right.end)
    .reduce<Array<{ start: number; end: number }>>((merged, range) => {
      const previous = merged.at(-1);

      if (previous && range.start <= previous.end) {
        previous.end = Math.max(previous.end, range.end);
      } else {
        merged.push({ ...range });
      }

      return merged;
    }, []);
};

export const getArticleSearchHighlightParts = (
  text: string,
  query: string
): ArticleSearchHighlightPart[] => {
  const ranges = getHighlightRanges(text, query);
  if (ranges.length === 0) return [{ text, matched: false }];

  const parts: ArticleSearchHighlightPart[] = [];
  let offset = 0;

  for (const range of ranges) {
    if (range.start > offset) {
      parts.push({ text: text.slice(offset, range.start), matched: false });
    }

    parts.push({ text: text.slice(range.start, range.end), matched: true });
    offset = range.end;
  }

  if (offset < text.length) {
    parts.push({ text: text.slice(offset), matched: false });
  }

  return parts;
};

export const getArticleSearchSummary = (
  content: string,
  query: string = '',
  maximumLength: number = 160
) => {
  const normalized = content.replace(/\s+/g, ' ').trim();
  if (!normalized) return '标题匹配';

  const characters = Array.from(normalized);
  if (characters.length <= maximumLength) return normalized;

  const firstMatch = getHighlightRanges(normalized, query)[0];
  const matchCharacterIndex = firstMatch
    ? Array.from(normalized.slice(0, firstMatch.start)).length
    : 0;
  const start = Math.max(0, matchCharacterIndex - Math.floor(maximumLength * 0.3));
  const end = Math.min(characters.length, start + maximumLength);

  return `${start > 0 ? '…' : ''}${characters.slice(start, end).join('')}${end < characters.length ? '…' : ''}`;
};

export const useArticleSearch = <T extends ArticleSearchSection>(
  sections: MaybeRefOrGetter<readonly T[] | null | undefined>
) => {
  const query = ref('');
  const sectionList = computed<readonly ArticleSearchSection[]>(() =>
    toValue(sections) ?? []
  );
  const searchIndex = computed(() => createSearchIndex(sectionList.value));
  const queryTokens = computed(() => tokenizeArticleSearchText(query.value));
  const isQueryEmpty = computed(() => query.value.trim().length === 0);
  const hasSearchableQuery = computed(() => queryTokens.value.length > 0);
  const searchableCount = computed(() => sectionList.value.length);

  const results = computed<ArticleSearchResult[]>(() => {
    if (!hasSearchableQuery.value) return [];

    const matches = searchIndex.value.search(query.value, {
      combineWith: 'AND',
      boost: { title: 6, content: 1 },
      fuzzy: false,
      prefix: (term, index, terms) =>
        index === terms.length - 1 &&
        /^[a-z0-9]+$/i.test(term) &&
        term.length >= 2
    }) as unknown as StoredArticleSearchResult[];

    return matches.slice(0, RESULT_LIMIT).map(normalizeSearchResult);
  });

  const clear = () => {
    query.value = '';
  };

  return {
    query,
    results,
    searchableCount,
    isQueryEmpty,
    hasSearchableQuery,
    clear
  };
};
