---
{"dg-publish":true,"permalink":"/HaiShu/Kotlin/🟪 Kotlin 环境搭建与基本语法/","tags":["编程","Kotlin"],"noteIcon":"","created":"2023-09-18","updated":"2025-06-08T11:12:42.447+08:00"}
---

## 修改记录

| **日期**    | **内容** |
| --------- | ------ |
| 2023.9.18 | 创建文档   |

## 前言
上一篇文章中，我们介绍了 Kotlin 的一些基本信息，相信大家对 Kotlin 有了一个粗略的认认识。从这篇文章开始，我们将介绍 Kotlin 的语法知识，带领大家由浅入深地学习 Kotlin 这门语言。

这篇文章中，我们会主要介绍如何搭建 Kotlin 的开发环境，运行最简单的 Kotlin 工程，以及一些 Kotlin 最基本的语法概念。

## 环境搭建
### 下载安装 IntelliJ IDEA
编写 Kotlin 代码最常使用的代码编辑器是 JetBrains 的 IntelliJ IDEA，它是一个集成开发环境（IDE），就像 Android 开发使用的 Android Studio，iOS 开发使用的 XCode。 我们可以在 JetBrains 的官网（[https://www.jetbrains.com/idea/](https://www.jetbrains.com/idea/)）下载 IntelliJ IDEA，它提供了社区免费版和有更多功能的收费版，我们下载社区版即可。

> 这里我们下载的 IDEA 版本是 `2023.2`

选择我们电脑系统（Windows、macOS、Linux 等）所对应的安装包来下载，下载成功后，进行安装，安装过程这里不赘述，一般就是一路 Next 即可。

### 下载安装 JDK
Kotlin 是个跨平台的语言，有多个目标平台，其中最主流的两个平台是 JVM 和 Android，后面 「Kotlin Multiplatform」部分我们还会介绍其他的目标平台，比如 Native，Web 等。

Kotlin 最早是作为一门更易用、更现代的 Java 替代语言而出现，因此它是 100% 兼容 Java 的。我们知道，Java 为了跨 Windows、Linux 等多个平台，实现「Write Once, Run Everywhere」的目标，Java 源代码会被编译成字节码这种中间产物，运行在 Java 虚拟机（JVM）上，JVM 抹平了不同平台底层的差异。

我们练习的 Kotlin 代码主要是运行在 JVM 上，因此我们需要下载安装 JDK，以便将 Kotlin 代码编译成  Java 字节码。去 Oracle 官网（[http://www.oracle.com/technetwork/java/javase/downloads/index.html](http://www.oracle.com/technetwork/java/javase/downloads/index.html)）下载最新的 JDK8，进行安装。

安装好 JDK 后，在控制台中输入 `java -version` 命令，如果能看到 Java 版本号的输出，就说明 JDK 安装成功了。

## 第一个 Kotlin 项目
配置好开发环境后，就可以打开 IDEA，开始写第一个 Kotlin 程序了。

### 创建项目
打开 IDEA，会看到如下的界面，在这里可以创建一个新的项目工程，或者打开一个已有的 IDEA 工程，或者从 Github 等代码托管平台克隆一个 IDEA 工程到本地：

![](https://img.lixiaoyu.life/blog-res/2025/06/cfe99d342017b8b8dc34e0b6822b262f.png)

我们选择「New Project」，会看到弹出一个弹窗，在这里可以填写项目的一些信息，我们输入项目名（ HelloKotlin），选择项目源码放置的文件夹，选择语言为 Kotlin，选择构建系统为 IntelliJ（后续章节我们会使用 Gradle 来导入外部依赖，这一章中暂时不需要），选择 JDK 为刚刚下载的 JDK8，然后点击「Create」，创建一个 Kotlin 项目。

![](https://img.lixiaoyu.life/blog-res/2025/06/0e250c4550203e68ad593ae67cfb8d54.png)

项目创建完成后，会打开 IDEA 的主界面，如下图所示：

![](https://img.lixiaoyu.life/blog-res/2025/06/902cfcf8450a356ce25e95b8fe086481.png)

我们主要关注的是 `src/mian/kotlin` 这个目录下的文件，这是 Kotlin 源代码所在的位置，IDEA 默认生成了一个 `Main.kt` 的示例文件。

### 运行项目
我们先不用考虑 Kotlin 的语法知识，先看看如何将这个项目运行起来。

点击 `main` 函数左边绿色三角形按钮，在弹出的弹窗中选择「Run 'MainKt'」，编译并运行这个程序：

![](https://img.lixiaoyu.life/blog-res/2025/06/6053d6f7a1836f159f29eb171cb7269c.png)![](https://img.lixiaoyu.life/blog-res/2025/06/32480044c0962466dda3ab5c3113cfab.png)

编译成功后，会在主界面下方的  Run 面板中展示输出：

![](https://img.lixiaoyu.life/blog-res/2025/06/02a18c7d298d4cb7f65888cdb030628d.png)

还可以通过主界面右上角 Toobar 中的绿色运行按钮来运行程序：

![](https://img.lixiaoyu.life/blog-res/2025/06/b0200dc2c8c4f57494e2e08f104f1d3f.png)

### 分析代码
我们看简单分析一下 IDEA 为我们生成的示例代码：`Main.kt`

```kotlin
fun main() {
    println("Hello Kotlin!")
}
```

Kotlin 中用 `fun` 关键字来定义一个函数，函数是用来执行特定任务的代码块，`main` 则是这个函数的名字。Kotlin 中，`main` 函数是个特殊的函数，它是应用程序的主入口。里面有一行 `println("Hello Kotlin!")` 语句，它调用了 Kotlin 标准库中的 `println` 函数，将一段文本输出到控制台上，同时我们注意到 Kotlin 的语句结尾不需要带 `;`，这点和 Java 不一样。

## Kotlin 基本语法概念
上面小节中，我们运行并简单分析了第一个 Kotlin 项目的代码，接下来再来看一下 Kotlin 一些最基本的语法概念。

### 文件后缀
Kotlin 的源码文件以 `.kt` 作为文件后缀，比如上面示例代码中的 `Main.kt`。

### 代码注释
代码注释是用来解释代码的设计和意图，注释会在编译时被编译器忽略。我们推荐在代码较为复杂时，添加详细的注释来帮助其他人更容易地理解代码。Kotlin 使用 `//` 来写单行注释，使用 `/* */` 来写多行注释。下面是一些例子。

1. 单行注释

```kotlin
// 这是一段注释，不会被执行
// 这也是一段注释，会被编译器忽略
```

2. 多行注释

```kotlin
/* 这是一段很长的注释，它包含了
很多行，
很多行，
很多行
的内容。 */
```

Kotlin 中，多行注释还可以嵌套：

```kotlin
/*
   这是一段注释，解释了我要修复什么问题。
   /*
        这是一个嵌套在注释中的注释，解释了我为什么要这么写代码。
    */
 */
```

### 输出
前面第一个 Kotlin 程序中，我们看到使用 `println()` 函数来打印了一个字符串，这就是 Kotlin 提供的标准输出函数。

我们可以多次调用 `println()` 函数输出多个内容，这些内容会换行显示：

```kotlin
fun main() {
    println("Hello, World")
    println("Hello, Kotlin")
    println("Hello, My name is Tom")
}
```

![](https://img.lixiaoyu.life/blog-res/2025/06/e2525d9944a829b8bd719eccc0bd55be.png)

`println()` 函数还可以直接打印数字等：

```kotlin
fun main() {
    println(10)
    println(3.14)
}
```

![](https://img.lixiaoyu.life/blog-res/2025/06/ecfad770dd226c6618aaf1f057eb8ecb.png)

除了 `println()` 函数，Kotlin 的标准输出还有 `print()` 函数，和 `println()` 的区别是 `print()` 多次打印的内容不会自动换行。

```kotlin
fun main() {
	print("Hello")
    print("World")
}
```

![](https://img.lixiaoyu.life/blog-res/2025/06/8644813653e2a05a199ef46f3d08fc75.png)



