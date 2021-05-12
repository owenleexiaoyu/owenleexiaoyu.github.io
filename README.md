# owenleexiaoyu.github.io
the website of owen

owenleexiaoyu.github.io 项目有两个分支

- **master**：这个是hexo编译出来的静态网页内容，每次通过 `hexo d -g` 命令部署后，就会将网页内容 push 到这个分支上。
- **blog_source**：这个是 2021-05-12 这个时间点把本地博客系统的源码也加到版本控制中，里面存放了hexo的配置，主题的配置，markdown 格式的博客原文。
  - blog_source 分支应用的主题是 `livemylife`（2021-05-12）

本地应该基于 `blog_source` 添加文章。这里的文章是最全的。
主题变更之后需要从 `blog_source` 中切出新的 source 分支，比如想重新使用 `material` 主题，可以从现在的 `blog_source` 切出一个 `blog_source_material` 分支，重新进行主题配置。
