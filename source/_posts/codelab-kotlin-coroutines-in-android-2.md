---
title: 在你的 Android 程序中使用协程（2）
date: 2021-05-24 02:00
tags: ["Kotlin", "协程"]
categories: 译文
---

## 2. 准备

### 下载代码

点击 [链接](https://github.com/googlecodelabs/kotlin-coroutines/archive/master.zip) 下载所有代码。

或者使用以下命令从命令行克隆 GitHub 存储库：

```
git clone https://github.com/googlecodelabs/kotlin-coroutines.git
```

>kotlin-coroutine 仓库包含两个代码库的代码。这个 Codelab 使用 的是 `coroutines-codelab` 目录中的项目。这个项目中有两个应用程序模块：
>
>**start** — 使用 Android 架构组件的简单应用程序，你可以在其中添加协程
>
>**finished_code** — 已经添加了协程代码的项目，以供对照