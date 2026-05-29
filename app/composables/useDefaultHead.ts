export default () => {
  useHead({
    title: '月兔子的兔子窝',
    titleTemplate: (title) => `${title} | 月兔子的兔子窝`,
    link: [{ rel: 'icon', type: 'image/svg+xml', href: 'https://gitee.com/Bumoony.png' }],
    script: [
      {
        // This script will execute before the browser renders the <body>,
        // ensuring the correct season class is set from the very beginning.
        textContent:
          // 'document.documentElement.classList.add(["spring","summer","autumn","winter"][(new Date().getMonth()+10)%12/3|0])',
          'document.documentElement.classList.add("spring")',
        type: 'text/javascript',
        tagPosition: 'head'
      }
    ]
  });

  useSeoMeta({
    description: '月兔子的个人博客',
    ogImage: 'https://gitee.com/bumoony.png',
    ogSiteName: '月兔子的兔子窝'
  });
};
