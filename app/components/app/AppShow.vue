<script setup>
defineProps({
  title: {
    type: [Object],
    required: true
  }
});
</script>

<template>
  <span
    v-for="(item, index) in title.texts"
    :key="`${title.texts[0]}-${index}`">
    <span v-if="title.book.includes(index)">
      <span>《{{ item }}》</span>
    </span>
    <span v-else>{{ item }}</span>
  </span>
</template>

<style scoped>
[class*='features']:not(:first-of-type) {
  margin-top: 1.5rem;
}
</style>
