---
layout: post
title: 在你的 Android 程序中使用协程（6）
date: 2021-05-24 06:00
tags: ["Kotlin", "协程"]
categories: 译文
---

## 6. 通过行为来测试协程

在这个练习中，你将为刚刚编写的代码编写一个测试。这个练习向你展示了如何测试 Dispatchers.Main 上运行的协程。主要使用 [kotlinx-coroutines-test](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-test/) 库。在后面的练习中，你将实现一个直接与协程交互的测试。

> 本节中使用的 kotlinx-coroutines-test 库被标记为实验性的，并且在发布之前可能有突变的更改。

### 检查现有的代码

在 androidTest 文件夹中打开 MainViewModelTest.kt。

```kotlin
class MainViewModelTest {
   @get:Rule
   val coroutineScope =  MainCoroutineScopeRule()
   @get:Rule
   val instantTaskExecutorRule = InstantTaskExecutorRule()

   lateinit var subject: MainViewModel

   @Before
   fun setup() {
       subject = MainViewModel(
           TitleRepository(
                   MainNetworkFake("OK"),
                   TitleDaoFake("initial")
           ))
   }
}
```

规则是在 JUnit 中执行测试之前和之后运行代码的一种方法。我们使用两个规则来不依赖设备测试 MainViewModel：

1. `InstantTaskExecutorRule `是一个 JUnit 规则，让`LiveData` 同步执行每个任务
2. `MainCoroutineScopeRule`是这个代码库中的一个自定义规则，它配置 `Dispatchers.Main` 使用 `kotlinx-coroutines-test` 中的 `TestCoroutineDispatcher`。这允许在测试中提前一个虚拟时钟进行测试，并允许代码在单元测试中使用 `Dispatchers.Main`。

在 setup 方法中，使用测试的假数据创建了一个新的 MainViewModel 实例——这些是 start 模块代码中提供的网络和数据库的假实现，用于帮助编写测试，而不使用真实的网络或数据库。

对于这个测试，只需要假数据来满足 MainViewModel 的依赖。稍后在这个Codelab，你将更新假数据来支持协程。

### 编写一个控制协同程序的测试

添加一个新的测试，确保点击主视图后一秒钟更新 taps：

```kotlin
@Test
fun whenMainClicked_updatesTaps() {
   subject.onMainViewClicked()
   Truth.assertThat(subject.taps.getValueForTest()).isEqualTo("0 taps")
   coroutineScope.advanceTimeBy(1000)
   Truth.assertThat(subject.taps.getValueForTest()).isEqualTo("1 taps")
}
```

通过调用 onMainViewClicked，我们刚刚创建的协程将被启动。这个测试在 onMainViewClicked 被调用后检查点击文本是否保持 “0 taps”，然后1秒钟后更新为“1 taps”。

这个测试使用`虚拟时间`来控制 onMainViewClicked 启动的协程的执行。MainCoroutineScopeRule 允许您暂停、恢复或控制由 Dispatchers.Main 启动的协程的执行。这里我们调用 advanceTimeBy (1 _ 000) ，这将导致主调度器立即执行计划在1秒后恢复的协程。

这个测试是完全确定的，这意味着它总是以相同的方式执行。而且，因为它完全控制了在 Dispatchers.Main 上协程的执行，不需要等待一秒钟就可以设置值。

### 运行现有的测试

1. 右键单击类名`MainViewModelTest`，在编辑器中打开上下文菜单
2. 在上下文菜单中选择![execute.png](https://developer.android.com/codelabs/kotlin-coroutines/img/c8b8a080b7ead886.png)**运行‘ MainViewModelTest’**
3. 对于以后的运行，您可以在工具栏![execute.png](https://developer.android.com/codelabs/kotlin-coroutines/img/c8b8a080b7ead886.png)按钮旁边的配置中选择这个测试配置。默认情况下，配置将称为 MainViewModelTest。

你应该看到测试通过了！而且运行时间不会超过一秒钟。

在下一个练习中，您将了解如何将现有的回调 api 转换为使用协程。