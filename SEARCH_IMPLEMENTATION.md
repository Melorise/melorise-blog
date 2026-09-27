# `/search` 文章搜索实施说明

> **状态：核心实现已写入，自动验证暂停。**  
> **最后续作：2026-09-21**  
> **执行约束：用户已明确要求停止验证。** 在用户解除该限制前，不运行 `lint`、`generate`、开发服务器或其他验证命令。  
> **本文件是该功能的唯一实施清单和续作记录。** 后续继续此任务时，先阅读本文件，然后只检查或修改本文件列出的目标文件及明确报错涉及的文件；除非构建、类型检查或本文件中的前提发生冲突，不再做全项目重复勘察。

---

## 1. 目标与验收范围

为博客新增独立搜索页 `/search`，基于当前项目已安装的 **MiniSearch** 和 **Nuxt Content 的搜索分段 API**，支持检索所有文章的：

- Front matter 中的文章标题；
- Markdown 正文；
- 正文中的各级标题（作为正文分段的一部分）；
- 中英文混合关键词，尤其是连续中文关键词。

搜索结果应：

1. 只来自 `article` 内容集合；
2. 显示文章/小节标题、日期、上下文摘要；
3. 点击后跳转至文章；正文分段命中时，直接跳至对应的 `#heading-anchor`；
4. 以静态站点方式可用，`nuxt generate` 后 `/search` 必须被预渲染；
5. 沿用站点现有的扁平、方正、二级栏目条与交替列表视觉，而不是引入圆角卡片式搜索 UI。

### 不在本次范围内

- 不升级 Nuxt、`@nuxt/content` 或 MiniSearch；
- 不引入 Algolia、Meilisearch、服务端 API、数据库或第三方分词包；
- 不修改文章 Markdown 结构或文章详情页逻辑；
- 不做全文高亮 HTML 注入（避免 `v-html` / XSS 风险）；
- 不添加全站快捷键、搜索历史、筛选器、分页或拼音检索。

---

## 2. 已锁定的技术前提

| 项目 | 已确认结论 | 实施含义 |
| --- | --- | --- |
| 框架 | Nuxt `4.5.2` | 使用现有 Nuxt 4 页面、自动导入与静态生成流程。 |
| 内容模块 | `@nuxt/content` `3.16.0` | 用户需求中的“Nuxt Content4”按“Nuxt 4 项目中的当前 Content 集成”落实；**不得**为此升级内容模块。 |
| 搜索库 | `minisearch` `7.2.0`，已在 `package.json` 中 | 直接导入使用，不安装依赖。 |
| 文章集合 | `article`，来源为 `content/article/**` | 只能查询此集合，避免 `commonPage`（其范围覆盖文章 Markdown）造成重复索引。 |
| 静态构建 | `pnpm generate`（等同现有 `build`） | `/search` 需配置为 Nitro prerender 路由。 |
| 锚点滚动 | `app/router.options.ts` 已处理 `to.hash` | 搜索结果直接使用 Nuxt Content 返回的 section `id` 作为 `NuxtLink` 目标即可。 |

### 2.1 内容范围决策：集合边界优先，Front Matter 仅用于例外

当前项目中：

- 文章源文件位于 `content/article/**`；
- “关于我”等普通 Markdown 页面由 `commonPage` 处理；
- 但 `commonPage` 当前的 `include: '**/*.md'` 也会收录 `article/**`，使同一篇文章同时属于两个集合。

**本次确定的规避方案：**

1. `article` 是搜索功能唯一允许的数据源；搜索代码只能调用 `queryCollectionSearchSections('article', …)`，绝不查询 `commonPage`。
2. 将 `commonPage` 的 source 排除规则补为 `['article/**', '**/_*']`，使每篇 Markdown 只属于一个语义集合：文章属于 `article`，普通页面属于 `commonPage`。
3. 因此，“关于我”“关于主题”“友情链接”等普通 Markdown 即使拥有标题和正文，也不会进入文章索引。

**结论：现在不需要为了排除普通页面新增 Front Matter 字段。** 用路径/集合表达内容类型是主规则，比让每一篇普通页面手工维护 `search: false` 更可靠，也不会因漏填字段意外被索引。

