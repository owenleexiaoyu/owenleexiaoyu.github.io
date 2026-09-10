module.exports = {
  year: new Date().getFullYear(),
  meta: {
    title: "海树 · 客户端工程师",
    description: "海树的个人主页：客户端开发、作品、写作与数字花园。",
  },
  profile: {
    eyebrow: "Hello, welcome to my site",
    name: "海树",
    role: "客户端工程师",
    intro:
      "以 Android 为主场，也持续探索 iOS、Web 与 Flutter。我关心工程质量，也在意产品最终抵达人的方式。",
    note:
      "这里收录我的项目、技术实践和长期写作。博客适合顺着时间阅读，数字花园则保留想法生长的路径。",
  },
  skills: [
    { name: "Android", detail: "Kotlin · Jetpack · Compose / View", tone: "green" },
    { name: "Flutter", detail: "跨端 UI · 组件与业务实践", tone: "blue" },
    { name: "iOS", detail: "Swift · UIKit / SwiftUI", tone: "coral" },
    { name: "Web", detail: "TypeScript · 前端工程化", tone: "yellow" },
  ],
  projects: [
    {
      title: "WanAndroid",
      description: "使用 KMP 和 CMP 技术开发 WanAndroid App",
      href: "https://github.com/owenleexiaoyu/WanAndroid",
      label: "持续维护",
    },
    {
      title: "GeekLibrary",
      description: "把好课程，变成真正可用的知识。",
      href: "https://lixiaoyu.life/GeekLibrary/",
      label: "课程更新中",
    },
  ],
  series: [
    {
      title: "Android 开发",
      description: "从头开始的 Android 学习笔记。",
      href: "/HaiShu/Android/🤖 Android MOC/",
      image: "https://img.lixiaoyu.life/blog-res/2024/12/3b0ab26ccd242b5ca29063f55daaaafe.png",
    },
    {
      title: "Kotlin 笔记",
      description: "语言基础、工程实践与 Kotlin Multiplatform。",
      href: "/HaiShu/Kotlin/🟪 Kotlin MOC/",
      image: "https://img.lixiaoyu.life/blog-res/2024/12/9ea76cc5422c0d5dfabe553c727c2113.png",
    },
    {
      title: "Flutter 实践",
      description: "跨端开发、常用插件和有趣的小型应用。",
      href: "/HaiShu/Flutter/🦋 Flutter MOC/",
      image: "https://img.lixiaoyu.life/blog-res/2024/12/be14ab2f8c2afdf46dc80bffc6c92d80.webp",
    },
  ],
  socials: [
    {
      label: "GitHub",
      href: "https://github.com/owenleexiaoyu",
      icon: "/plugins/owen-personal-site/assets/github.svg",
    },
    {
      label: "掘金",
      href: "https://juejin.cn/user/2770425030649662",
      icon: "/plugins/owen-personal-site/assets/juejin.svg",
    },
  ],
};
