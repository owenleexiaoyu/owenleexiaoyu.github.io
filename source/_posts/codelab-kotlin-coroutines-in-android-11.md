---
title: 在你的 Android 程序中使用协程（11）
date: 2021-05-24 11:00
tags: ["Kotlin", "协程"]
categories: 译文
---

## 11. 在高阶函数中使用协程

在这个练习中，你将重构 `MainViewModel` 中的 `refreshTitle`，以使用一个通用的数据加载函数。这将教你如何构建使用协程的高阶函数。

`refreshTitle` 的当前实现可以工作，但是我们可以创建一个总是显示 loading 的通用数据加载过程的协程。这样对相同的流程可以进行复用。

检查除了 `repository.refreshTitle()` 之外的每一行的当前实现，显示 loading 和错误。

```kotlin
// MainViewModel.kt

fun refreshTitle() {
   viewModelScope.launch {
       try {
           _spinner.value = true
           // this is the only part that changes between sources
           repository.refreshTitle() 
       } catch (error: TitleRefreshError) {
           _snackBar.value = error.message
       } finally {
           _spinner.value = false
       }
   }
}
```

> 重要提示：虽然我们在这个 Codelab 中只使用了 viewModelScope，但通常可以在任何有意义的地方添加作用域。如果不再需要，别忘了取消它。
>
> 例如，你可以在 RecyclerView Adapter 中声明一个 scope 来执行 DiffUtil 操作。

### 在高阶函数中使用协程

将此代码添加到 `MainViewModel.kt`

**MainViewModel.kt**

```kotlin
private fun launchDataLoad(block: suspend () -> Unit): Job {
   return viewModelScope.launch {
       try {
           _spinner.value = true
           block()
       } catch (error: TitleRefreshError) {
           _snackBar.value = error.message
       } finally {
           _spinner.value = false
       }
   }
}
```

现在重构 `refreshTitle()` 以使用这个高阶函数。

**MainViewModel.kt**

```kotlin
fun refreshTitle() {
   launchDataLoad {
       repository.refreshTitle()
   }
}
```

通过抽象显示加载 loading 和显示错误的逻辑，我们简化了加载数据所需的实际代码。显示 loading 或显示错误很容易泛化到任何数据加载，而实际的数据源和目标需要每次指定。

要构建这个抽象，launchDataLoad 需要一个参数块，它是一个 suspend lambda。一个 suspend lambda 允许你调用 suspend 函数。这就是 Kotlin 如何实现我们在这个 Codelab 中使用的协程构建器 `launch` 和 `runBlocking`。

```kotlin
// suspend lambda

block: suspend () -> Unit
```

要生成一个 suspend lambda，首先使用 suspend 关键字，函数箭头和返回类型 Unit 完成声明。

你不需要经常声明你自己的 suspend lambdas，但是它们可以帮助你创建类似于封装重复逻辑的抽象！