如未来出现“位于 `content/article/**` 中、但不应被搜索”的例外（例如草稿、聚合页或私密文章），再单独给文章 schema 增加：

```yaml
searchable: false
```

并让该字段默认值为 `true`，在文章搜索查询中追加 `where('searchable', '=', true)`。这个字段是**未来的细粒度排除开关**，不是本次区分文章和普通页面的前置条件；当前不新增它，避免无必要地扩张 schema 和过滤逻辑。

### 当前未提交、必须保留的用户改动

实现搜索功能时不得覆盖、回退或格式化以下改动：

- `app/assets/index.scss`：Heti 导入路径调整；
- `app/pages/[...slug].vue`：桌面端文章目录粘性/滚动容器调整。

### 2.2 当前实现检查点（续作从这里开始）

以下搜索功能代码已经写入工作区，尚未执行搜索功能的自动或手动验证：

1. `commonPage` 已排除 `article/**`，文章和普通 Markdown 页面不再属于同一集合；
2. `queryArticleSearchSections` 只查询 `article` 的 Content 搜索分段，并携带 `date`；
3. `useArticleSearch` 已实现 MiniSearch 内存索引、中文单字/双字 tokenizer、英文末词前缀匹配、标题权重、摘要和日期辅助函数；
4. `/search` 页面已实现数据加载、输入、清空、加载/错误/空输入/无结果/结果状态，以及 section anchor 跳转；
5. 左侧桌面导航和移动端抽屉共用的 `BarLeft` 已有“搜索文章”入口；
6. Nitro 已配置预渲染 `/search`；
7. 已修复普通 Markdown 页错误展示文章目录的问题：`[...slug].vue` 仅为 `/article/**` 构建目录，且无目录的普通页面在桌面端使用完整内容宽度，不再在右侧留下空白栏。

**未完成的唯一阶段是验证。** 用户明确要求暂停该阶段，因此不要自行恢复执行第 7 节命令。若用户以后允许验证，只从第 7 节开始，并只修复命令实际报告的问题。

---

## 3. 数据流与为什么这样设计

```text
content/article/**/*.md
        │
        ▼
queryCollectionSearchSections('article', …)
        │  Nuxt Content 将 Markdown 转为可搜索 section
        ▼
useAsyncData('article-search-sections', …)
        │  SSR / generate 时写入 Nuxt payload，客户端水合后复用
        ▼
MiniSearch 浏览器内存索引
        │  自定义中英文 tokenizer + 标题权重
        ▼
/search 输入框的计算结果
        │
        ▼
交替背景的结果列表 → NuxtLink(section.id)
```

### 3.1 为什么使用 `queryCollectionSearchSections`

不手动读取或解析 `body.value`。Nuxt Content 已提供 `queryCollectionSearchSections`，可将 MiniMark AST 转换为搜索分段，且保留标准文章锚点。

在当前版本中，每个 Markdown 文档会生成：

- **根分段**：`id` 为文章路径，例如 `/article/tech/example`；`title` 为 front matter 标题；`content` 为标题前内容/description。
- **标题分段**：`id` 为 `/article/tech/example#anchor`；`title` 为该标题文本；`titles` 为父级标题路径；`content` 为该标题以下至下一标题前的正文。

因此：

- 搜索文章标题时，只会命中根分段，不会因每个小节重复文章标题而产生重复结果；
- 搜索正文或小节标题时，结果可精确跳至相应锚点；
- 保留多个同文结果是有意的：它们代表不同的命中段落，并携带各自的上下文。

### 3.2 为什么只从 `article` 查询

`commonPage` 当前包含 `**/*.md`，其中也包含 `article/**`。若将两者一起索引，同一文章会重复出现。搜索功能只面向“所有文章”，故数据源固定为 `article`。

### 3.3 为什么需要自定义中文 tokenizer

MiniSearch 默认按空白和标点切词。连续中文文本没有空格，例如搜索“标题样式”时默认会将整段中文当成一个词，无法可靠匹配正文片段。

本实现用无依赖的规则 tokenizer：

