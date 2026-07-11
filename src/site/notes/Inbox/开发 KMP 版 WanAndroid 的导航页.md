---
{"dg-publish":true,"permalink":"/Inbox/开发 KMP 版 WanAndroid 的导航页/","tags":["编程","KMP","Kotlin"],"noteIcon":"","created":"2026-04-19","updated":"2026-04-20T22:51:04.386+08:00","dg-note-properties":{"date":"2026-04-19","tags":["编程","KMP","Kotlin"],"wip":true}}
---

# 前言

去年，笔者 [[WanAndroid 项目迁移 KMP \| 将 WanAndroid 项目迁移到 KMP]]，在已有的 Android 项目中新建了一个 wanKmp 的 KMP 模块，添加了基础的 CMP 和 KMP 的代码，并在项目里新建了一个 iOS 工程，把 wanKmp 模块接入，解决掉一些编译问题后，成功在双端都接入 KMP。原本计划趁热将原来 Android 项目的业务代码逐步迁移到 KMP 模块中，但却迟迟没有开展，一直拖到现在。最近，笔者又将这件事捡起来，第一个迁移的模块是 WanAndroid 项目中的导航页面。

此次改造，是笔者 WanAndroid 项目的第三次大更新（第一次是 Java 语言 + MVP 应用架构；第二次是 Kotlin 语言 + MVVM 应用架构），在这次改造中，笔者也希望对原本的 UI 界面进行修改。同时，现在 AI Coding 已经发展得非常厉害，此次改造也将借助 AI Coding 工具，提升开发效率，并更加深入地体验 AI Coding，跟上时代。

这篇文章，将总结笔者使用 Cursor 来开发 WanAndroid 的导航页的过程。



