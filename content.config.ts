import { defineCollection, defineContentConfig, z } from '@nuxt/content';
import type { DefinedCollection } from '@nuxt/content';
import { nuxtI18nLocales, i18nCodeToContent } from './app/i18n/config';
import type { NuxtI18nCode, NuxtI18nContentCode } from './app/i18n/config';

const pageSchama = z.object({
  title: z.string(),
  date: z.date(),
  categories: z.array(z.string()),
  important: z.optional(z.boolean()),
  home: z.optional(z.boolean())
});

const definePageCollection = (locale: NuxtI18nCode) =>
  defineCollection({
    source: {
      include: `${locale}/**`,
      prefix: '/', // prefixes are handled by @nuxtjs/i18n
      exclude: ['**/_*']
    },
    type: 'page',
    schema: pageSchama
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
    ...Object.fromEntries(
      nuxtI18nLocales.map((locale) => [
        i18nCodeToContent(locale.code),
        definePageCollection(locale.code)
      ])
    ),
    gallery: defineCollection({
      source: 'all/gallery.yml',
      type: 'data',
      schema: z.object({
        gallery: z.array(
          z.object({
            title: z.string(),
            album: z.array(
              z.object({ desc: z.string(), date: z.string(), file: z.string() })
            )
          })
        )
      })
    }),
    // Add article collection
    article: articleCollection,
    commonPage: commonPageCollection
  } as { [key in NuxtI18nContentCode | 'gallery' | 'article' | 'commonPage']: DefinedCollection }
});


