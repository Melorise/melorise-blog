<script setup lang="ts">
const navigationList = [
  ...Object.values({
    websiteSourceCode: {
      title: '网页源代码',
      url: 'https://github.com/AOSC-Dev/website-2023',
    },
    websiteIssuse: {
      title: '报告内容问题',
      url: 'https://github.com/AOSC-Dev/website-2023/issues',
    },
    backToHome:{
      title: '返回首页',
      url: '/',
    }
  }
  )
];

function getCopyRightText(baseYear: number = 2025): string {
  const nowYear = new Date().getFullYear();
  if (nowYear === baseYear) {
    return `© ${baseYear} 月兔回旋于梦中`
  }
  else {
    return `© ${baseYear}-${nowYear} 月兔回旋于梦中`
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
      <AccordionNavigation :navigation-list="navigationList" span-class="mx-[20px]" link-class="cursor-pointer" />
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
