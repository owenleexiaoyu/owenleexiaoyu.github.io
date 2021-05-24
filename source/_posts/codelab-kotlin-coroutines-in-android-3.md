---
title: 在你的 Android 程序中使用协程（3）
date: 2021-05-24 03:00
tags: ["Kotlin", "协程"]
categories: 译文
---

## 3. 运行示例应用程序

首先，让我们看看示例应用程序是什么样的。按照以下说明在 Android Studio 中打开示例应用程序。

1. 如果你下载了 `kotlin-coroutines` Zip 文件，解压缩文件
2. 在 Android Studio 中打开 `coroutines-codelab` 项目
3. 选择 start 模块
4. 点击 Run 按钮，并选择一个模拟器或连接您的 Android 设备，这必须是能够运行 Android Lollipop 的(最低 SDK 支持是 21)。运行起来后屏幕是这样：

![image1](https://developer.android.com/codelabs/kotlin-coroutines/img/a7d14a8aa9b85a6b.png)

> 如果你看到一个 "Android 框架被检测到，单击 Configure" 错误消息，确保打开的是 `coroutines-codelab` 目录而不是父目录。

这个 start 应用程序使用线程增加计数一个短暂的延迟后，你按下屏幕。它会从网络中获取一个新的标题并显示在屏幕上。现在尝试一下，你应该会看到计数和消息在短时间延迟后发生了变化。在这个 Codelab 中，你将把这个应用程序转换为使用协程。

此应用程序使用架构组件将 MainActivity 中的 UI 代码与 MainViewModel 中的应用程序逻辑分离。花点时间熟悉一下项目的结构：

![image2](https://developer.android.com/codelabs/kotlin-coroutines/img/cbc7d16909facb7c.png)

1. `MainActivity` 显示用户界面，注册单击监听器，并可以显示 `Snackbar`。它传递事件给 `MainViewModel` 然后在 MainViewModel 中使用 `LiveData` 来在屏幕上更新 UI。
2. `MainViewModel` 在 `onMainViewClicked` 中处理事件，并且会使用 LiveData 与 `MainActivity` 通信。
3. `Executors` 定义为 `BACKGROUND`，可以在后台线程上运行
4. `TitleRepository` 从网络中获取结果并保存到数据库中

### 为项目添加协程

要在 Kotlin 使用协程，必须在项目 app 模块的 build.gradle 中依赖协程核心库。Codelab 项目里已经添加了依赖，因此你不需要额外添加。

Android 上的协程库可以作为一个核心库使用，并且也包含 Android 特有的扩展:

- **kotlinx-coroutines-core** —  Kotlin 使用协程的主要接口
- **kotlinx-coroutines-android** — 在协程中支持 Android 主线程

start 模块中已经包含了 build.gradle 中的依赖项。当创建一个新的应用程序项目时，您需要打开 app 模块的 build.gradle 并将协程依赖项添加到项目中。

```
dependencies {
  ...
  implementation "org.jetbrains.kotlinx:kotlinx-coroutines-core:x.x.x"
  implementation "org.jetbrains.kotlinx:kotlinx-coroutines-android:x.x.x"
}
```

你可以在 [Kotlin Coroutines Release](https://github.com/Kotlin/kotlinx.coroutines/releases) 页面上找到代替 “x.x.x” 的协程库的最新版本号。

> **协程和 RxJava**
>
> 如果在当前的代码库中使用 `RxJava`，可以使用 [kotlin-coroutines-rx](https://github.com/Kotlin/kotlinx.coroutines/tree/master/reactive) 库与协程集成。

