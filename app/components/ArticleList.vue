<script lang="ts" setup>
const props = defineProps<{
  category?: string;       // 文章分类
  filters?: Array<{ key: string; value: string }>; // 额外的过滤条件
  limit?: number;         // 文章数量限制
}>();

const { data, error, status } = await useAsyncData(
  `ArticleList:${props.category}:${props.limit}:${props.filters?.map((obj) => `${obj.key}-${obj.value}`).join('--')}`,
  queryArticlesByCategory(props.category, props.limit, props.filters)
)
</script>

<template>
  <div>
    <div v-if="status === 'error'">
      {{ error }}
    </div>
    <div v-else-if="status === 'success'" class="flex flex-col">
      <div v-for="item in data" :key="item.path" class="articlelist-item">
        <NuxtLink
          :to="item.path"
          class="flex min-h-[2rem] cursor-pointer items-center gap-2 py-1 pr-3 pl-4 leading-6 hover:bg-leftbar-bg sm:h-[2rem] sm:py-0 sm:pr-6 sm:pl-6 sm:leading-8">
          <span class="min-w-0 flex-1 truncate">
            {{ item.title }}
          </span>
          <span v-if="item.date" class="shrink-0 text-[0.9em] sm:text-[1em]">
            [{{ item.date.split('T')[0] }}]
          </span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.articlelist-item:nth-child(2n) {
  background-color: #fefaf6;
}
.articlelist-item:nth-child(2n + 1) {
  background-color: white;
}
</style>
