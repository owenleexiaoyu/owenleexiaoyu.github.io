---
layout: post
title: 在你的 Android 程序中使用协程（9）
date: 2021-05-24 09:00
tags: ["Kotlin", "协程"]
categories: 译文
---

## 9. Room 和 Retrofit 中的协程

为了继续集成协程，我们将使用 Room 和 Retrofit 稳定版本中对 suspend 函数的支持，然后通过使用 suspend 函数简化我们刚刚编写的代码。

### Room 中的协程

首先打开 MainDatabase.kt，让 `insertTitle` 成为一个挂起函数:

```kotlin
// add the suspend modifier to the existing insertTitle

@Insert(onConflict = OnConflictStrategy.REPLACE)
suspend fun insertTitle(title: Title)
```

当你这么做时，Room 将使你的查询 main-safe 并自动在后台线程上执行它。但是，这也意味着你只能从协程内部调用它。

而且这就是在 Room 中使用协程需要做的所有事情，非常漂亮。

### Retrofit 中的协程

接下来让我们看看如何将协程与 Retrofit 集成。打开 MainNetwork.kt 并将 `fetchNextTitle` 更改为一个 `suspend` 函数，还要将返回类型从 `Call < String >` 更改为 `String`。

> 挂起功能需要 Retrofit 2.6.0或更高版本。

**MainNetwork.kt**

```kotlin
// add suspend modifier to the existing fetchNextTitle
// change return type from Call<String> to String

interface MainNetwork {
   @GET("next_title.json")
   suspend fun fetchNextTitle(): String
}
```

要在 Retrofit 中使用 suspend 函数，你必须做两件事:

1. 向函数添加一个 `suspend` 修饰符
2. 移除返回值类型外面包裹的 `Call`，这里我们直接返回 String。 你也可以返回一个能够解析 json 的 Bean 类。如果你想拿到 Retrofit 的返回的完整结果，可以尝试使用  `Result< String >`。

Retrofit 将自动使 suspend 函数主线程安全，因此你可以直接从 `Dispatchers.Main` 调用它。

> Room 和 Retrofit 让 suspend 函数主线程安全，可以安全地从 `Dispatchers.Main` 调用这些 suspend 函数，即使它们从网络中获取数据并写入数据库。

> Room 和 Retrofit 都使用了自定义的调度器，不使用 `Dispatchers.IO`。
>
> Room 会使用默认的 query 和 transaction **Executor** 来运行协程。
>
> Retrofit 会在内部创建一个新的 `Call` 对象，并调用它的 `enqueue`  方法来异步发送请求。

### 使用 Room 和 Retrofit

现在，Room 和 Retrofit 支持挂起函数，我们可以在 Repository 的代码中使用它们。打开 TitleRepository.kt，看看与阻塞版本相比，使用挂起函数是如何大大简化逻辑的：

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

哇，这个短多了。发生了什么？事实证明，依赖于挂起和恢复可以使代码短得多。Retrofit 允许我们在这里使用类似 String 或 User 对象的返回类型，而不是 Call。这样做是安全的，因为在 suspend 函数内部，Retrofit 能够在后台线程上运行网络请求，并在调用完成后恢复协程。

更好的是，我们摆脱了 withContext。因为 Room 和 Retrofit 都提供了主线程安全的挂起功能，所以从 `Dispatchers.Main` 上来执行这些异步工作是安全的。

>  你不需要使用 withContext 来调用主线程安全的挂起函数。
>
> 按照约定，你应该确保在应用程序中编写的挂起函数是 main-safe 的。这样的话，从任何调度器，甚至是 `Dispatchers.Main` 上调用它都是安全的。

### 修复编译器错误

迁移到协程确实涉及到更改函数的签名，因为你不能从常规函数调用 suspend 函数。在此步骤中添加 suspend 修饰符时，会出现一些编译错误，显示如果在实际项目中将函数更改为 suspend 会发生什么情况。

查看代码，修复编译器错误，将所创建的函数更改为 suspend。下面是针对这个练习的代码中每一个问题的快速解决方案：

**TestingFakes.kt**

更新测试的假数据，来支持新的 suspend 修饰符。

*TitleDaoFake*

1. 按下 alt-enter（在 Mac 上是 option-enter）给继承链上所有这个函数都增加 suspend 修饰符。

*MainNetworkFake*

1. 按下 alt-enter（在 Mac 上是 option-enter）给继承链上所有这个函数都增加 suspend 修饰符。
2. 用这个函数替换 `fetchNextTitle`

```kotlin
override suspend fun fetchNextTitle() = result
```

*MainNetworkCompletableFake*

1. 按下 alt-enter（在 Mac 上是 option-enter）给继承链上所有这个函数都增加 suspend 修饰符。
2. 用这个函数替换 `fetchNextTitle`

```kotlin
override suspend fun fetchNextTitle() = completable.await()
```

**TitleRepository.kt**

- 删除 refreshTitleWithCallbacks 方法，它不再使用了。

### 运行应用程序

再次运行该应用程序，一旦编译完成，你将看到它正在使用协程从 ViewModel 加载数据到 Room 和 Retrofit！

恭喜你，你已经完全将这个应用程序转换为使用协程了！最后，我们将讨论一下如何测试我们刚才所做的。