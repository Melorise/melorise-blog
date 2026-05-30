<script setup>
const emit = defineEmits(['navigate']);

const getComp = computed(() => {
  return [
    [
      {
        title: "文章",
        children: [
          {
            "title": ["全部文章"],
            "url": "/article"
          },
          {
            "title": ["技术博文"],
            "url": "/article/tech"
          },
          {
            "title": ["个人创作"],
            "url": "/article/works"
          },
          {
            "title": ["随笔杂谈"],
            "url": "/article/essay"
          },
          {
            "title": ["其它文章"],
            "url": "/article/other"
          },
        ],
        show: true
      },
      {
        title: "关于",
        children: [
          {
            "title": ["关于我"],
            "url": "/about"
          },
          // {
          //   "title": ["代码仓库"],
          //   "url": "https://github.com/Melorise"
          // },
          {
            "title": ["关于主题"],
            "url": "/about-theme"
          },
          {
            "title": ["友情链接"],
            "url": "/friend"
          },
        ],
        show: true
      },
    ],
    ['0', '1']
  ];
});//获取组件

const navigationList = computed(() => {
  return getComp.value[0];
});

const rowHeight = 32;
const rowHeightpx = `${rowHeight}px`;

const route = useRoute();

onBeforeUnmount(() => {
  $mitt.off('mainDomChange');
});
</script>

<template>
  <div id="sticky-nav" ref="stickyNav">
    <div class="menuDiv">
      <el-menu class="my-el-menu" :default-openeds="defaultOpeneds" @close="closeMenu" @open="openMenu">
        <!-- 它的 index 要求是字符串不然控制台发警告 -->
        <div v-for="(item, index) in navigationList" :key="`barleft-1-link-${index}`">
          <CategorySecond :title="item.title" bgVariant="primary" />
          <div class="my-item-ul">
            <AppLink v-for="(item2, index2) in item.children" :key="`barleft-2-link-${index2}`" :to="item2.url"
              class="hover:no-underline" @click="emit('navigate')">
              <el-menu-item :index="`${index}-${index2}`" class="my-el-menu-item" :class="{
                'my-el-menu-item-hover': route.path.replace(/\/+$/, '').trim() === item2.url.trim()
              }">
                {{ getSpecifiedTitle(item2) }}
              </el-menu-item>
            </AppLink>
          </div>
        </div>
      </el-menu>
    </div>
  </div>
</template>

<style scoped>
.my-el-menu {
  --el-menu-item-font-size: 12pt;
  --el-menu-bg-color: var(--primary);
  --el-menu-text-color: white;
  --el-menu-active-color: black;
  --el-menu-hover-bg-color: var(--secondary);
  --el-menu-item-height: v-bind(rowHeightpx);
  --el-menu-base-level-padding: 10px;
  --el-menu-level-padding: 5px;
  border: 0;
}

.my-el-menu-item {
  color: black;
  background-color: #ececec;
}

.my-el-menu-item-hover {
  background-color: #dcdcdc;
}

.my-el-menu-item:hover {
  background-color: #dcdcdc;
}

.my-item-ul {
  padding-top: 0px;
  padding-bottom: 0px;
  background-color: #ececec;
}
</style>
