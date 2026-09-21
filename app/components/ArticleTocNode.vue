<script setup lang="ts">
defineOptions({ name: 'ArticleTocNode' });

type TocNode = {
  id: string;
  text: string;
  depth: number;
  children?: TocNode[];
};

const props = defineProps<{
  node: TocNode;
  level: number;
}>();

defineEmits<{
  navigate: [];
}>();

const expanded = ref(true);
const hasChildren = computed(() => Boolean(props.node.children?.length));
</script>

<template>
  <div class="article-toc-node">
    <div
      class="article-toc-row"
      :class="{
        'article-toc-item-shaded': node.depth % 2 === 0
      }"
      :style="{ paddingLeft: `${0.75 + level * 0.9}rem` }">
      <NuxtLink
        :to="`#${node.id}`"
        class="article-toc-link"
        @click="$emit('navigate')">
        {{ node.text }}
      </NuxtLink>
      <button
        v-if="hasChildren"
        type="button"
        class="article-toc-toggle"
        :aria-label="expanded ? '收起目录' : '展开目录'"
        :aria-expanded="expanded"
        @click="expanded = !expanded">
        <span
          class="article-toc-double-arrow"
          :class="expanded ? 'article-toc-double-arrow-up' : 'article-toc-double-arrow-down'"
          aria-hidden="true">
          <i />
          <i />
        </span>
      </button>
      <span v-else class="article-toc-toggle-placeholder" />
    </div>

    <div v-if="expanded && hasChildren" class="article-toc-children">
      <ArticleTocNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="level + 1"
        @navigate="$emit('navigate')" />
    </div>
  </div>
</template>

<style scoped>
.article-toc-row {
  display: flex;
  min-height: 2rem;
  align-items: center;
  padding-right: 0.75rem;
  line-height: 1.5rem;
}

.article-toc-row {
  background-color: white;
  color: inherit;
}

.article-toc-item-shaded {
  background-color: #fefaf6;
}

.article-toc-row:hover {
  background-color: #ececec;
}

.article-toc-toggle,
.article-toc-toggle-placeholder {
  display: flex;
  width: 1.75rem;
  min-width: 1.75rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
}

.article-toc-toggle {
  cursor: pointer;
  background: transparent;
  color: inherit;
}

.article-toc-double-arrow {
  display: flex;
  width: 1.1rem;
  height: 1rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.02rem;
}

.article-toc-double-arrow i {
  display: block;
  width: 0.72rem;
  height: 0.72rem;
  border-width: 1.5px 0 0 1.5px;
  border-style: solid;
  border-color: currentColor;
  transform: rotate(45deg);
}

.article-toc-double-arrow-up i {
  margin-bottom: -0.34rem;
}

.article-toc-double-arrow-down {
  gap: 0.02rem;
}

.article-toc-double-arrow-down i {
  border-width: 0 1.5px 1.5px 0;
  margin-top: -0.34rem;
}

.article-toc-link {
  min-width: 0;
  flex: 1;
  overflow-wrap: anywhere;
  color: inherit;
  text-decoration: none;
}

.article-toc-link:hover {
  text-decoration: none;
}
</style>
