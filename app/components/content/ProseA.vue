<script setup lang="ts">
const props = defineProps<{
  href?: string;
  target?: string;
}>();

const isExternalLink = computed(() => /^(?:https?:)?\/\//i.test(props.href ?? ''));
const linkTarget = computed(() => props.target || (isExternalLink.value ? '_blank' : undefined));
const linkRel = computed(() =>
  linkTarget.value === '_blank' ? 'noopener noreferrer' : undefined
);
</script>

<template>
  <a
    v-if="isExternalLink"
    :href="props.href"
    :target="linkTarget"
    :rel="linkRel">
    <slot />
  </a>
  <NuxtLink v-else :to="props.href" :target="linkTarget" :rel="linkRel">
    <slot />
  </NuxtLink>
</template>
