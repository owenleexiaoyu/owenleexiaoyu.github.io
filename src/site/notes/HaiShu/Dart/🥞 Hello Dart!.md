---
{"dg-publish":true,"permalink":"/HaiShu/Dart/🥞 Hello Dart!/","tags":["Dart"],"noteIcon":"","created":"2022-09-29","updated":"2026-07-02T10:22:37.768+08:00"}
---

## Dart 简介

Dart 是 Google 开发的一门通用编程语言，本来是为了在浏览器中使用，用来取代 JavaScript，但无奈 JavaScript 虽然奇坑无比，但却异常坚挺，Dart 还是落下阵来。反而峰回路转，Flutter 的火爆让 Dart 重新焕发了第二春。

Dart 用途非常广泛，可以用来开发网页前端、服务器后端、桌面及客户端（Flutter）。Dart 的语法也很现代，对于有其他编程语言基础的人来说是很好上手的。Dart 同时支持 `JIT` 和 `AOT` 两种编译方式。

## Dart 开发环境

### 下载 Dart SDK

Dart SDK 是开发 Dart 程序必不可少的工具。前往官网（[https://dart.dev/get-dart](https://dart.dev/get-dart)）下载适合你电脑的 SDK。

> Flutter SDK 中内置了 Dart SDK，如果已经下载了 Flutter SDK，那就可以直接开发 Dart 了。

安装后使用 `dart --version` 查看 Dart 是否安装成功。（本文所演示的 Dart 版本为 2.13.3，新旧版本功能和命令可能有差异）

通过 `dart help` 可以查看 Dart SDK 提供的一系列命令和功能。

```plain
A command-line utility for Dart development.

Usage: dart [<vm-flags>] <command|dart-file> [<arguments>]

Global options:
-h, --help                 Print this usage information.
-v, --verbose              Show additional command output.
--version              Print the Dart SDK version.
--enable-analytics     Enable analytics.
--disable-analytics    Disable analytics.

Available commands:
analyze   Analyze Dart code in a directory.
compile   Compile Dart to various formats.
create    Create a new Dart project.
fix       Apply automated fixes to Dart source code.
format    Idiomatically format Dart source code.
migrate   Perform null safety migration on a project.
pub       Work with packages.
run       Run a Dart program.
test      Run tests for a project.

Run "dart help <command>" for more information about a command.
```

-   **analyze**: IDE 通过这个工具来分析代码是否写错了。
-   **compile**: 将 Dart 代码编译成 Windows、Linux、macOS 等平台可以直接执行的机器码。这就是 Dart 的 AOT（Ahead Of Time） 编译模式。`compile` 工具也可以将 Dart 代码转化为 JavaScript 代码。
-   **create**: 创建 Dart 程序的脚手架工具。
-   **fix**: 这个工具可以帮助开发者将过时的、废弃的代码迁移到使用 Dart 最新的语法。
-   **format**: 代码格式化的工具。
-   **migrate**: Dart 2.12 有个重大的变化就是支持了 `空安全`，这个工具帮助开发者将老版本的 Dart 代码迁移至支持空安全。
-   **pub**: `pub` 工具是 Dart 的包管理器，用于管理项目中依赖的包。一个包其实就是一些代码的集合，方便在很多项目中复用，这样就不需要重复造轮子。Dart 的三方包（库）都可以在 [https://pub.dev](https://pub.dev) 中找到。
-   **run**: 在 Dart 虚拟机上运行 Dart 程序，Dart 虚拟机只会在代码执行时才会编译这个代码，这就是 Dart 的 JIT（Just In Time） 模式。这个模式让开发者在做了一些改动时，可以立即生效，这项特性在使用 Flutter 开发 UI 时，特别实用。
-   **test**: 单元测试的工具。

### 选择 IDE

工欲善其事，必先利其器。有多种代码编辑器工具可以用来开发 Dart 程序：

-   **DartPad**

可以直接在浏览器中编写和运行 Dart 代码。网址为：[https://dartpad.dev](https://dartpad.dev)

![DartPad](https://img.lixiaoyu.life/blog-res/2026/07/43f44d8190f73a96ea916b03eb18c7e0.png)

-   **InterlliJ IDEA**

IDEA 是 Jetbrains 公司开发的一款 IDE，可以通过 Dart 插件来支持 Dart 程序开发。

-   **VS Code**

VS Code 是微软开源的一款轻量级 IDE，可以通过 Dart 插件来支持 Dart 程序开发。

## 第一个 Dart 程序

配置好环境后，就可以开始写第一个 Dart 程序了，Dart 版本的 Hello World，走起。

### 使用命令行

#### 运行单个 Dart 文件

1.  创建一个 `hello.dart` 文件
2.  在文件中编写如下代码：

```dart
void main() {
  print('Hello, dart!'); // 在控制台打印一行字符串
}
```

3.  在终端中输入 `dart run hello.dart` 来运行程序，会在 Dart VM 上执行代码。结果如下：

```dart
Hello, Dart!
```

#### 创建完整工程

前面提到 `create` 命令是 Dart SDK 提供的创建工程脚手架的命令，接下来使用它来创建一个完整的 Dart 工程。在终端中输入如下命令：

```dart
dart create hello_dart_project
```

项目脚手架就创建出来了，使用命令：

```dart
cd hello_dart_project
```

进入工程目录，先来看下项目的结构：

```dart
├── CHANGELOG.md                 // Markdown 格式的文档，用来记录更新日志
├── README.md                    // Markdown 格式，介绍项目整体情况以及如何使用
├── analysis_options.yaml        // 保存一些特定的规则来检查项目代码，比如 Lint
├── bin                          // 存放 Dart 代码的目录
│   └── hello_dart_project.dart  // 编写 Dart 代码
├── pubspec.lock                 // 确定使用依赖的固定版本
└── pubspec.yaml                 // 申明项目中用到的一系列三方 Pub 的依赖
```

再来看下 `bin/hello_dart_project.dart` 中的内容：

```dart
void main(List<String> arguments) {
  print('Hello world!');
}
```

使用 `dart run` 命令来运行程序：

```dart
dart run bin/hello_dart_project.dart
```

命令中的 `run` 还可以省略，就像下面这样：

```dart
dart bin/hello_dart_project.dart
```

运行结果是一样的：

```dart
Hello world!
```

再回过头来看看代码，可以看到它和「运行单个 Dart 文件」一节中的代码是差不多的，有个差异点是它的 `main` 函数中多了一个形参 `List<String> arguments`，这个是用来在命令行运行程序时，可以携带一些初始参数。

例如，我们修改一下代码：

```dart
// eat_fruit.dart
void main(List<String> arguments) {
  print("I want to eat: $arguments");
}
```

在命令行中使用如下命令来运行程序：

```dart
dart run eat_fruit apple banana
```

程序的运行结果是：

```dart
I want to eat: [apple, banana]
```

### 使用 IDEA

1.  **下载安装 IDEA**：前往 [https://www.jetbrains.com/zh-cn/idea/download/](https://www.jetbrains.com/zh-cn/idea/download/) 下载 IDEA，进行安装（安装过程略）。
2.  **下载安装 Dart 插件**：打开 IDEA ▸ Preferences ▸ Plugins ▸ Marketplace，搜索 Dart，找到 Dart 插件（如下图所示），下载后，重启 IDEA，这样 IDEA 就支持 Dart 开发了。

![Dart Plugin](https://img.lixiaoyu.life/blog-res/2026/07/49050008c0c6039f67a29b88cd94aca2.png)

3.  **在 IDEA 中配置 Dart SDK 的位置**：选择 Preferences ▸ Languages & Frameworks ▸ Dart，选择 Dart SDK 的目录，如果是使用 Homebrew 单独下载的 Dart SDK，位置一般为 `/opt/homebrew/opt/dart/libexec`（macOS），如果是下载了 Flutter SDK，位置一般为 `flutter/bin/cache/dart-sdk`（macOS，相对于 Flutter SDK 的路径）。

![Dart SDK path](https://img.lixiaoyu.life/blog-res/2026/07/53f46b88f140b2a7949255bb94c9fad9.png)

4.  **创建 Dart 新项目**：选择 File ▸ New ▸ Project...，面板中选择 Dart，选择一个模板，填写项目名称和位置等信息，创建一个 Dart 工程。
![New Dart project](https://img.lixiaoyu.life/blog-res/2026/07/fe7a594c73e0900cb6fff661731b6ced.png)

5.  在 IDEA 中打开默认生成的 `.dart` 文件，点击右上角绿色三角形，运行程序，在控制台可以看到运行的结果。

![Run Dart project](https://img.lixiaoyu.life/blog-res/2026/07/381804a4b4100de593cb59a70c06697a.jpeg)

### 使用 VS Code

1.  **下载安装 VS Code**：前往 [https://code.visualstudio.com/](https://code.visualstudio.com/) 官网下载 VS Code，并安装（过程略）
2.  **下载安装 Dart 扩展插件**：点击侧边栏 Extensions，搜索 Dart，找到官方 Dart 语言插件，下载并安装

![Dart VSC plugin](https://img.lixiaoyu.life/blog-res/2026/07/36d6a5f525281c501bbea9cd79f3d8af.png)

3.  **创建 Dart 项目**：按 `Commend+Shift+P` 快捷键（macOS）打开命令面板，输入 Dart，选择 `Dart: New Project`，选择一个合适的模版，填写项目名称和路径，创建项目。

![New Dart project in VSC](https://img.lixiaoyu.life/blog-res/2026/07/4901cab9c74cc8857bb2cd599bebcb63.png)

![Select Dart template](https://img.lixiaoyu.life/blog-res/2026/07/bc9c86f79945f98a61e744d02a292bdb.png)

4.  在 VS Code 中打开默认生成的 `.dart` 文件，点击 `main` 上方的 `Run` 运行 Dart 程序，在控制台可以看到结果。

![Run Dart app](https://img.lixiaoyu.life/blog-res/2026/07/bbed8cbd64ad87ec8eee25deb91bda88.png)

## 小结

到这里，关于 Dart 最基本的情况和如何编写和运行 Dart 版的 Hello World 程序就聊的差不多了，接下来简单总结一下：

-   Dart 是 Google 开发的一门通用编程语言，可以用来开发前端、后端、桌面端和客户端，目前最广泛的应用是使用 Flutter 开发跨平台应用。
-   Dart SDK 提供最底层的 Dart 开发支持，是必不可少的工具。
-   `dart compile` 将 Dart 代码编译成各平台的机器码，也就是 `AOT` 模式，`dart run` 在 Dart 虚拟机上边编译边执行 Dart 代码，也就是 `JIT` 模式。
-   可以使用 `dart create` 来创建 Dart 的脚手架工程。
-   `Pub` 是 Dart 用来管理三方 SDK 的依赖的包管理器。

下一篇，将开始介绍 Dart 的语法知识。