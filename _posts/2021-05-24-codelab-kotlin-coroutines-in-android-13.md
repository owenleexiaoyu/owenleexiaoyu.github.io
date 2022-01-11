---
layout: post
title: 在你的 Android 程序中使用协程（13）
date: 2021-05-24 13:00
tags: ["Kotlin", "协程"]
categories: 译文
---

## 13. 恭喜你

在这个 Codelab，我们已经涵盖了基础知识，你将需要开始在你的应用程序中使用协程。

这个 Codelab 的内容包含：

- 如何将 UI 和 WorkManager 中的协程集成到 Android 应用程序中，以简化异步编程,
- 如何使用协程从网络中获取数据并将其保存到数据库而不会阻塞主线程
- 以及在 ViewModel 结束时，如何取消所有协程

为了测试基于协程的代码，我们介绍了测试行为以及直接从测试中调用 suspend 函数。

### 了解更多

查看 [Advanced Coroutines with Kotlin Flow and LiveData](https://developer.android.com/codelabs/advanced-kotlin-coroutines/index.html) Codelab 来了解更多 Android 上协程的高级使用。

要了解关于协程中的取消和异常的更多信息，请参阅本系列文章：[第 1 部分: 协程](https://medium.com/androiddevelopers/coroutines-first-things-first-e6187bf3bb21)，[第 2 部分: 协程中的取消](https://medium.com/androiddevelopers/cancellation-in-coroutines-aa6b90163629)，以及 [第 3 部分: 协程中的异常](https://medium.com/androiddevelopers/exceptions-in-coroutines-ce8da1ec060c)。

Kotlin 协程还有许多这个 Codelab 没有涵盖的特性。如果你有兴趣了解更多关于 Kotlin 协程的信息，请阅读 JetBrains 出版的 [协程指南](https://kotlinlang.org/docs/coroutines-guide.html#table-of-contents)。还可以查看 [使用 Kotlin 协程提高应用程序性能](https://developer.android.com/kotlin/coroutines)，了解更多 Android 协程的使用模式。

