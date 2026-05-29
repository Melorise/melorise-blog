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
          class="flex h-[2rem] cursor-pointer pl-6 leading-8 hover:bg-leftbar-bg">
          <span class="flex-1 truncate">
            {{ item.title }}
          </span>
          <span v-if="item.date" class="pr-6">
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