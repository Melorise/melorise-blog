<script setup lang="ts">
defineEmits(['open-mobile-menu']);
</script>

<template>
  <div class="bg-cover">
    <div class="flex">
      <div class="grow" />
      <div class="opacity-0 content-container py-[6px] justify-end">
        <div
          class="opacity-0 flex justify-end py-[5px] pr-[0.5rem] pl-[50px] text-clip whitespace-nowrap text-white *:no-underline">
        </div>
      </div>
      <div class="opacity-0 theme-bg-color-primary-static grow" />
    </div>
    <div class="flex justify-center">
      <div class="content-container flex h-[69.2px] items-start justify-between pb-[25px]">
        <NuxtLink to="/">
          <img id="logo"
            src="https://gitee.com/Bumoony.png"
            class="w-[4rem] mr-[0.5rem] inline-block align-middle hover:shadow-md"
            alt="logo" />
            <h1 class="text-xl font-bold selection:no-underline inline-block align-middle">Melorise's Blog</h1>
        </NuxtLink>
        <button
          type="button"
          class="theme-bg-color-primary-static mt-[0.8rem] hidden h-[2.4rem] w-[2.4rem] shrink-0 cursor-pointer items-center justify-center text-white max-[959px]:flex"
          aria-label="打开导航菜单"
          @click="$emit('open-mobile-menu')">
          <Icon name="ic-baseline-menu" class="text-[1.45rem]" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.topbar {
  box-shadow: 0px 0px 10px #666;
}

.topbar-r {
  box-shadow: 10px 0px 10px #666;
}

#logo {
  border-radius: 50%;
}

h1{
  transition: all 0.2s ease-in-out;
}
h1:hover {
  text-shadow: 1px 1px 0 rgba(95, 94, 94, 0.5);
}
</style>
