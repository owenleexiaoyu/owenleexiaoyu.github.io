---
title: 在你的 Android 程序中使用协程（7）
date: 2021-05-24 07:00
tags: ["Kotlin", "协程"]
categories: 译文
---

## 7. 从回调函数到协程

在这个练习中，你将开始将 Repository 转换为使用协程。为此，我们将向 ViewModel、 Repository、 Room 和 Retrofit 添加协程。

在切换到使用协程之前，理解架构的每个部分负责什么是一个好主意：

1. `MainDatabase` 实现一个数据库，使用 Room 保存并加载一个`Title`.
2. `MainNetwork` 实现了一个获取新标题的网络 API，它使用 Retrofit 获取标题。在这里，`Retrofit` 会随机返回错误或模拟数据，但在其他方面表现得像是在发出真正的网络请求
3. `TitleRepository` 中通过聚合数据库和网络的数据来实现一个获取 title 的 API
4. MainViewModel 记录了屏幕的状态并负责处理事件。当用户点击屏幕时，它会告诉 Repository 刷新标题。

由于网络请求是由 UI-events 驱动的，并且我们希望基于它启动一个协程，因此开始使用协程的自然位置是 ViewModel。

### 回调版本

打开 MainViewModel.kt 查看 refreshTitle 的声明：

```kotlin
/**
* Update title text via this LiveData
*/
val title = repository.title


// ... other code ...


/**
* Refresh the title, showing a loading spinner while it refreshes and errors via snackbar.
*/
fun refreshTitle() {
   // TODO: Convert refreshTitle to use coroutines
   _spinner.value = true
   repository.refreshTitleWithCallbacks(object: TitleRefreshCallback {
       override fun onCompleted() {
           _spinner.postValue(false)
       }

       override fun onError(cause: Throwable) {
           _snackBar.postValue(cause.message)
           _spinner.postValue(false)
       }
   })
}
```

这个函数在用户每次单击屏幕时被调用，它让 Repository 去刷新标题并将新标题写入数据库。

这个实现使用一个回调来做一些事情：

1. 在开始查询之前，它通过 `_spinner.value = true` 这行代码来展示一个 loading
2.  当它得到一个结果时，它通过 `_spinner.value = false` 这行代码来清除 loading
3. 如果它得到一个错误，它会显示一个 snackbar 并清除 loading

注意，onCompleted 回调中没有传递标题，因为我们将所有标题写入 Room 数据库，所以 UI 通过观察一个 LiveData 更新当前标题，这个 LiveData 是由 Room 来更新。

在转换到协程时，我们将保持完全相同的行为。使用像 Room 数据库这样的可观测数据源来自动更新 UI 是一个很好的模式。

> **object : TitleRefreshCallback 是什么意思？**
>
> 这是在 Kotlin 创建一个匿名类的方法，它创建一个实现 TitleRefreshCallback 的新对象。

### 协程版本

让我们用协程重写 `refreshTitle`！

既然我们现在就需要它，那么让我们在 Repository 中创建一个空的挂起函数（TitleRespository.kt），该函数使用 suspend 操作符告诉 Kotlin 它和协程一起工作。

```kotlin
suspend fun refreshTitle() {
    // TODO: Refresh from network and write to database
    delay(500)
}
```

当你完成这整个 Codelab 后，你将使用 Retrofit 和 Room 来更新这个代码，使用协程获取一个新的标题，并将其写入数据库。现在，它只需要花费500毫秒假装在工作，然后继续。

在 MainViewModel 中，将 refreshTitle 的回调版本替换为启动一个新协程的版本：

```kotlin
/**
* Refresh the title, showing a loading spinner while it refreshes and errors via snackbar.
*/
fun refreshTitle() {
   viewModelScope.launch {
       try {
           _spinner.value = true
           repository.refreshTitle()
       } catch (error: TitleRefreshError) {
           _snackBar.value = error.message
       } finally {
           _spinner.value = false
       }
   }
}
```

让我们来看看这个函数:

```kotlin
viewModelScope.launch {
```

就像更新点击次数的协程一样，首先在 viewModelScope 中启动一个新的协程。这将使用 Dispatchers.Main 是没问题的。即使 refreshTitle 将发出网络请求和数据库查询，它也可以使用协程来暴露一个 main-safe（主线程安全）的方法，这意味着从主线程调用它是安全的。

因为我们使用的是 viewModelScope，当用户离开这个屏幕时，这个协程启动的任务将自动取消。这意味着它不会产生额外的网络请求或数据库查询。

>当从非协程环境创建协程时，从 ` launch` 开始。
>
>这样，如果他们抛出一个未捕获的异常，它将自动传播到未捕获的异常处理程序（默认情况下，这会使应用程序崩溃）。使用 async 启动的协程在调用 await 之前不会向其调用者抛出异常。但是，你只能从协程内部调用 await，因为它是一个挂起函数。
>
>一旦进入协程，你可以使用 launch 或 async 启动子协程。当没有结果返回时使用 launch，当有结果返回时使用 async。

接下来的几行代码实际上调用了 TitleRepository 中的 `refreshTitle` 方法。

```kotlin
try {
    _spinner.value = true
    repository.refreshTitle()
}
```

在这个协程执行任何操作之前，它先开始 loading，然后像调用普通函数一样调用 refreshTitle。但是，由于 refreshTitle 是一个挂起函数，因此它执行的方式与普通函数不同。

我们不需要通过传递一个回调对象，协程将暂停，直到 refreshTitle 恢复。虽然它看起来就像一个常规的阻塞函数调用，但它会自动等待，直到网络和数据库查询完成后，才会在不阻塞主线程的情况下恢复。

```kotlin
} catch (error: TitleRefreshError) {
    _snackBar.value = error.message
} finally {
    _spinner.value = false
}
```

挂起函数中的异常和常规函数中的错误一样。如果你在一个 suspend 函数中抛出一个错误，它将被抛给调用者。因此，即使它们的执行方式非常不同，你也可以使用常规的 try/catch 块来处理它们。这很有用，因为它使你可以依赖内置的语言支持来进行错误处理，而不是为每个回调创建自定义的错误处理。

而且，如果你从协程中抛出一个异常——协程将默认取消其父类。这意味着很容易将几个相关的任务一起取消。

然后，在 finally 块中，我们可以确保在查询运行后始终关闭 loading。

> **未捕获的异常会发生什么**
>
> 协程中未捕获的异常类似于非协程代码中未捕获的异常。默认情况下，它们会取消协程的 Job，并通知父协程它们应该取消自己。如果没有协程处理异常，那么它最终将被传递给 CoroutineScope 的未捕获异常处理器。
>
> 默认情况下，未捕获的异常将发送到 JVM 上线程的未捕获异常处理器。你可以通过提供 CoroutineExceptionHandler 来自定义此行为。

再次运行 start 应用程序，当你点击屏幕的任何地方时应该会看到一个 loading，标题将保持不变，因为我们还没有连接到我们的网络或数据库。

在下一个练习中，你将更新 TitleRepository 来实际执行工作。

