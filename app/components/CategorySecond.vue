<script setup>
defineProps({
  title: { type: String, required: true },
  titleUrl: { type: String, default: undefined },
  rightText: { type: String, default: undefined },
  rightUrl: { type: String, default: undefined },
  showRightChevron: { type: Boolean },
  bgVariant: { type: String, default: 'secondary', validator: v => ['secondary','primary'].includes(v) }
});
</script>

<template>
  <div class="category-second" :style="{ backgroundColor: `var(--${bgVariant})` }">
    <span v-if="titleUrl === undefined" class="category-second-title" :title="title">
      {{ title }}
    </span>
    <AppLink v-else :to="titleUrl" class="category-second-title no-underline" :title="title">
      {{ title }}
    </AppLink>

    <span v-if="rightText !== undefined" class="category-second-right">
      <span v-if="rightUrl === undefined">
        {{ rightText }}
      </span>
      <AppLink v-else class="" :to="rightUrl">
        {{ rightText }}
      </AppLink>
      <!-- 右箭头 -->
      <Icon
        v-if="showRightChevron"
        name="bi-chevron-double-right"
        class="align-[-0.1em]" />
    </span>
  </div>
</template>

<style scoped>
.category-second {
  font-weight: normal;
  display: flex;
  min-height: 2rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 5px 10px;
  color: white;
  user-select: none;
}

.category-second-title {
  min-width: 0;
  flex: 1 1 auto;
  overflow-wrap: anywhere;
}

.category-second-right {
  flex: 0 0 auto;
  white-space: nowrap;
}

.category-second > a:hover {
  border-block-end: inherit;
  padding-block-end: 0;
}
.category-second > a:hover::after {
  content: '¶';
}
</style>