1. 标准化为 NFKC、小写；
2. 连续汉字拆为单字及相邻双字词（bigram）；
3. 拉丁字母/数字连续串保留为一个词；
4. 查询使用同一 tokenizer；
5. 使用 `AND` 合并查询词，降低只匹配一个汉字造成的噪声。

示例：

```text
输入：标题样式 Nuxt4
索引/查询 token：标、题、样、式、标题、题样、样式、nuxt4
```

文章标题字段获得更高权重；正文和正文标题仍可命中。

---

## 4. 文件变更清单（唯一允许的新增/修改范围）

| 文件 | 操作 | 职责 |
| --- | --- | --- |
| `content.config.ts` | 修改 | 让 `commonPage` 明确排除 `article/**`，消除文章/普通页面集合重叠。 |
| `app/utils/article.ts` | 修改 | 导出 `queryArticleSearchSections`，仅从 `article` 集合取得搜索分段。 |
| `app/composables/useArticleSearch.ts` | 新增 | MiniSearch 文档类型、tokenizer、索引构建、查询、摘要/标题辅助函数。 |
| `app/pages/search.vue` | 新增 | `/search` 页面：取分段数据、输入、状态、结果列表与可访问性。 |
| `app/components/bar/BarLeft.vue` | 修改 | 在“文章”菜单中增加“搜索文章”入口。 |
| `nuxt.config.ts` | 修改 | 将 `/search` 加入 prerender routes。 |
| `app/pages/[...slug].vue` | 修改（相邻缺陷修复） | 仅文章页显示文章目录；普通 Markdown 页恢复完整内容宽度。 |
| `SEARCH_IMPLEMENTATION.md` | 新增（本文件） | 固化实施方案和验收标准。 |

不需要改动以下文件：

- `app/router.options.ts`；
- `package.json` / lockfile；
- 全局主题样式文件。

---

## 5. 精确实现规范

### 5.1 `content.config.ts`：消除集合重叠

保留现有 `article` 集合，并将普通页面集合的排除规则改为：

```ts
const commonPageCollection = defineCollection({
  source: {
    include: '**/*.md',
    exclude: ['article/**', '**/_*']
  },
  type: 'page',
  schema: pageSchama
});
```

这样不改变普通页面的路径或渲染逻辑：`/about` 等仍由 `commonPage` 查询；文章详情页仍由现有 `article` 查询。唯一变化是文章不再被重复放进 `commonPage`。

### 5.2 `app/utils/article.ts`

在现有导出后追加以下查询函数：

```ts
export const queryArticleSearchSections = () =>
  queryCollectionSearchSections('article', {
    minHeading: 'h2',
    maxHeading: 'h6',
    extraFields: ['date']
  });
```

约束：

- 不改动现有的 `queryArticlesByCategory`、`queryAllArticles` 行为；
- `minHeading: 'h2'` 与文章详情页目录范围一致；
- `date` 是唯一额外字段，用于搜索结果右侧日期；
- 不查询 `commonPage`。

### 5.3 新建 `app/composables/useArticleSearch.ts`

该文件应该是**纯逻辑层**：不取路由、不操作 DOM、不直接发起 Nuxt Content 查询。页面负责数据获取，组合式函数负责把 sections 转为可查询索引。

#### 建议数据类型

```ts
import MiniSearch from 'minisearch';
import type { Section } from '@nuxt/content';

export type ArticleSearchSection = Section & {
  date?: string | Date;
};

export type ArticleSearchResult = {
  id: string;
  title: string;
  articleTitle: string;
  breadcrumb: string[];
  content: string;
  date?: string | Date;
  score: number;
};
```

`articleTitle` 规则：

```ts
const articleTitle = result.titles[0] || result.title;
```

- 根分段 `titles` 为空，因此回退为 `result.title`；
- 标题分段的 `titles[0]` 是文章标题；
- 结果 UI 可显示 `articleTitle`，并在命中的是文章小节时追加 `· ${result.title}` 或面包屑。

#### tokenizer（必须保持无第三方依赖）

