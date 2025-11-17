<script setup>
const distroList = [
  {
    img: 'https://gitee.com/Bumoony.png',
    links: [],
    description: 'KafuuNagi',
    title: '月兔回旋于梦中'
  },
];

const commonLinkList = [
  {
    "title": ["邮箱: 0d00@0721.hk"],
    "url": "mailto:0d00@0721.hk"
  },
  {
    "title": ["Github: KafuuNagi"],
    "url": "https://github.com/KafuuNagi"
  },
];
</script>

<template>
  <div class="flex w-[37.5%] flex-col">
    <AppLink to="/aosc-os/right-for-me">
      <img
        src="/articles.png"
        class="imgScale1 w-full cursor-pointer" />
    </AppLink>
    <AppLink to="https://bbs.aosc.io/">
      <img
        src="/friends.png"
        class="imgScale1 w-full cursor-pointer" />
    </AppLink>
    <div class="flex grow flex-col">
      <CategorySecond
        :title="'关于我'"
        class="border-l border-solid border-content-main-bg" />
      <article
        class="theme-border-secondary border-l pt-[1em] pb-[0.5em] pl-[1em]">
        <div
          v-for="(item, index) in distroList"
          :key="`BarRight-1-div-${index}`"
          class="flex items-center pb-[15px]">
          <div class="mr-[20px] ml-[0.5em] basis-[70px]">
            <img id="img":src="item.img" alt="" class="w-full" />
          </div>
          <div class="flex-1 p-0">
            <div class="text-[14pt] font-semibold">
              {{ item.title }}
            </div>
            <div class="text-[12pt]">
              {{ item.description }}
            </div>
            <!-- <div class="text-[12pt]">
              <link-standard
                class="mr-[0.5rem] text-link"
                :link="item.links[0]" />
              <link-standard :link="item.links[1]" />
            </div> -->
          </div>
        </div>
      </article>
      <CategorySecond title="联系我" />
      <div class="theme-border-secondary flex grow flex-col border-l">
        <link-standard
          v-for="(item, index) in commonLinkList"
          :key="`BarRight-1-link-${index}`"
          class="flex h-[2rem] cursor-pointer flex-row items-center justify-between bg-white px-[1rem] odd:bg-[#fefaf6] hover:bg-leftbar-bg"
          :link="item">
          <Icon name="ic-baseline-open-in-new" />
        </link-standard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.imgScale1 {
  aspect-ratio: 96/55;
}
#img{
  border-radius: 50%;
}
</style>
