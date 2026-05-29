<script setup lang="ts">
const navigationList = [
  ...Object.values({
    websiteIssuse: {
      title: '报告内容问题',
      url: 'https://github.com/Melorise',
    },
    backToHome:{
      title: '返回首页',
      url: '/',
    }
  }
  )
];

const mobileNavigationList = navigationList.filter(item => item.title !== '报告内容问题');

function getCopyRightText(baseYear: number = 2025): string {
  const nowYear = new Date().getFullYear();
  if (nowYear === baseYear) {
    return `© ${baseYear} Melorise`
  }
  else {
    return `© ${baseYear}-${nowYear} Melorise`
  }
}
</script>

<template>
  <div class="theme-bg-color-secondary-static footerbar flex w-full justify-center py-[2px] text-white">
    <div class="m-auto">
      <span class="pl-[0.5rem]">
        {{ getCopyRightText() }}
      </span>
      <span class="mx-[20px]">|</span>
      <span class="hidden min-[960px]:inline">
        <AccordionNavigation
          :navigation-list="navigationList"
          span-class="mx-[20px]"
          link-class="cursor-pointer" />
      </span>
      <span class="min-[960px]:hidden">
        <AccordionNavigation
          :navigation-list="mobileNavigationList"
          span-class="mx-[12px]"
          link-class="cursor-pointer" />
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.footerbar {
  box-shadow: 0px 0px 8px #000000e0;

  @media (max-width: 960px) {
    .content-container {
      width: 100%;
      min-width: 0;
      overflow: auto;
    }
  }
}
</style>
