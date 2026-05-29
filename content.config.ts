import { defineCollection, defineContentConfig, z } from '@nuxt/content';
import type { DefinedCollection } from '@nuxt/content';

const pageSchama = z.object({
  title: z.string(),
  date: z.date(),
  categories: z.array(z.string()),
  important: z.optional(z.boolean()),
  home: z.optional(z.boolean())
});

// Article collection - organized by categories under content/article/
const articleCollection = defineCollection({
  source: {
    include: 'article/**',
    exclude: ['**/_*']
  },
  type: 'page',
  schema: pageSchama
});

const commonPageCollection = defineCollection({
  source: {
    include: '**/*.md',
    exclude: ['**/_*']
  },
  type: 'page',
  schema: pageSchama
});

export default defineContentConfig({
  collections: {
    // Add article collection
    article: articleCollection,
    commonPage: commonPageCollection
  } as { [key in 'article' | 'commonPage']: DefinedCollection }
});


