---
{"dg-publish":true,"permalink":"/DevBits/Vibe Coding 数字花园和博客融合低侵入方案/","tags":["随笔","AI生成"],"noteIcon":"","created":"2026-09-09","updated":"2026-09-10T09:52:47.093+08:00","dg-note-properties":{"date":"2026-09-09","tags":["随笔","AI生成"]}}
---

> 本文档由 Codex Plan 模式生成

**方案摘要**
基于 Digital Garden 官方[插件机制](https://docs.forestry.md/plugins/)，将功能封装在 `src/plugins/owen-personal-site/`，不修改 `.eleventy.js`、核心布局、搜索、文件树或 `userSetup.js`。

博客与 Digital Garden 使用完全相同的内容源：所有 `dg-publish: true` 的笔记都是博客内容，不增加 `dg-blog` 属性。两者只在浏览界面上不同。

路由：

- `/`：个人主页
- `/garden/`：数字花园入口
- `/blog/`：博客列表
- `/blog/tags/`、`/blog/tags/<slug>/`：标签页
- `/blog/timeline/`：时间线

**主页与博客**
- 插件启用时忽略模板自带的兜底首页，通过 Eleventy 虚拟模板生成 `/`；禁用插件时恢复原兜底页。
- 个人主页采用固定暖色视觉，包含简介、技术栈、项目、精选系列、博客与花园入口、社交链接，不包含摄影。
- 主页内容集中在插件内单一配置文件，并按仓库现有资料预填。
- 博客收录全部 `dg-publish: true` 的笔记，但排除 `/garden/` 入口笔记。
- 博客保留旧版文章列表、每页 10 篇分页、标签和时间线结构。
- 博客按 `created` 降序，缺失时回退到 `updated`；摘要从正文移除 HTML 后截取。
- `/garden/` 不进入博客分页、标签和时间线，但仍保留在 Digital Garden 原生搜索结果中。

**博客浏览模式**
- 进入 `/blog/`、标签页或时间线时，在当前标签页写入博客浏览状态并为页面设置 `dg-blog-view` 类。
- 博客列表、搜索结果以及笔记中的同站内部链接都会继续携带博客浏览状态。
- 采用 `sessionStorage` 保存状态，并通过委托式链接处理覆盖动态生成的搜索结果。
- 同站笔记链接额外携带一次性 `view=blog` 参数，目标页面初始化状态后使用 `history.replaceState` 清除参数，保证新标签页和直接导航也能正确进入博客模式。
- 博客模式下隐藏整个文件树导航，包括桌面左侧栏、移动端菜单按钮和遮罩，同时恢复正文居中及正常宽度。
- 隐藏规则由浏览来源决定，不依赖笔记 frontmatter；因此从博客搜索打开任何普通花园笔记，文件树仍保持隐藏。
- 访问 `/garden/` 时，在 head 阶段清除博客状态并移除页面类，文件树立即恢复。
- 直接从花园或外部链接打开普通笔记时，不进入博客模式，文件树按 Digital Garden 原设置显示。
- 右侧目录、反向链接和局部关系图保持原有设置，不受博客模式影响。

**导航与搜索**
- 博客导航包含主页、文章、标签、时间线、搜索和数字花园入口。
- 搜索按钮使用 Lucide 搜索图标和可访问名称，直接调用 `dg-search` 的 `window.toggleSearch()`。
- 博客页面保留 `common.footer` 插槽，由现有 `dg-search` 插件挂载原生搜索框。
- 不复制或覆盖搜索框、搜索结果、预览及快捷键样式。
- 仅在 `dg-search` 已启用且 `dgEnableSearch` 为 `true` 时显示搜索按钮。
- 点击“数字花园”进入 `/garden/`，同时明确结束博客浏览模式。

**入口迁移**
- 原入口笔记移除 `dg-home`，设置 `dg-permalink: garden`；官方支持自定义路径并自动修正笔记链接：[Note Specific Settings](https://docs.forestry.md/advanced/note-specific-settings/)。
- 仓库中的已发布入口笔记同步移除 `gardenEntry` 并改为 `/garden/`。
- Obsidian 源笔记进行相同调整后重新发布，避免后续发布覆盖路由。

**测试与验收**
- 为博客集合、入口排除、排序、摘要、标签 slug、时间线和空状态增加 Vitest 测试。
- 为博客状态初始化、链接传递、一次性参数清理和 `/garden/` 状态退出增加测试。
- 运行 `npm test` 和 `npm run build`，确保无重复路由和插件警告。
- 从博客列表、标签页、时间线和原生搜索框分别打开笔记，桌面及移动端均不得出现文件树。
- 从博客文章继续点击任意内部笔记链接，文件树仍保持隐藏。
- 在博客模式中打开 `/garden/` 后，文件树恢复；随后从花园打开其他笔记也保持正常。
- 直接打开普通笔记时文件树正常显示。
- 验证搜索弹窗外观、预览、关闭行为及 `Ctrl/Cmd+K` 与原版一致。
- 使用默认浅色、默认深色和 Bamboo 在线主题验证博客页面。
- 最终差异仅包含插件目录、插件测试和花园入口笔记的路由元数据，不修改 Digital Garden 核心模板。