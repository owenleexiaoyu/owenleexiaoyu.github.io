---
layout: post
title: 在你的 Android 程序中使用协程（4）
date: 2021-05-24 04:00
tags: ["Kotlin", "协程"]
categories: 译文
---

## 4. Kotlin 的协程

在 Android 上，避免阻塞主线程是很重要的。主线程是一个处理所有 UI 更新的线程，它也是处理所有点击事件和其他 UI 回调的线程。因此，它必须运行平稳，以保证良好的用户体验。

为了让你的应用程序显示给用户时没有任何可见的停顿，主线程必须每 16 毫秒或更长时间更新一次屏幕，也就是大约 60 秒帧率。许多常见的任务需要更长的时间，比如解析大型 JSON 数据集、将数据写入数据库或从网络获取数据。因此，从主线程调用这样的代码会导致应用程序暂停、停顿甚至冻结。如果你阻塞主线程太长时间，应用程序甚至可能崩溃，并出现一个应用程序无响应对话框。

观看下面的视频，了解协程是如何通过引入 main-safety（主线程安全） 为我们在 Android 上解决这个问题的。

<iframe width="560" height="315" src="https://www.youtube.com/embed/ne6CD1ZhAI0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### 回调模式

在不阻塞主线程的情况下执行长时间运行的任务的一种模式是回调。使用回调，可以在后台线程上启动长时间运行的任务。当任务完成时，调用回调函数来通知主线程结果。我们来看一个回调模式的例子：

```kotlin
// Slow request with callbacks
@UiThread
fun makeNetworkRequest() {
    // The slow network request runs on another thread
    slowFetch { result ->
        // When the result is ready, this callback will get the result
        show(result)
    }
    // makeNetworkRequest() exits after calling slowFetch without waiting for the result
}
```

因为这段代码使用了 `@UiThread` 注解，所以它必须运行得足够快才能在主线程上执行。这意味着，它需要非常迅速地返回，以便下一次屏幕更新不会延迟。但是，由于 `slowFetch` 需要几秒甚至几分钟才能完成，因此主线程不能等待结果。`show (result)` 回调允许 slowFetch 在后台线程上运行，并在结果准备好时返回结果。

### 使用协程来消除回调

回调是一种很好的模式，但是它也有一些缺点。大量使用回调的代码可能变得难以阅读，也难以理解。此外，回调不允许使用某些语言特性，例如异常。

Kotlin 协程可以让你将基于回调的代码转换为顺序代码。按顺序编写的代码通常更容易阅读，还可以使用异常等语言特性。

最后，它们做完全相同的事情：`等待一个长时间运行的任务得到结果，然后继续执行`。然而，在代码中它们看起来非常不同。

`suspend` 是 Kotlin 标记可用于协程的函数或函数类型的关键字。当一个协程调用一个标记为 suspend 的函数时，不像正常函数一样阻塞直到该函数返回，它会挂起执行直到结果准备好，然后在结果中断的地方恢复执行。当它挂起等待结果时，它解除了在其上运行的线程的阻塞，这样其他函数或协程就可以运行了。

例如，在下面的代码中，`makeNetworkRequest()` 和 `slowFetch()` 都是 suspend 函数。

```kotlin
// Slow request with coroutines
@UiThread
suspend fun makeNetworkRequest() {
    // slowFetch is another suspend function so instead of 
    // blocking the main thread  makeNetworkRequest will `suspend` until the result is 
    // ready
    val result = slowFetch()
    // continue to execute after the result is ready
    show(result)
}

// slowFetch is main-safe using coroutines
suspend fun slowFetch(): SlowResult { ... }
```

就像回调版本一样，`makeNetworkRequest` 必须立即从主线程返回，因为它标记为 `@UiThread`。这意味着它通常不能调用像 slowFetch 这样的阻塞方法。这就是 suspend 关键字的神奇之处。

> 重要提示: suspend 关键字不指定代码运行的线程。挂起函数可以在后台线程或主线程上运行。

和回调相比，用协程可以用更少的代码实现同样的结果，即解除对当前线程的阻塞。由于它的顺序样式，很容易链接几个长时间运行的任务而不创建多个回调。例如，从两个网络请求中获取结果并将其保存到数据库的代码可以作为函数编写在协程中，而不需要回调。像这样：

```kotlin
// Request data from network and save it to database with coroutines

// Because of the @WorkerThread, this function cannot be called on the
// main thread without causing an error.
@WorkerThread
suspend fun makeNetworkRequest() {
    // slowFetch and anotherFetch are suspend functions
    val slow = slowFetch()
    val another = anotherFetch()
    // save is a regular function and will block this thread
    database.save(slow, another)
}

// slowFetch is main-safe using coroutines
suspend fun slowFetch(): SlowResult { ... }
// anotherFetch is main-safe using coroutines
suspend fun anotherFetch(): AnotherResult { ... }
```

> **协程的另一个名字**
>
> 其他语言中的 async 和 await 模式是基于协程的。如果你熟悉这种模式，那么 suspend 关键字类似于 async。但是在 Kotlin 中，当调用一个 suspend 函数时，await() 是隐式的。
>
> Kotlin 有一个方法 deferd.await ()，用于等待 async 方式启动的协程的结果。

在下一节中，你会在示例应用程序中使用协程。

