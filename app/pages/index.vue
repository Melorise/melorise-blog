<script setup>
useHead({ title: "主页" });
</script>

<template>
  <div class="flex">
    <div class="w-[62.5%] bg-content-main-bg p-0">
      <!--主图（左一）-->
      <app-link to="/" class="flex w-full">
        <img class="title-img-scale w-full" src="/ciallo.png" />
      </app-link>
      <!-- 最新文章 -->
      <div>
        <CategorySecond :title="'最新文章'" />
        <article>
          <ArticleList
            category="all"
            :limit="10"
            :filters="[{ key: 'home', value: 1 }]" />
          <div
            class="px-[15px] py-[10px] text-right leading-6 font-[12pt] text-link">
            <link-standard-jump :title="'查看更多>>>'" url="/article" />
          </div>
        </article>
      </div>
    </div>
    <BarRight />
  </div>
</template>

<style scoped>
.title-img-scale {
  aspect-ratio: 16/11;
}
</style>
