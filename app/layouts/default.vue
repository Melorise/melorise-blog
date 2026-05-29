<script setup lang="ts">
const { $mitt } = useNuxtApp();
const mainRef = useTemplateRef('mainBody');
const heightRef = useTemplateRef('dMainBody');
const mobileMenuVisible = ref(false);

let observer: ResizeObserver | null = null;
onMounted(() => {
  observer = new ResizeObserver(() => {
    $mitt.emit('mainDomChange', mainRef.value?.clientHeight);
  });
  if (heightRef.value) observer.observe(heightRef.value);
});
onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div>
    <div
      class="mb-[2.5rem] flex min-h-[calc(100vh-2.5rem)] min-w-0 flex-col min-[960px]:min-w-[960px]">
    <!-- <div
      class="flex mb-[2.5rem] min-w-[960px] flex-col"> -->
      <BarHeader @open-mobile-menu="mobileMenuVisible = true" />
      <div class="content-container myShadow mx-auto flex flex-grow">
        <div
          class="sticky top-0 hidden w-[15%] min-w-[12rem] bg-leftbar-bg *:text-nowrap min-[960px]:block">
          <BarLeft class="sticky top-0 min-w-[100%] *:text-nowrap" />
        </div>
        <div ref="mainBody" class="min-w-0 flex-1">
          <el-drawer
            v-model="mobileMenuVisible"
            direction="rtl"
            size="min(82vw, 320px)"
            :with-header="false"
            custom-class="mobile-nav-drawer">
            <BarLeft @navigate="mobileMenuVisible = false" />
          </el-drawer>
          <div ref="dMainBody">
            <slot />
          </div>
        </div>
      </div>
    </div>
    <!-- <BarFooter class="fixed bottom-0 h-[2rem] min-w-[960px]" /> -->
    <!-- <BarFooter class="h-[2rem] content-container mx-auto" /> -->
    <BarFooter class="fixed bottom-0 min-h-[2rem] min-w-0 min-[960px]:h-[2rem] min-[960px]:min-w-[960px]" />
  </div>
</template>

<style scoped>
:deep(.mobile-nav-drawer) {
  background-color: #ececec;
}

:deep(.mobile-nav-drawer .el-drawer__body) {
  padding: 0;
}
</style>