```ts
const HAN_RUN = /^\p{Script=Han}+$/u;
const SEARCH_PARTS = /\p{Script=Han}+|[\p{L}\p{N}]+/gu;

export const tokenizeArticleSearchText = (text: string) => {
  const parts = text
    .normalize('NFKC')
    .toLocaleLowerCase()
    .match(SEARCH_PARTS) ?? [];

  return parts.flatMap((part) => {
    if (!HAN_RUN.test(part)) return [part];

    const characters = Array.from(part);
    const bigrams = characters.slice(0, -1).map((character, index) =>
      `${character}${characters[index + 1]}`
    );

    return [...characters, ...bigrams];
  });
};
```

注意：不要用 `text.split('')`，避免 Unicode 代理对问题；使用 `Array.from`。

#### 索引构建和查询策略

```ts
const index = new MiniSearch<ArticleSearchSection>({
  fields: ['title', 'content'],
  storeFields: ['id', 'title', 'titles', 'content', 'date', 'level'],
  tokenize: tokenizeArticleSearchText
});

index.addAll(sections);
```

查询选项固定如下：

```ts
{
  combineWith: 'AND',
  boost: { title: 6, content: 1 },
  fuzzy: false,
  prefix: (term, index, terms) =>
    index === terms.length - 1 && /^[a-z0-9]+$/i.test(term) && term.length >= 2
}
```

设计理由：

- `AND`：连续中文查询中的单字/双字必须共同命中，结果更准确；
- `title: 6`：文章标题、正文小节标题优先于普通正文；
- `fuzzy: false`：中文单字模糊匹配容易产生大量无关结果；
- `prefix`：只让末尾英文/数字词支持输入中前缀匹配，例如 `nu` 可命中 `nuxt`；中文已通过 n-gram 支持子串匹配，无须 fuzzy/prefix；
- 单次结果最多取 **30 条**，防止大内容库时渲染过多。

空白、纯标点或 tokenizer 产出为空时，结果必须返回空数组，不能调用 MiniSearch 搜索。

#### 摘要与高亮策略

- 摘要来源是命中 section 的 `content`；
- 先压缩连续空白，再截取约 140–180 个字符；
- 若 `content` 为空（例如仅标题分段），显示“标题匹配”或显示祖先标题路径；
- 不使用 `v-html`；若要标记匹配字符，组合式函数应返回安全文本片段：

```ts
type HighlightPart = { text: string; matched: boolean };
```

模板以 `v-for` 渲染普通 `<span>` / `<mark>`。所有动态文本都通过 Vue 插值输出。

建议简化实现：首版可以先不做命中高亮，只输出安全纯文本摘要；搜索命中与跳转优先级高于视觉高亮。若实现高亮，必须保持上述安全规则。

#### 推荐公开 API

```ts
export const useArticleSearch = (sections: MaybeRef<ArticleSearchSection[] | null | undefined>) => {
  // 返回：query、results、searchableCount、hasSearchableQuery、formatDate、getResultTitle、getResultSummary
};
```

或者由页面持有 `query`，组合式函数仅返回 `search(sections, query)`；二者均可，但必须满足：

- MiniSearch index 在 `sections` 实际变化时重建；
- 输入变化只执行本地查询，**不得**再次请求 Content API；
- 初始空查询不渲染“所有文章”列表；
- 逻辑可在 SSR 中安全执行（MiniSearch 不依赖 `window`）。

### 5.4 新建 `app/pages/search.vue`

#### 数据加载

```ts
<script setup lang="ts">
useHead({ title: '搜索文章' });

const { data: sections, status, error } = await useAsyncData(
  'article-search-sections',
  queryArticleSearchSections
);

// 将 sections 传入 useArticleSearch
</script>
```

约束：

- `useAsyncData` key 必须固定为 `article-search-sections`；
- 保持顶层 `await`，使静态生成阶段写入 `/search` payload；
- 不需要额外 API route；
- 出错时展示站点风格的中文错误文案，并可展示 `error.statusMessage` 作为开发辅助；
- 不因搜索页出错影响其他页面。

#### UI 结构

