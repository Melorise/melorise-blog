<script setup lang="ts">
type TocNode = {
  id: string;
  text: string;
  depth: number;
  children?: TocNode[];
};

defineProps<{
  links: TocNode[];
}>();

defineEmits<{
  navigate: [];
}>();
</script>

<template>
  <aside class="article-toc">
    <CategorySecond title="文章目录" />
    <ArticleTocNode
      v-for="link in links"
      :key="link.id"
      :node="link"
      :level="0"
      @navigate="$emit('navigate')" />
  </aside>
</template>

<style scoped>
.article-toc {
  min-width: 0;
  background-color: #fcfcfc;
}
</style>
