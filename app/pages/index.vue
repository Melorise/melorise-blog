<script setup>
useHead({ title: "主页" });

const infoList = [
  {
    img: 'https://gitee.com/Bumoony.png',
    links: [],
    description: 'Welcome come on!',
    title: 'Melorise'
  },
];

const commonLinkList = [
  {
    title: ['邮箱: 0d00@0721.hk'],
    url: 'mailto:0d00@0721.hk'
  },
  {
    title: ['Github: Melorise'],
    url: 'https://github.com/Melorise'
  },
];
</script>

<template>
  <div class="flex flex-col min-[960px]:flex-row">
    <div class="w-full bg-content-main-bg p-0 min-[960px]:w-[62.5%]">
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
    <div class="flex w-full flex-col min-[960px]:w-[37.5%]">
      <AppLink to="/article" class="hidden min-[960px]:block">
        <img
          src="/articles.png"
          class="home-side-img w-full cursor-pointer" />
      </AppLink>
      <AppLink to="/friend" class="hidden min-[960px]:block">
        <img
          src="/friends.png"
          class="home-side-img w-full cursor-pointer" />
      </AppLink>
      <div class="flex grow flex-col">
        <CategorySecond
          :title="'关于我'"
          class="border-solid border-content-main-bg min-[960px]:border-l" />
        <article
          class="theme-border-secondary pt-[1em] pb-[0.5em] pl-[1em] min-[960px]:border-l">
          <div
            v-for="(item, index) in infoList"
            :key="`home-info-${index}`"
            class="flex items-center pb-[15px]">
            <div class="mr-[20px] ml-[0.5em] basis-[70px]">
              <img class="home-avatar w-full" :src="item.img" alt="" />
            </div>
            <div class="min-w-0 flex-1 p-0">
              <div class="text-[14pt] font-semibold">
                {{ item.title }}
              </div>
              <div class="text-[12pt]">
                {{ item.description }}
              </div>
            </div>
          </div>
        </article>
        <CategorySecond title="联系我" />
        <div class="theme-border-secondary flex grow flex-col min-[960px]:border-l">
          <link-standard
            v-for="(item, index) in commonLinkList"
            :key="`home-link-${index}`"
            class="flex h-[2rem] cursor-pointer flex-row items-center justify-between bg-white px-[1rem] odd:bg-[#fefaf6] hover:bg-leftbar-bg"
            :link="item">
            <Icon name="ic-baseline-open-in-new" />
          </link-standard>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title-img-scale {
  aspect-ratio: 16/11;
}

.home-side-img {
  aspect-ratio: 96/55;
}

.home-avatar {
  border-radius: 50%;
}
</style>