```text
<CategorySecond title="搜索文章" />
<section class="搜索输入区域">
  输入框 + 文字“清空”按钮（有输入时出现）
  仅在有效搜索词输入后显示查询结果数量或未搜到提示（aria-live）
</section>
<section class="结果区域">
  加载态 / 错误态 / 结果列表
</section>
```

视觉规则：

- 顶部继续使用 `CategorySecond`，与文章页二级栏目条一致；
- 搜索框外层使用 `theme-border-secondary`，焦点态使用主题主色；
- 不添加 `rounded-*`、渐变、悬浮卡片、玻璃拟态或大阴影；
- 结果行沿用 `ArticleList.vue`：奇数白色、偶数 `#fefaf6`，hover 为 `bg-leftbar-bg`；
- 结果链接使用 `NuxtLink :to="result.id"`，确保 anchor 保留；
- 日期右对齐，窄屏下可换行但不得挤压标题；
- 摘要最多两行，且不能横向溢出；
- 输入框有正确的 `<label class="sr-only">`、`type="search"`、清晰的 placeholder；
- 结果数量容器只在有效搜索词输入后出现，并使用 `aria-live="polite"`，让辅助技术获知更新；
- 清空按钮应设置 `type="button"` 和 `aria-label="清空搜索关键词"`；隐藏 `type="search"` 浏览器原生取消图标，避免与文字“清空”按钮重复；
- 不默认 `autofocus`，避免移动端刚进入页面即弹出键盘。

#### 状态文案（固定中文）

| 状态 | 文案 |
| --- | --- |
| 数据准备中 | `正在准备文章索引…` |
| 初始空状态 / 纯标点或无有效 token | 不显示额外提示或空状态行。 |
| 搜索无结果 | 输入框下方显示 `没有找到与“{query}”相关的文章。` |
| 有结果 | 输入框下方显示 `找到 {n} 条相关内容` |
| 索引错误 | `文章索引暂时无法读取，请稍后重试。` |

不得在结果区域重复渲染初始引导或无结果文案；结果区域只保留加载、错误和实际结果列表。

#### 结果行内容优先级

1. 主标题：文章标题；
2. 若命中小节：主标题下显示小节标题/面包屑，例如 `文章标题 · 二级标题`；
3. 右侧日期：`YYYY-MM-DD`；
4. 下方摘要：section 正文前 140–180 字；
5. 若没有正文摘要：显示 `标题匹配`，不留下空白行。

### 5.5 `app/components/bar/BarLeft.vue`

在“文章”下的 `children` 内，紧邻“全部文章”后增加：

```ts
{
  title: ['搜索文章'],
  url: '/search'
},
```

现有菜单高亮条件是 `route.path` 与 `item2.url` 的比较，`/search` 无需额外改动。移动端抽屉复用了该组件，也会自动拥有入口。

### 5.6 `nuxt.config.ts`

在保留原有 `autoSubfolderIndex: true` 的前提下，修改为：

```ts
nitro: {
  prerender: {
    autoSubfolderIndex: true,
    routes: ['/search']
  }
}
```

不要替换或删除已有 Nitro 配置。

---

## 6. 推荐的实现顺序（不得跳步回头全量勘察）

> **当前进度：第 1–5 步已经完成；第 6–7 步因用户要求暂停。** 不要重新执行已完成步骤，也不要为了“确认上下文”扫描整个项目。

1. **先消除集合重叠**：只改 `content.config.ts`，让 `commonPage` 排除 `article/**`；
2. **添加查询导出**：只改 `app/utils/article.ts`，并且只查询 `article`；
3. **实现纯搜索组合式函数**：新建 `app/composables/useArticleSearch.ts`，先确保 tokenizer、索引和查询的 TypeScript 正确；
4. **实现页面**：新建 `app/pages/search.vue`，完成所有状态和结果链接；
5. **接入导航与预渲染**：分别小改 `BarLeft.vue`、`nuxt.config.ts`；
6. **验证**：依次执行 lint、静态生成，并检查生成产物；
7. **只修复验证确实报告的问题**，不要重新扫描不相关文件。

---

## 7. 验证清单

> **当前禁止执行。** 本节保留为用户明确允许恢复验证后的单一入口；在此之前，不能运行其中的命令。

