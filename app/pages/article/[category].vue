<script setup>
const route = useRoute();

const title = computed(() => {
  switch (route.params.category) {
    case 'tech':
      return '技术博文';
    case 'works':
      return '个人创作';
    case 'essay':
      return '随笔杂谈';
    case 'other':
      return '其它文章';
    default:
      return '';
  }
});
useHead({ title: title });

const categoryFilter = computed(() => [
  { key: 'categories', value: `%"${route.params.category}"%` }
]);
</script>

<template>
  <div>
    <category-second :title="title" class="border-r-solid border-r-white" />
    <article-list :category="route.params.category" :filters="categoryFilter" />
  </div>
</template>

<style scoped></style>
./components/Header.vue
