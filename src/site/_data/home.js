require("dotenv").config();

const GARDEN_ENTRY = process.env.HOME_GARDEN_URL || "/garden/";

/** 摄影区第一组滚轴：三行图片；第二组为无缝滚动复制用（取前两行），与原版 index.html 一致。 */
const photoRows = [
  [
    { src: "https://picsum.photos/seed/hs-wf-01/720/400", alt: "占位 01", w: 720, h: 400 },
    { src: "https://picsum.photos/seed/hs-wf-02/400/640", alt: "占位 02", w: 400, h: 640 },
    { src: "https://picsum.photos/seed/hs-wf-03/840/420", alt: "占位 03", w: 840, h: 420 },
    { src: "https://picsum.photos/seed/hs-wf-04/480/640", alt: "占位 04", w: 480, h: 640 },
    { src: "https://picsum.photos/seed/hs-wf-05/640/480", alt: "占位 05", w: 640, h: 480 },
    { src: "https://picsum.photos/seed/hs-wf-06/520/640", alt: "占位 06", w: 520, h: 640 },
    { src: "https://picsum.photos/seed/hs-wf-07/900/400", alt: "占位 07", w: 900, h: 400 },
  ],
  [
    { src: "https://picsum.photos/seed/hs-wf-08/680/380", alt: "占位 08", w: 680, h: 380 },
    { src: "https://picsum.photos/seed/hs-wf-09/420/640", alt: "占位 09", w: 420, h: 640 },
    { src: "https://picsum.photos/seed/hs-wf-10/760/440", alt: "占位 10", w: 760, h: 440 },
    { src: "https://picsum.photos/seed/hs-wf-11/500/640", alt: "占位 11", w: 500, h: 640 },
    { src: "https://picsum.photos/seed/hs-wf-12/800/420", alt: "占位 12", w: 800, h: 420 },
    { src: "https://picsum.photos/seed/hs-wf-13/560/640", alt: "占位 13", w: 560, h: 640 },
    { src: "https://picsum.photos/seed/hs-wf-14/920/380", alt: "占位 14", w: 920, h: 380 },
  ],
  [
    { src: "https://picsum.photos/seed/hs-wf-15/600/400", alt: "占位 15", w: 600, h: 400 },
    { src: "https://picsum.photos/seed/hs-wf-16/440/640", alt: "占位 16", w: 440, h: 640 },
    { src: "https://picsum.photos/seed/hs-wf-17/780/420", alt: "占位 17", w: 780, h: 420 },
    { src: "https://picsum.photos/seed/hs-wf-18/640/520", alt: "占位 18", w: 640, h: 520 },
    { src: "https://picsum.photos/seed/hs-wf-19/480/640", alt: "占位 19", w: 480, h: 640 },
    { src: "https://picsum.photos/seed/hs-wf-20/860/400", alt: "占位 20", w: 860, h: 400 },
  ],
];

