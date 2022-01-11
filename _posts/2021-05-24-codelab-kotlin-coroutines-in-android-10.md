---
layout: post
title: 在你的 Android 程序中使用协程（10）
date: 2021-05-24 10:00
tags: ["Kotlin", "协程"]
categories: 译文
---

## 10. 直接测试协程

在这个练习中，你将编写一个直接调用 suspend 函数的测试。

因为 `refreshTitle` 是作为公共 API 公开的，所以我们会对它直接进行测试，看看如何从测试中调用协程函数。

下面是你在上一个练习中实现的 refreshTitle 函数：

**TitleRepository.kt**

```kotlin
suspend fun refreshTitle() {
   try {
       // Make network request using a blocking call
       val result = network.fetchNextTitle()
       titleDao.insertTitle(Title(result))
   } catch (cause: Throwable) {
       // If anything throws an exception, inform the caller
       throw TitleRefreshError("Unable to refresh title", cause)
   }
}
```

### 编写一个调用挂起函数的测试

在 test 文件夹中打开 `TitleRepositoryTest.kt`。

尝试在 `whenRefreshTitleSuccess_insertsRows` 调用  `refreshTitle`。

```
@Test
fun whenRefreshTitleSuccess_insertsRows() {
   val subject = TitleRepository(
       MainNetworkFake("OK"),
       TitleDaoFake("title")
   )

   subject.refreshTitle()
}
```

因为 refreshTitle 是一个挂起函数，所以 Kotlin 不知道如何调用它，除非是从一个协程或另一个挂起函数调用，并且你会得到一个编译器错误，比如：*"Suspend function refreshTitle should be called only from a coroutine or another suspend function."*

测试运行代码不知道关于协程的任何事情，所以我们不能使这个测试成为一个挂起函数。我们可以像在 ViewModel  中一样，使用 CoroutineScope 启动协程，但是测试需要在协程返回之前运行它们。一旦测试函数返回，测试就结束了。启动的协程是异步代码，可能在将来某个时候完成。因此，为了测试异步代码，你需要一些方法来告诉测试等待直到协程完成。因为 launch 是一个非阻塞调用，这意味着它将马上返回，并且在函数返回后可以继续运行协同程序——它不能用于测试。比如：

```
@Test
fun whenRefreshTitleSuccess_insertsRows() {
   val subject = TitleRepository(
       MainNetworkFake("OK"),
       TitleDaoFake("title")
   )

   // launch starts a coroutine then immediately returns
   GlobalScope.launch {
       // since this is asynchronous code, this may be called *after* the test completes
       subject.refreshTitle()
   }
   // test function returns immediately, and
   // doesn't see the results of refreshTitle
}
```

这种测试有时会失败。调用 `launch` 将立即返回并与测试用例的其余部分同时执行。这个测试无法知道 `refreshTitle` 是否已经运行——而且任何断言（例如检查数据库是否已经更新）都是不可靠的。而且，如果 `refreshTitle` 抛出异常，则不会在测试调用堆栈中抛出异常，它将被抛入 GlobalScope 的未捕获异常处理器中。

在 `kotlinx-coroutines-test` 库中有一个 `runBlockingTest` 函数，该函数在调用 `suspend` 函数时阻塞。当 runBlockingTest 调用一个 suspend 函数或启动一个新的协程时，默认情况下会立即执行它。您可以将其看作是**将挂起函数和协程转换为正常函数调用**的一种方法。

此外，runBlockingTest 会为你重新抛出未捕获的异常。这使得当协程抛出异常时更容易进行测试。

> 重要提示：`runBlockingTest` 函数将始终阻塞调用方，就像常规函数调用一样。协程将在同一线程上同步运行。你应该在应用程序代码中避免使用 `runBlocking` 和 `runBlockingTest`，而是使用能立即返回的 `launch` 。
>
> `runBlockingTest` 只应该在测试中使用，因为它以测试控制的方式执行协程，而 `runBlocking` 可以用来为协程提供阻塞接口。

