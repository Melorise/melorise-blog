<script setup lang="ts">
const navigationList = [
  ...Object.values({
    aboutTheme: {
      title: '关于主题',
      url: '/about-theme',
    },
    backToHome: {
      title: '返回主页',
      url: '/',
    },
    icpBeian: {
      title: '皖ICP备2026XXXXXX号-1',
      url: 'https://beian.miit.gov.cn',
    },
    gwaBeian: {
      title: '皖公网安备XXXXXXXXXXXXXXX号',
      url: 'https://beian.miit.gov.cn',
    },
  }
  )
];

const mobileNavigationList = navigationList.filter(item => item.title === '返回主页');

function getCopyRightText(baseYear: number = 2025): string {
  const nowYear = new Date().getFullYear();
  if (nowYear === baseYear) {
    return `© ${baseYear} Melorise`
  }
  else {
    return `© ${baseYear} - ${nowYear} Melorise`
  }
}
</script>

<template>
  <div class="theme-bg-color-secondary-static footerbar flex w-full justify-center py-[2px] text-white">
    <div class="m-auto">
      <span class="pl-[0.5rem] max-[767px]:pl-0">
        {{ getCopyRightText() }}
      </span>
      <span class="mx-[20px]">|</span>
      <span class="hidden min-[768px]:inline">
        <AccordionNavigation :navigation-list="navigationList" span-class="mx-[20px]" link-class="cursor-pointer" />
      </span>
      <span class="min-[768px]:hidden">
        <AccordionNavigation :navigation-list="mobileNavigationList" span-class="mx-[12px]"
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
