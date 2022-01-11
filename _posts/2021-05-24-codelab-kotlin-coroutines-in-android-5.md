---
layout: post
title: 在你的 Android 程序中使用协程（5）
date: 2021-05-24 05:00
tags: ["Kotlin", "协程"]
categories: 译文
---

## 5. 用协程控制 UI

在这个练习中，你将编写一个协程来显示延迟后的消息。首先，在 Android Studio 中打开 start 模块。

### 理解 CoroutineScope

在 Kotlin 中，所有的协程都运行在一个 `协程作用域（CoroutineScope）` 内部。协程作用域通过它的 `Job` 来控制协程的生命周期。当你取消 scope 的 job 时，它会取消所有在这个 scope 内开始的协程。在 Android 上，当用户从一个 Activity 或 Fragment 离开时，你可以使用一个 scope 来取消所有正在运行的协程。协程作用域还允许你指定默认的 `调度器`，调度器控制在哪个线程上运行协程的代码。

对于由 UI 启动的协程，通常在 `Dispatchers.Main` 上启动它们是正确的，这是 Android 系统的主线程。在 Dispatchers.Main 上启动的协程在挂起时不会阻塞主线程。因为 ViewModel 几乎总是在主线程上更新 UI，所以在主线程上启动协程可以节省额外的线程切换。在主线程上启动的协程可以在启动后的任何时候切换调度器。例如，它可以使用另一个调度器从主线程脱离，去解析大 JSON 结果。

> **协程提供 main-safety**
>
> 因为协程可以在任何时候轻松地切换线程并将结果传递回原始线程，所以在主线程上启动与 UI 相关的协程是一个好主意。
>
> 类似 Room 和 Retrofit 这样的库在使用协程时提供了开箱即用的 main-safety，因此你不需要管理线程来进行网络或数据库调用。这让代码变得非常简单。
>
> 但是，像对列表排序或从文件读取这样的阻塞代码仍然需要显式代码来支持 main-safety，即使在使用协程时也是如此。如果你使用的网络或数据库框架(还)不支持协程，那也需要显示支持。

### 使用 viewModelScope

AndroidX 的 lifecycle-viewmodel-ktx 库向 ViewModel 添加了一个 CoroutineScope，它可以启动与 UI 相关的协程。若要使用此库，必须在项目模块的 build.gradle 中添加依赖。

```groovy
dependencies {
  ...
  // replace x.x.x with latest version
  implementation "androidx.lifecycle:lifecycle-viewmodel-ktx:x.x.x"
}
```

该库添加了一个 `viewModelScope` 作为 ViewModel 类的扩展函数。这个作用域绑定到 `Dispatchers.Main`，当 ViewModel 被清除时， scope 将自动取消。

### 从线程切换到协程

在 MainViewModel.kt 中找到一个 TODO，代码如下：

```kotlin
/**
* Wait one second then update the tap count.
*/
private fun updateTaps() {
   // TODO: Convert updateTaps to use coroutines
   tapCount++
   BACKGROUND.submit {
       Thread.sleep(1_000)
       _taps.postValue("$tapCount taps")
   }
}
```

这段代码使用 `BACKGROUND ExecutorService`（在 util/Executor.kt 中定义）在后台线程中运行。因为 `sleep` 会阻塞当前线程，所以如果在主线程上调用它，就会冻结 UI。用户单击主视图后一秒钟，就会请求一个 snackbar。

你可以通过从代码中删除 BACKGROUND 并再次运行它来看到这种情况的发生。不会显示 loading，所有内容将在一秒钟后“跳转”到最终状态。

```kotlin
/**
* Wait one second then update the tap count.
*/
private fun updateTaps() {
   // TODO: Convert updateTaps to use coroutines
   tapCount++
   Thread.sleep(1_000)
   _taps.postValue("$tapCount taps")
}
```

用协程的代码来替换 `updateTaps` 实现同样的效果，你需要导入 `launch` 和 `delay`。

```kotlin
/**
* Wait one second then display a snackbar.
*/
fun updateTaps() {
   // launch a coroutine in viewModelScope
   viewModelScope.launch {
       tapCount++
       // suspend this coroutine for one second
       delay(1_000)
       // resume in the main dispatcher
       // _snackbar.value can be called directly from main thread
       _taps.postValue("$tapCount taps")
   }
}
```

这段代码也做了同样的事情，在显示 snackbar 之前等待一秒钟，但是，它们有一些重要的区别:

1. `viewModelScope.launch` 将会在 `viewModelScope` 中启动一个协程。这意味着当 scope 的 job 被取消时，所有在这个 scope 中的协程都会被取消。如果用户在 deley 返回前离开 Activity，ViewModel 销毁，调用 onCleared，这个 scope 的 job 会自动取消。
2. 因为 `viewModelScope` 的默认调度器是 `Dispatchers.Main` ，这个协程将在主线程中启动。我们将在后面看到如何使用不同的线程。
3. `delay` 是一个`suspend` 函数。 suspend 函数会在 Android Studio 的左侧显示一个![716807c07961aacd.png](https://developer.android.com/codelabs/kotlin-coroutines/img/716807c07961aacd.png) 图标。即使这个协程是在主线程上启动的，`delay` 函数也不会阻塞线程一秒钟。相反，调度器将在一秒钟后恢复协程来执行下一行语句

继续运行它，当你点击主视图时，你应该会在一秒钟后看到一个 snackbar。

在下一节中，我们将考虑如何测试这个函数。

