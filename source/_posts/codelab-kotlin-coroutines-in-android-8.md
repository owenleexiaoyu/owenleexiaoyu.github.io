---
title: 在你的 Android 程序中使用协程（8）
date: 2021-05-24 08:00
tags: ["Kotlin", "协程"]
categories: 译文
---

## 8. 从阻塞代码生成 main-safe 函数

在这个练习中，您将学习如何切换线程到使用协程，以实现协程版本的 `TitleRespository`。

### 检查 refreshTitle 中的现有回调代码

打开 `TitleRepository.kt` 并检查现在基于回调的实现。

```kotlin
// TitleRepository.kt

fun refreshTitleWithCallbacks(titleRefreshCallback: TitleRefreshCallback) {
   // This request will be run on a background thread by retrofit
   BACKGROUND.submit {
       try {
           // Make network request using a blocking call
           val result = network.fetchNextTitle().execute()
           if (result.isSuccessful) {
               // Save it to database
               titleDao.insertTitle(Title(result.body()!!))
               // Inform the caller the refresh is completed
               titleRefreshCallback.onCompleted()
           } else {
               // If it's not successful, inform the callback of the error
               titleRefreshCallback.onError(
                       TitleRefreshError("Unable to refresh title", null))
           }
       } catch (cause: Throwable) {
           // If anything throws an exception, inform the caller
           titleRefreshCallback.onError(
                   TitleRefreshError("Unable to refresh title", cause))
       }
   }
}
```

在 TitleRepository.kt 中，refreshTitleWithCallbacks 方法通过回调向调用者传递加载和错误状态。

为了实现刷新，这个函数做了很多事情：

1. 使用  `BACKGROUND ExecutorService` 切换到另一个线程
2. 调用 `fetchNextTitle` 的 `execute()` 方法来请求网络，它是阻塞的。它会在 `BACKGROUND` 的一个线程中请求网络。
3. 如果结果成功了，调用 `insertTitle` 保存结果到数据库，并且调用 `onCompleted` 方法。
4. 如果结果失败了，或者发生了异常，调用 `onError` 方法来告知调用方刷新失败。

这个基于回调的实现是主线程安全的，它不会阻塞主线程。但是，当工作完成时，它必须使用回调来通知调用者。它会在 `BACKGROUND` 线程上调用回调方法。

### 从协程中调用阻塞代码

不需要在网络或数据库中引入协程，我们可以使用协程使代码成为 `main-safe` 的。这样我们就可以删除回调函数，并将结果传递回最初调用它的线程。

你可以在需要从协程内部执行阻塞代码或 CPU 密集型工作时使用这个模式，例如对大型列表进行排序和过滤或从磁盘读取。

> 这个模式应该用于在代码中调用在阻塞 API 或执行 CPU 密集型工作。如果可能的话，最好使用类似 Room 或 Retrofit 这样的库中的 suspend 函数（因为他们已经提供了 main-safe）。

协程使用 `withContext` 在任何调度器之间切换。调用 withContext 会将 lambda 中的代码切换到另一个调度器上执行（切到另一个线程），然后将 lambda 的结果返回给调用 withContext 的调度器（把线程切回来）。

默认情况下，Kotlin 协程提供了三种 Dispatchers：`Main`、 `IO` 和 `Default`。IO 调度器针对 IO 工作进行了优化，比如从网络或磁盘读取，而 Default 调度器针对 CPU 密集型任务进行了优化。

```kotlin
suspend fun refreshTitle() {
   // interact with *blocking* network and IO calls from a coroutine
   withContext(Dispatchers.IO) {
       val result = try {
           // Make network request using a blocking call
           network.fetchNextTitle().execute()
       } catch (cause: Throwable) {
           // If the network throws an exception, inform the caller
           throw TitleRefreshError("Unable to refresh title", cause)
       }
      
       if (result.isSuccessful) {
           // Save it to database
           titleDao.insertTitle(Title(result.body()!!))
       } else {
           // If it's not successful, inform the callback of the error
           throw TitleRefreshError("Unable to refresh title", null)
       }
   }
}
```

这个实现对网络和数据库的调用也是阻塞的，但是它仍然比回调版本简单一些。

这段代码仍然使用阻塞调用。调用 `execute()` 和 `insertTitle()` 都会阻塞此协程正在运行的线程。然而，通过使用 `withContext` 切换到 `Dispatchers.IO`，我们阻塞了 `IO` 调度器中的一个线程。而调用这个的协程，可能在 `Dispatchers.Main` 上运行，将被挂起，直到 `withContext` 的 lambda 完成。
与回调版本相比，有两个重要的区别：

1. `withContext` 将结果返回给调用它的调度器，在这个例子中，是 `Dispatchers.Main` 。回调版本的代码中，在 `BACKGROUND` 的一个子线程调用回调的方法，回调方法执行在子线程中。
2. 调用者不需要传递一个回调给阻塞方法，它可以依靠挂起和恢复来拿到结果或者错误。

> **高级提示**
>
> 这代码还不支持协程取消，但它是可以取消的！[协程取消是协作式的](https://kotlinlang.org/docs/reference/coroutines/cancellation-and-timeouts.html)。这意味着每当你调用 kotlinx-coroutine 中的函数时，你的代码都需要显式地检查是否取消。
>
> 因为这个 `withContext` 中只调用了阻塞代码，所以在它从 withContext 返回之前不会被取消。
>
> 为了解决这个问题，你可以定期调用 `yield`，给其他协程一个运行的机会，并检查是否取消。在这里，你将在网络请求和数据库查询之间添加一个 yield 调用。然后，如果协程在网络请求期间被取消，它不会将结果保存到数据库中。
>
> 你还可以显式地检查取消，通常应该在创建低优先级协程时做。

### 再次运行应用程序

如果你再次运行该应用程序，你将看到基于协程的新实现正在从网络加载结果。

在下一步中，你将把协程集成到 Room 和 Retrofit 中。