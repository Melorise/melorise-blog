<script lang="ts" setup>
import { textContent } from 'minimark'; // Nuxt Content v3 依赖
import { useScrollStore } from '~/stores/scroll';
import { queryArticleCollection } from '~/utils/article';

const route = useRoute();
const scrollStore = useScrollStore();
const contentRef = useTemplateRef('contentRef');

type TocNode = {
  id: string;
  text: string;
  depth: number;
  children: TocNode[];
};

const buildToc = (title: string, value: unknown): TocNode[] => {
  const root: TocNode = {
    id: title,
    text: title,
    depth: 1,
    children: []
  };
  if (!Array.isArray(value)) return [root];

  const stack: TocNode[] = [root];

  for (const node of value) {
    if (!Array.isArray(node) || typeof node[0] !== 'string') continue;

    const headingMatch = node[0].match(/^h([1-6])$/);
    if (!headingMatch) continue;

    const depth = Number(headingMatch[1]);
    if (depth === 1) continue;
    const attributes = node[1];
    const text = textContent(node);
    const id =
      attributes && typeof attributes === 'object' && 'id' in attributes
        ? String(attributes.id)
        : text;
    const item: TocNode = { id, text, depth, children: [] };

    while (stack.length > 1 && stack.at(-1)!.depth >= depth) stack.pop();

    stack.at(-1)!.children.push(item);

    stack.push(item);
  }

  return [root];
};

const normalizeContentPath = (path: string) => {
  const withoutIndex = path.replace(/\/index\.html$/, '');
  const withoutTrailingSlash = withoutIndex.replace(/\/+$/, '');
  return withoutTrailingSlash || '/';
};

const normalizedPath = computed(() => normalizeContentPath(route.path));

const { data: page, error } = await useAsyncData(
  `Content:${normalizedPath.value}`,
  async () => {
    let content;
    
    // 检查是否为文章路径
    if (normalizedPath.value.startsWith('/article/')) {
      // 查询文章集合，移除 /article/ 前缀
      const articlePath = normalizedPath.value.replace('/article/', '') || '/';
      content = await queryArticleCollection()
          .where('path', 'LIKE', `%${articlePath}%`)
          .first();
    } else {
        content = await queryCollection('commonPage')
          .path(normalizedPath.value)
          .first();
      }

    if (!content) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found',
        data: {
          query: { path: route.path, normalizedPath: normalizedPath.value }
        }
      });
    }

    // 兼容旧文章：正文第一个 h2 与元数据标题相同，只作为页面标题使用。
    if (
      content.body.value?.[0]?.[0] === 'h2' &&
      textContent(content.body.value[0]) === content.title
    ) {
      content.body.value.shift();
    }

    return content;
  }
);
useHead({ title: page.value?.title });

if (error.value) throw error.value;

// 普通 Markdown 页面（如“关于”）不展示文章目录。
const isArticlePage = computed(() => normalizedPath.value.startsWith('/article/'));

const tocLinks = computed(() => {
  if (!isArticlePage.value) return [];

  return buildToc(String(page.value?.title || '文章'), page.value?.body?.value);
});

const hasArticleToc = computed(() => tocLinks.value.length > 0);
const tocDrawerVisible = ref(false);

watch(contentRef, () => {
  if (route.hash) scrollStore.scrollAndClear();
});
</script>

<template>
  <div v-if="page" class="flex flex-col min-[960px]:flex-row">
    <article
      class="w-full"
      :class="hasArticleToc ? 'min-[960px]:w-[62.5%]' : ''">
      <category-second
        :id="page.title"
        :title="page.title"
        :right-text="page.date?.substring(0, 10)"
        :title-url="`${normalizedPath}#${page.title}`" />
      <ContentRenderer ref="contentRef" :value="page" class="heti" />
    </article>

    <div
      v-if="hasArticleToc"
      class="hidden min-[960px]:block min-[960px]:w-[37.5%] min-[960px]:border-l min-[960px]:border-l-white">
      <ArticleToc
        :links="tocLinks"
        class="sticky top-0 max-h-[calc(100vh-2.5rem)] overflow-y-auto overscroll-contain" />
    </div>

    <button
      v-if="hasArticleToc"
      type="button"
      class="theme-bg-color-primary-static fixed right-[1rem] bottom-[3rem] z-30 flex h-[2.75rem] w-[2.75rem] items-center justify-center text-white shadow-md min-[960px]:hidden"
      aria-label="打开文章目录"
      @click="tocDrawerVisible = true">
      <Icon name="ic-baseline-menu-book" class="text-[1.35rem]" />
    </button>

    <el-drawer
      v-if="hasArticleToc"
      v-model="tocDrawerVisible"
      direction="rtl"
      size="min(82vw, 320px)"
      :with-header="false"
      custom-class="article-toc-drawer">
      <ArticleToc :links="tocLinks" @navigate="tocDrawerVisible = false" />
    </el-drawer>
  </div>
</template>

<style scoped>
:deep(.article-toc-drawer .el-drawer__body) {
  padding: 0;
}
</style>