### 使用一个协程实现测试

使用 `runBlockingTest` 封装对 `refreshTitle` 的调用，并从 `subject.refreshTitle()` 中删除 `GlobalScope.launch`。

**TitleRepositoryTest.kt**

```
@Test
fun whenRefreshTitleSuccess_insertsRows() = runBlockingTest {
   val titleDao = TitleDaoFake("title")
   val subject = TitleRepository(
           MainNetworkFake("OK"),
           titleDao
   )

   subject.refreshTitle()
   Truth.assertThat(titleDao.nextInsertedOrNull()).isEqualTo("OK")
}
```

这个测试使用提供的假数据来检查 `refreshTitle` 是否将 “OK” 插入到数据库中。

当测试调用 runBlockingTest 时，它会阻塞直到 runBlockingTest 启动的协程完成。然后在协程内部，当我们调用 refreshTitle 时，它使用常规的挂起和恢复机制来等待数据库添加我们的假数据。

测试协程完成后，runBlockingTest 返回。

### 写一个超时测试

我们想为网络请求添加一个短暂的超时。让我们先编写测试，然后实现超时，创建一个新的测试:

**TitleRepositoryTest.kt**

```
@Test(expected = TitleRefreshError::class)
fun whenRefreshTitleTimeout_throws() = runBlockingTest {
   val network = MainNetworkCompletableFake()
   val subject = TitleRepository(
           network,
           TitleDaoFake("title")
   )

   launch {
       subject.refreshTitle()
   }

   advanceTimeBy(5_000)
}
```

这个测试使用提供的假数据 `MainNetworkCompletableFake`，这是一个假的网络，旨在挂起调用者，直到测试继续进行。当 `refreshTitle` 尝试发出网络请求时，它将永远挂起，因为我们想测试超时。

然后，它启动一个单独的协程去调用 `refreshTitle`。这是测试超时的关键部分，超时应该发生在不同于 runBlockingTest 创建的协程中。通过这样做，我们可以调用下一行，`advancetimby (5_000) `，它将时间提前 5 秒，并导致另一个协程超时。

这是一个完全超时测试，一旦我们实现了超时，它就会通过。

现在运行它，看看会发生什么:

```
Caused by: kotlinx.coroutines.test.UncompletedCoroutinesError: Test finished with active jobs: ["...]
```

`runBlockingTest` 的特性之一是在测试完成后不允许你泄漏协程。如果有任何未完成的协程，如我们的 launch 协程，在测试结束时，它将不能通过测试。

### 添加一个超时

打开 `TitleRepository`，并添加一个 5 秒钟的网络获取超时。你可以通过使用 `withTimeout` 函数来实现:

**TitleRepository.kt**

```
suspend fun refreshTitle() {
   try {
       // Make network request using a blocking call
       val result = withTimeout(5_000) {
           network.fetchNextTitle()
       }
       titleDao.insertTitle(Title(result))
   } catch (cause: Throwable) {
       // If anything throws an exception, inform the caller
       throw TitleRefreshError("Unable to refresh title", cause)
   }
}
```

运行测试。当您运行测试时，您应该看到所有测试都通过了！

![17c2c9cab594f2f5.png](https://developer.android.com/codelabs/kotlin-coroutines/img/17c2c9cab594f2f5.png)

在下一个练习中，您将学习如何使用协程编写高阶函数。

> `runBlockingTest` 依赖于` TestCoroutineDispatcher` 来控制协程。
>
> 因此，在使用 `runBlockingTest` 时注入一个 `TestCoroutineDispatcher` 或 `TestCoroutineScope` 是一个好主意。这有使协程单线程的效果，并提供了在测试中显式控制所有协程的能力。
>
> 如果你不想改变协程的行为——例如在集成测试中——你可以对所有调度程序的默认实现使用 `runBlocking`。
>
> **runBlockingTest** 是实验性的，目前有一个 bug，如果协程使用调度器切换到在另一个线程上执行协程，则会测试失败。最终的稳定版预计不会有这个错误。