### 7.1 自动验证

在仓库根目录执行：

```bash
pnpm lint
pnpm generate
```

验证点：

- ESLint 无新增错误；
- Nuxt Content 查询和 MiniSearch 类型/构建无错误；
- `nuxt generate` 成功；
- 生成产物中存在搜索页，例如 `.output/public/search/index.html`（实际目录依 Nitro 输出为准）；
- `/search` payload 内含文章分段数据或页面构建时可正常水合的数据引用。

说明：此前开发服务器端口曾不可用，因此不把启动 dev server 作为阻塞验证项；以 lint 和 generate 为必要检查。

### 7.2 手动功能验证

使用当前仓库中已存在的文章内容进行验证：

| 输入 | 期望 |
| --- | --- |
| `标题样式测试` | 命中 `content/article/tech/2025-11-19-heading-style-test.md` 的文章标题。 |
| `二级标题` | 命中对应正文分段，点击后 URL 带 `#` 且页面滚动到标题。 |
| `Nuxt` 或项目中实际英文术语 | 能按英文词搜索；输入前缀时末尾英文词可匹配。 |
| 一个不存在词 | 显示无结果状态，不报错。 |
| 空输入 | 显示引导文案，不展示所有文章。 |
| 仅 `!@#` | 显示“请输入中文、英文或数字关键词。” |
| 手机宽度 | 输入、日期、摘要无横向滚动；侧边栏入口在抽屉中可用。 |

### 7.3 回归验证

- 文章列表页、分类页、文章详情页仍可生成；
- 既有文章 hash 跳转仍按 `router.options.ts` 生效；
- 不出现同一篇文章因 `commonPage` 重复索引的结果；
- `git diff` 中不应包含 `app/assets/index.scss` 或 `app/pages/[...slug].vue` 的非用户原有搜索无关修改。

---

## 8. 故障处理决策表

| 现象 | 首先检查 | 处理方式 |
| --- | --- | --- |
| `/search` 是 404 或未静态生成 | `nuxt.config.ts` 的 `nitro.prerender.routes` | 确认保留 `autoSubfolderIndex` 并添加 `'/search'`。 |
| 搜索结果为空 | `sections` 是否有数据、tokenizer 是否产出 token | 首先记录 section 数量与 token；不要改为 `commonPage`。 |
| 中文连续词不命中 | tokenizer 是否将汉字拆成单字 + bigram | 修复 regex/`Array.from`，不要退回 MiniSearch 默认 tokenizer。 |
| 标题搜索产生多条同文重复 | 是否错误地把文章标题复制到每个 section | 直接索引 Content 原始 section；根 section 已携带文章标题。 |
| 点击结果未跳转到段落 | `NuxtLink` 是否使用 `result.id` | 不要手动去掉 `#anchor`。 |
| 类型无法识别 `date` | `extraFields: ['date']` 和 Content 类型生成状态 | 保留该 extra field；必要时仅在本地结果类型中将 date 设为可选。 |
| 页面首次加载再次请求或闪烁 | `useAsyncData` key / payload 复用 | 使用固定 key，避免在 `onMounted` 再查 Content。 |

---

## 9. 完成定义（Definition of Done）

只有同时满足以下全部条件，才能宣布功能完成：

- [x] `/search` 页面和预渲染配置已经写入；静态生成结果待用户允许后确认；
- [x] 左侧桌面菜单和移动端抽屉均已接入“搜索文章”入口；
- [x] 标题和正文检索逻辑已经实现；
- [x] 连续中文关键词 tokenizer 已实现；
- [x] 结果链接保留文章路径和正文标题锚点；
- [x] UI 已复用现有栏目条、主题色、交替列表风格；
- [x] 已实现加载、空输入、无结果、错误状态；
- [x] 搜索内容未使用 `v-html`；
- [x] 未新增或升级依赖；
- [ ] `pnpm lint` 与 `pnpm generate` 成功（**按用户指令暂停**）；
- [x] 未覆盖用户已有的 `index.scss` 改动；`[...slug].vue` 仅保留原目录粘性改动并加入已记录的普通页目录/宽度修复。
