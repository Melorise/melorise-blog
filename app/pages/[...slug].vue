<script lang="ts" setup>
import { textContent } from 'minimark'; // Nuxt Content v3 依赖
import { useScrollStore } from '~/stores/scroll';
import { queryArticleCollection } from '~/utils/article';

const route = useRoute();
const scrollStore = useScrollStore();
const contentRef = useTemplateRef('contentRef');

const { data: page, error } = await useAsyncData(
  `Content:${route.path}`,
  async () => {
    let content;
    
    // 检查是否为文章路径
    if (route.path.startsWith('/article/')) {
      // 查询文章集合，移除 /article/ 前缀
      const articlePath = route.path.replace('/article/', '') || '/';
      content = await queryArticleCollection()
          .where('path', 'LIKE', `%${articlePath}%`)
          .first();
    } else {
        // 查询不依赖i18n的公共页面集合
        content = await queryCollection('commonPage')
          .path(route.path)
          .first();
      }

    if (!content) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found',
        data: {
          query: { path: route.path }
        }
      });
    }

    // 第一个元素是 h2 的话就拿 h2 的内容作为标题
    if (content.body.value?.[0]?.[0] === 'h2') {
      content.title = textContent(content.body.value[0]);
      // 移除这个 h2
      content.body.value.shift();
    }

    return content;
  }
);
useHead({ title: page.value?.title });

if (error.value) throw error.value;

watch(contentRef, () => {
  if (route.hash) scrollStore.scrollAndClear();
});
</script>

<template>
  <article v-if="page">
    <category-second
      :id="page.title"
      :title="page.title"
      :right-text="page.date?.substring(0, 10)"
      :title-url="`${route.path}#${page.title}`" />
    <ContentRenderer ref="contentRef" :value="page" class="heti" />
  </article>
</template>
