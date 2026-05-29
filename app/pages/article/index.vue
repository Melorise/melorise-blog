<script setup lang="ts">
const articleLimit = 10;
useHead({ title: "全部文章" });

</script>

<template>
  <div class="flex flex-wrap *:w-full min-[960px]:*:w-1/2">
    <div>
      <category-second
        title="技术博文"
        right-text="查看全部"
        right-url="/article/tech"
        :show-right-chevron="true" />
      <article-list
        category="tech"
        :limit="articleLimit"
        class="overflow-y-auto" />
    </div>
    <div class="">
      <category-second
        title="个人创作"
        right-text="查看全部"
        right-url="/article/works"
        class="min-[960px]:border-l min-[960px]:border-l-white"
        :show-right-chevron="true" />
      <article-list
        category="works"
        :limit="articleLimit"
        class="theme-border-secondary overflow-y-auto min-[960px]:border-l-[1px]" />
    </div>
    <div>
      <category-second
        title="随笔杂谈"
        right-text="查看全部"
        right-url="/article/essay"
        :show-right-chevron="true" />
      <article-list
        category="essay"
        :limit="articleLimit"
        class="overflow-y-auto" />
    </div>

    <div class="">
      <category-second
        title="其它文章"
        right-text="查看全部"
        right-url="/article/other"
        :show-right-chevron="true"
        class="min-[960px]:border-l min-[960px]:border-l-white" />
      <article-list
        category="other"
        :limit="articleLimit"
        class="theme-border-secondary overflow-y-auto min-[960px]:border-l-[1px]" />
    </div>
  </div>
</template>

<style scoped></style>
./components/Header.vue
