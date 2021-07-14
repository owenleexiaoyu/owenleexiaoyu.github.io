---
title: 在你的 Android 程序中使用协程（12）
date: 2021-05-24 12:00
tags: ["Kotlin", "协程"]
categories: 译文
---

## 12. 和 WorkManager 一起使用协程

在这个练习中，你将学习如何使用将协程和 `WorkManager` 搭配使用。

### 什么是 WorkManager

对于可延迟的后台工作，Android 有很多选择。这个练习向您展示了如何将 WorkManager 与协程集成。WorkManager 是一个兼容、灵活和简单的库，用于可延期的后台工作。WorkManager 是 Android 上这些用例的推荐解决方案。

WorkManager 是 Android Jetpack 的一部分，是一个后台工作的架构组件，需要将机会执行和有保证的执行结合起来。机会执行意味着 WorkManager 将尽快完成您的后台工作，保证执行意味着即使你离开了你的应用程序，WorkManager 也会处理好在各种情况下开始工作的逻辑。

因此，对于最终必须完成的任务，WorkManager 是一个很好的选择。

下面是一些使用 WorkManager 的好例子:

- 上传日志
- 将过滤器应用于图像并保存图像
- 定期与网络同步本地数据

要了解更多关于 WorkManager 的信息，请查看文档。

### 使用 WorkManager 协程

WorkManager 为不同的使用场景提供 ListenableWorker 的不同实现。

最简单的 Worker 类允许我们让 WorkManager 执行一些同步操作。然而，到目前为止，我们已经将代码转换为使用协程和挂起函数，因此使用 WorkManager 的最佳方式是通过 `CoroutineWorker` 类，该类允许将 `doWork()` 函数定义为一个挂起函数。

首先，打开 RefreshMainDataWork，它已经扩展了 CoroutineWorker，你需要实现 doWork。

在 `suspend doWork` 函数内部，调用 `repository.refreshTitle()` 并返回适当的结果！

在你完成 TODO 之后，代码会是这样的:

```
override suspend fun doWork(): Result {
   val database = getDatabase(applicationContext)
   val repository = TitleRepository(network, database.titleDao)

   return try {
       repository.refreshTitle()
       Result.success()
   } catch (error: TitleRefreshError) {
       Result.failure()
   }
}
```

注意，CoroutineWorker.doWork() 是一个挂起函数。和普通的 Worker 类不同，此代码不在 WorkManager 配置中指定的 Executor 上运行，而是在 coroutineContext 指定的 dispatcher 上运行（默认的是 `Dispatchers.Default`）。

### 测试我们的 CoroutineWorker

没有测试，任何代码都是不完整的。

WorkManager 提供了几种不同的方法来测试你的 Worker 类，要了解更多关于 WorkManager 的测试信息，可以阅读 [**文档**](https://developer.android.com/topic/libraries/architecture/workmanager/how-to/integration-testing)。

WorkManager v2.1引入了一组新的 api，以支持一种更简单的方式来测试 ListenableWorker 类，结果就是测试 CoroutineWorker。在我们的代码中，我们将使用这些新的 API 之一：`TestListenableWorkerBuilder`。

要添加新测试，请更新 `androidTest` 文件夹下的 `RefreshMainDataWorkTest` 文件。

文件的内容如下：

```kotlin
package com.example.android.kotlincoroutines.main

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.work.ListenableWorker.Result
import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.work.ListenableWorker.Result
import androidx.work.testing.TestListenableWorkerBuilder
import com.example.android.kotlincoroutines.fakes.MainNetworkFake
import com.google.common.truth.Truth.assertThat
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4


@RunWith(JUnit4::class)
class RefreshMainDataWorkTest {

@Test
fun testRefreshMainDataWork() {
   val fakeNetwork = MainNetworkFake("OK")

   val context = ApplicationProvider.getApplicationContext<Context>()
   val worker = TestListenableWorkerBuilder<RefreshMainDataWork>(context)
           .setWorkerFactory(RefreshMainDataWork.Factory(fakeNetwork))
           .build()

   // Start the work synchronously
   val result = worker.startWork().get()

   assertThat(result).isEqualTo(Result.success())
}

}
```

在我们开始测试之前，我们告诉 WorkManager 关于 factory 的信息，这样我们就可以注入假的网络数据。

测试本身使用 TestListenableWorkerBuilder 来创建我们的 worker，然后我们可以运行 startWork ()方法。

WorkManager 只是如何使用协程来简化 api 设计的一个例子。