module.exports = {
  lang: process.env.HOME_LANG || "zh-CN",
  meta: {
    title: process.env.HOME_META_TITLE || "海树 · 客户端工程师",
    description:
      process.env.HOME_META_DESCRIPTION ||
      "海树 — 客户端工程师。Android、iOS、Web、Flutter。",
  },
  fontsCss: process.env.HOME_FONTS_CSS || "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans+SC:wght@400;500;600;700&display=swap",

  brand: {
    text: process.env.HOME_BRAND || "海树",
    href: process.env.HOME_BRAND_HREF || "#top",
  },

  nav: [
    { label: "介绍", href: "#intro" },
    { label: "技术", href: "#stack" },
    { label: "作品", href: "#work" },
    { label: "博客", href: "/blog/" },
    { label: "花园", href: GARDEN_ENTRY },
    { label: "摄影", href: "#photos" },
  ],

  hero: {
    wave: process.env.HOME_HERO_WAVE || "你好",
    waveEmoji: "👋",
    nameHtml: process.env.HOME_HERO_NAME || "我是海树",
    en: process.env.HOME_HERO_EN || "A builder across Android, iOS, Web & Flutter",
    tag: process.env.HOME_HERO_TAG || "多平台客户端 · 工程与体验并重",
    primaryActions: [
      { label: "看作品", href: "#work" },
      { label: "读介绍", href: "#intro" },
    ],
    social: [
      {
        label: "GitHub",
        href: process.env.HOME_SOCIAL_GITHUB || "https://github.com/yourusername",
        icon: "https://cdn.simpleicons.org/github/b8c5cc",
      },
      {
        label: "掘金",
        href: process.env.HOME_SOCIAL_JUEJIN || "https://juejin.cn/user/your-user-id",
        icon: "https://cdn.simpleicons.org/juejin/1E80FF",
      },
    ],
  },

  intro: {
    eyebrow: "About",
    title: "自我介绍",
    lead: "网名海树，长期做客户端方向。",
    paragraphs: [
      '以 <strong>Android</strong> 为主场，同时接触 <strong>iOS</strong>、<strong>Web</strong>、<strong>Flutter</strong> 等栈；关心架构、性能、动效与可访问性，也愿意在工具链和视觉表达上多走一步。',
      "工作之余会写点东西、维护个人知识网络，也用相机记录城市和自然。下面各区块可按需替换成你的真实链接与素材。",
    ],
  },

  stack: {
    eyebrow: "Stack",
    title: "技术栈",
    lead: "当前重心与常用能力。",
    items: [
      {
        name: "Android",
        meta: "Kotlin · Jetpack · Compose / View",
        icon: "https://cdn.simpleicons.org/android/3DDC84",
        delay: 40,
      },
      {
        name: "Flutter",
        meta: "跨端 UI · 业务与组件沉淀",
        icon: "https://cdn.simpleicons.org/flutter/02569B",
        delay: 80,
      },
      {
        name: "iOS",
        meta: "Swift · UIKit / SwiftUI",
        icon: "https://cdn.simpleicons.org/swift/F05138",
        delay: 120,
      },
      {
        name: "Web",
        meta: "TypeScript · 工程化与端能力边界",
        icon: "https://cdn.simpleicons.org/typescript/3178C6",
        delay: 160,
      },
    ],
  },

  work: {
    eyebrow: "Portfolio",
    title: "作品",
    lead: "做过的事，记下来，时常复盘——和「作品集」区块的叙事一样。",
    cards: [
      {
        title: "主力产品 / App",
        text: "替换为应用名、一句话介绍与商店或下载链接。",
        tag: "占位",
        delay: 50,
      },
      {
        title: "开源与工具",
        text: "库、脚手架、脚本或内部提效项目。",
        tag: "占位",
        delay: 100,
      },
      {
        title: "实验与原型",
        text: "新技术验证、小想法的可运行版本。",
        tag: "占位",
        delay: 150,
      },
    ],
  },

  blog: {
    eyebrow: "Blog",
    title: "博客",
    lead: "长文、教程与复盘。",
    callout: "与数字花园同级数据源：时间线、标签、全文搜索入口均在站内博客页。",
    cta: {
      label: "前往博客",
      href: process.env.HOME_BLOG_URL || "/blog/",
    },
  },

  garden: {
    eyebrow: "Digital Garden",
    title: "数字花园",
    lead: "第二大脑 · 非线性笔记与链接。",
    proseHtml:
      '<p>像参考站里「我的第二大脑」一样，花园适合放<strong>持续迭代</strong>的短笔记、索引页与双向链接；与按时间排序的博客形成互补。</p><p>本站数字花园入口：<a href="' +
      GARDEN_ENTRY +
      '">打开数字花园（本仓库 Obsidian Digital Garden）</a>。</p>',
    nodes: [
      {
        type: "Seed",
        title: "进入花园首页",
        hint: "gardenEntry 笔记",
        href: GARDEN_ENTRY,
        external: false,
        delay: 60,
      },
      {
        type: "MOC",
        title: "主题地图",
        hint: "聚合链接",
        href: GARDEN_ENTRY,
        external: false,
        delay: 100,
      },
      {
        type: "Evergreen",
        title: "常读常新",
        hint: "随想随改",
        href: GARDEN_ENTRY,
        external: false,
        delay: 140,
      },
    ],
  },

  photos: {
    eyebrow: "Photography",
    title: "摄影作品",
    lead: "快门轻轻，让远山与余光在画面里走得比记忆更慢。",
    rows: photoRows,
    /** 无缝滚动第二轨：与原版一致取前两行 */
    duplicateRows: photoRows.slice(0, 2),
  },

  footer: {
    copyName: process.env.HOME_FOOTER_NAME || "海树 · 客户端工程师",
    links: [
      {
        label: "GitHub",
        href: process.env.HOME_SOCIAL_GITHUB || "https://github.com/yourusername",
      },
      {
        label: "掘金",
        href: process.env.HOME_SOCIAL_JUEJIN || "https://juejin.cn/user/your-user-id",
      },
    ],
  },
};
