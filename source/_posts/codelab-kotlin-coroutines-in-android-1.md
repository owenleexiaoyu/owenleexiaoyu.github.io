---
title: 在你的 Android 程序中使用协程（1）
date: 2021-05-24 01:00
tags: ["Kotlin", "协程"]
categories: 译文
---

## 1. 开始之前

在这个 Codelab 中，你将学习如何在 Android 应用程序中使用 Kotlin 协程，它是管理后台线程的推荐方法，通过减少回调来简化代码。协程是一个 Kotlin 的特性，它将长时间运行任务（例如：访问数据库或网络）的异步回调转换为转化为顺序代码。

这里有一个代码片段，可以让你知道你将要做什么。

```kotlin
// Async callbacks
networkRequest { result ->
   // Successful network request
   databaseSave(result) { rows ->
     // Result saved
   }
}
```

基于回调的代码将使用协程转换为顺序代码。

```kotlin
// The same code with coroutines
val result = networkRequest()
// Successful network request
databaseSave(result)
// Result saved
```

你将从使用 `Architecture Components` 构建的已有应用程序开始，这个应用程序使用回调来处理长时间运行的任务。

在这个 Codelab 的最后，你将有足够的经验使用协程在你的应用程序中从网络加载数据，你将能够集成协程到一个应用程序。你还将熟悉协程的最佳实践，以及如何针对使用协程的代码编写测试。

### 先决条件

- 熟悉 Architecture Components，比如 ViewModel、LiveData、Repository 和 Room。
- 熟悉 Kotlin 语法，包括扩展函数和 lambda
- 理解在 Android 上如何使用线程，包括主线程、后台线程和回调

### 你需要做什么？

- 使用协程编写代码并获得结果
- 使用 `suspend` 函数使异步代码顺序化
- 使用 `launch` 和 `runBlocking` 来控制代码执行的方式
- 学习使用 `suspendCoroutine` 将现有 api 转化为协程
- 将协程和 Architecture Components 搭配使用
- 学习测试协程的最佳实践

> 有关 Room 的介绍，请参阅：[使用 Room Daos 访问数据](https://developer.android.com/training/data-storage/room/accessing-data)
>
> 有关这个代码实现中使用的其他体系结构组件的介绍，请参见[应用程序架构指南](https://developer.android.com/jetpack/docs/guide)
>
> 关于 Android 线程基础介绍，请参见[在后台线程中运行 Android 任务](https://developer.android.com/guide/background/threading)

### 你需要什么？

- Android Studio 4.1（Codelab 的代码可以在其他版本上工作，但是有些东西可能会丢失或者看起来不一样）

