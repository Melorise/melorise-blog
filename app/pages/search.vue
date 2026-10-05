<script setup lang="ts">
import {
  formatArticleSearchDate,
  getArticleSearchHighlightParts,
  getArticleSearchSectionLabel,
  getArticleSearchSummary,
  useArticleSearch
} from '~/composables/useArticleSearch';
import { queryArticleSearchSections } from '~/utils/article';

useHead({ title: '搜索文章' });

const { data: sections, error, status } = await useAsyncData(
  'article-search-sections',
  queryArticleSearchSections
);

const {
  query,
  results,
  isQueryEmpty,
  hasSearchableQuery,
  clear
} = useArticleSearch(sections);

const errorMessage = computed(() => {
  const currentError = error.value as
    | { statusMessage?: string; message?: string }
    | null;

  return currentError?.statusMessage || currentError?.message || '';
});
</script>

<template>
  <div>
    <CategorySecond title="搜索文章" />

    <section class="theme-border-secondary border-b bg-white px-4 py-4 sm:px-6">
      <label for="article-search-input" class="sr-only">搜索文章</label>
      <div class="search-input-wrap theme-border-secondary flex min-h-[2.5rem] border bg-white">
        <input
          id="article-search-input"
          v-model="query"
          type="search"
          class="search-input min-w-0 flex-1 bg-transparent px-3 py-2 leading-6 outline-none"
          placeholder="输入标题或正文关键词"
          autocomplete="off"
          @keydown.esc="clear" />
        <button
          v-if="query"
          type="button"
          class="theme-border-secondary border-l px-3 text-[0.9em] hover:bg-leftbar-bg"
          aria-label="清空搜索关键词"
          @click="clear">
          清空
        </button>
      </div>

      <p
        v-if="!isQueryEmpty && hasSearchableQuery && status !== 'pending' && status !== 'error'"
        class="mt-2 text-[0.9em] leading-5 text-gray"
        aria-live="polite"
        role="status">
        <template v-if="results.length">
          找到 {{ results.length }} 条相关内容
        </template>
        <template v-else>
          没有找到与“{{ query.trim() }}”相关的文章。
        </template>
      </p>
    </section>

    <section v-if="status === 'pending' || status === 'error' || results.length">
      <div v-if="status === 'pending'" class="px-4 py-6 leading-6 sm:px-6">
        正在准备文章索引…
      </div>

      <div v-else-if="status === 'error'" class="px-4 py-6 leading-6 sm:px-6">
        <p>文章索引暂时无法读取，请稍后重试。</p>
        <p v-if="errorMessage" class="mt-1 text-[0.9em] text-gray">
          {{ errorMessage }}
        </p>
      </div>

      <div v-else class="flex flex-col">
        <div v-for="result in results" :key="result.id" class="search-result-item">
          <NuxtLink
            :to="result.id"
            class="block cursor-pointer px-4 py-3 hover:bg-leftbar-bg sm:px-6">
            <div class="flex min-w-0 items-start gap-2 leading-6">
              <div class="min-w-0 flex-1">
                <p class="truncate">
                  <template
                    v-for="(part, index) in getArticleSearchHighlightParts(result.articleTitle, query)"
                    :key="`${result.id}-title-${index}`">
                    <mark v-if="part.matched" class="search-highlight">{{ part.text }}</mark>
                    <template v-else>{{ part.text }}</template>
                  </template>
                </p>
                <p
                  v-if="getArticleSearchSectionLabel(result)"
                  class="truncate text-[0.9em] text-gray">
                  <template
                    v-for="(part, index) in getArticleSearchHighlightParts(getArticleSearchSectionLabel(result), query)"
                    :key="`${result.id}-section-${index}`">
                    <mark v-if="part.matched" class="search-highlight">{{ part.text }}</mark>
                    <template v-else>{{ part.text }}</template>
                  </template>
                </p>
              </div>
              <span v-if="formatArticleSearchDate(result.date)" class="shrink-0 text-[0.9em]">
                [{{ formatArticleSearchDate(result.date) }}]
              </span>
            </div>
            <p class="search-result-summary mt-1 text-[0.9em] leading-5 text-[#666]">
              <template
                v-for="(part, index) in getArticleSearchHighlightParts(getArticleSearchSummary(result.content, query), query)"
                :key="`${result.id}-summary-${index}`">
                <mark v-if="part.matched" class="search-highlight">{{ part.text }}</mark>
                <template v-else>{{ part.text }}</template>
              </template>
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.search-input-wrap:focus-within {
  border-color: var(--primary);
}

.search-input::-webkit-search-cancel-button {
  display: none;
  -webkit-appearance: none;
  appearance: none;
}

.search-input::-ms-clear {
  display: none;
}

.search-result-item:nth-child(2n) {
  background-color: #fefaf6;
}

.search-result-item:nth-child(2n + 1) {
  background-color: white;
}

.search-result-summary {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.search-highlight {
  background-color: color-mix(in srgb, var(--secondary) 35%, white);
  color: inherit;
}
</style>
