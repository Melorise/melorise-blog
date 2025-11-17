<script setup lang="ts">
import type { NuxtError } from '#app';

const { error } = defineProps({
  error: { type: Object as () => NuxtError, required: true }
});

useDefaultHead();
useHead({ title: error?.statusCode });

// npm run dev 时 error.data 即使构造时是对象也会变成 string
const errorData = computed(() =>
  typeof error?.data === 'string' ? JSON.parse(error.data) : error.data
);
</script>

<template>
  <NuxtLayout>
    <div class="flex-1">
      <CategorySecond title="错误页" />
      <div v-if="error?.statusCode === 404" class="heti">
        <h1>"找不到页面 (404)"</h1>
        <p v-if="error?.data">
            "您想要访问的页面在站点上不存在。请检查您输入的网页地址 (URL) 是否正确。",
        </p>
        <p>
          <span>"如果该页面链接是其他网页中所引用的，请联系网站管理员。"</span>
        </p>
      </div>
      <div v-else class="heti">
        <h1>
          "发生了一个意外错误 ({{ error?.statusCode }})"
        </h1>
        <p>{{ error?.message ?? error?.statusMessage }}</p>
        <code>{{ error?.data }}</code>
      </div>
    </div>
  </NuxtLayout>
</template>
