---
{"dg-publish":true,"permalink":"/HaiShu/Android/🤖 Android 启程/","tags":["编程","Android"],"noteIcon":"","created":"2024-01-10T23:06:26.664+08:00","updated":"2025-06-08T17:15:56.139+08:00"}
---



欢迎来到 Android 开发的世界。目前 Android 是目前世界上市场占有率最高的移动操作系统，和苹果的 iOS 系统占据了移动操作系统的绝大部分市场份额。随着移动互联网的兴起，移动端开发正在变得如火如荼。
## Android 的历史

2003 年 10 月，Andy Rubin 等人创办了 Android 公司，开发 Android 操作系统。2005 年 8 月谷歌收购了这家仅仅成立了 22 个月的公司，并让 Andy Rubin 继续负责 Android 项目。2008 年，谷歌推出了 Android 系统的第一个版本。

和 iOS 的封闭相反，Android 系统是开源的，Google 允许任何手机厂商和个人免费获取 Android 的源码，并可以自由地使用和定制。三星、HTC、摩托罗拉等手机厂商相继推出了搭载 Android 系统的手机，Android 市场百花齐放，迅速崛起，将诺基亚塞班系统拉下马来。国内小米、华为、vivo、oppo 等品牌的手机，也都是基于 Android 操作系统的。

> 关于 Android 系统诞生的幕后故事，可以阅读[《安卓传奇：Android缔造团队回忆录》](https://book.douban.com/subject/36149272/)这本书，它由 Android 核心团队成员书写，详细记录了 Android 系统 1.0 版本推出前后的各个精彩故事。

下面，让我们一起踏上激动人心的 Android 开发学习之旅，成为一名 Android 开发者。
## Android 系统架构

为了更好地理解 Android 系统如何工作，先来了解下它的系统架构。Android 大致可以分为四层，从下到上依次是：Linux 内核层、系统运行时层、应用框架层和应用层。

1. **Linux 内核层**

Android 系统基于 Linux 内核，这一层为 Android 设备的各种硬件提供了底层的驱动，比如显示驱动、音频驱动、相机驱动、蓝牙驱动、Wi-Fi 驱动、电源管理等。

2. **系统运行库层**

这一层通过一些 C/C++ 库来为 Android 系统提供主要的特性支持。比如 SQLite 库提供了数据库操作的支持，OpenGL|ES 库提供了 3D 绘图的支持，Webkit 库提供了浏览器内核的支持等。
这一层还有 Android 运行时库，它主要提供了一些核心库，允许开发者使用 Java 语言来开发 Android 应用。另外，Android 运行时库中还包含了 Dalvik 虚拟机（5.0 版本后改为 ART 虚拟机），它使得每个 Android 应用能够运行在独立的进程中，并拥有一个自己的虚拟机实例。相较于 Java 虚拟机，Dalvik 和 ART 都是专门为移动设备定制的，针对手机内存、CPU 性能有限等情况做了优化处理。

3. **应用框架层**

这一层主要提供了开发应用程序时需要用到的各种 API，比如 Activity、Service 等四大组件、View 视图系统等。Andorid 自带的一些核心应用都是使用这些 API 完成的，开发者也可以通过使用这些 API 来构建自己的应用程序。

4. **应用层**

所有安装在手机上的应用程序都属于应用层，比如系统自带的联系人、短信等应用，或者从 Google Play 等应用商店下载的第三方应用，当然也包括我们自己开发的应用程序。
Android 系统的整体架构如图所示：


![Android 系统架构图](https://s2.loli.net/2024/01/10/BKUtyLaOjqT9F7x.png)

## Android 已发布版本

2008 年 9 月，Google 正式发布了 Android 1.0 系统。随后几年，Android 系统更新速度惊人，相继推出了 2.1、2.2、2.3 版本系统，让 Android 占领大量市场。2011 年 2 月，Google 发布了 Android 3.0 系统，这个系统是专门为平板电脑设计的，但也是 Android 为数不多的比较失败的版本，同年 10 月，Google 又发布了 Android 4.0 系统，不再对手机和平板进行差异化区分。2014 年 Google I/O大会上，Google 推出了号称史上版本改动最大的 Android 5.0 系统，其中使用了 ART 虚拟机替代了 Dalvik 虚拟机，大大提升了应用的运行速度，还提出了 Material Design 的概念来优化应用的界面设计。除此之外，还推出了 Android Wear、Android Auto、Android TV 系统，从而进军可穿戴设备、汽车、电视等全新领域。之后，Android 系统基本上保持每年一个新版本的发布节奏。2015 年 Google I/O大 会推出了 Android 6.0 系统，加入运行时权限功能。2016 年 Google I/O 大会上推出了 Android 7.0 系统，加入多窗口模式功能。

> 参考 [Android 系统版本大全](https://www.yuque.com/owenlee/android/nfwrhgt6nlrskmis?view=doc_embed) 文章查看所有 Android 版本的主要特性。

## 搭建 Android 开发环境

在了解一些 Android 系统的背景知识后，接下来就正式进入实践环节了，学习 Android 开发的第一步就是搭建开发环境，并且编写出第一个最简单 Android 应用程序。

### 需要的工具

- JDK：JDK 是 Java 语言的软件开发工具包，它包含了 Java 的运行环境、工具集合、基础类库等内容。
- Android SDK：Android SDK 是谷歌提供的 Android 开发工具包，在开发 Android 程序时，需引入它使用 Android 相关API。
- Android Studio：它是谷歌在 2013 年推出的官方 IDE 工具，比起在 Eclipse 上安装 ADT 插件来开发 Android 程序，Android Studio 则是专业的 Android 开发 IDE。
### 搭建开发环境

上面这些工具不需要单独下载，为了简化搭建开发环境的过程，Google 将所有需要的工具都集成在了 Android Studio 中，只需要下载一个 Android Studio 即可。下载地址在 Android 官网：[https://developer.android.google.cn/studio](https://developer.android.google.cn/studio)。
下载下来的是一个安装包，安装过程也很简单，基本上一直点击「Next」即可。安装成功后，Android Studio 会自动下载一些工具，比如 Android SDK 等，之后就进入到 Android Studio 的欢迎界面，此时 Android 开发环境就搭建完成。
## 第一个 Android 应用

第一个程序毫无疑问是 Hello World，下面就来创建一个 Android 的 HelloWorld 程序。
### 创建 HelloWorld 项目

在 Android Studio 欢迎界面点击「Start a new Android Studio project」，会打开一个创建新项目的界面。首先需要选择一个项目类型，不仅可以选择手机或平板类的项目，还可以选择可穿戴设备、电视等类型，这里就选择手机类型。Android Studio 还提供了很多内置模版，这里选择最简单的 「Empty Activity」，创建一个空的 Activity 就可以。

![image.png](https://s2.loli.net/2024/01/10/1IQS7gejuP5dnqv.png)

点击「Next」进入项目配置界面。
这个界面上需要的填写的信息如下：

![image.png](https://s2.loli.net/2024/01/10/Wa67KCyeZDRXAIk.png)

- Name：应用名称，例如 HelloWorld。
- Package Name：项目的包名。Android系统通过包名来区分程序，需保证其唯一性。Android Studio 会根据应用名称来自动生成默认的包名，也可以自行修改。
- Save location：项目代码存放的位置。
- Language：表示使用哪种语言开发 Android 应用，目前默认选项是 Kotlin。在过去，Android 应用程序是使用 Java 进行开发，2017 Google I/O 大会上，Google 宣布将 Kotlin 作为 Android 开发的 First-Class（一等公民）语言。在 2019 Google I/O 大会上，Google 宣布，Kotlin 成为 Android 应用程序开发者的首选语言（Kotlin-First）。
- Minimum SDK：设置项目最低的兼容版本。从上图可以看到，截至 2023 年，Android 5.0 以上系统已经超过 99.5%，所以通常选择 API 21 即可。
- 最下面还有个复选框「Use legacy android.support libraries」，这个选项新项目不用勾选，会默认使用 AndroidX 来代替 Android Support Library。

最后，点击Finish，项目创建成功。

### 运行项目

前面创建项目时，选择了模板，Android Studio 会根据模板自动生成一些初始代码，因此现在可以不用编写任何代码，HelloWorld 程序就已经可以运行了。一般有两种方式来运行 Android 项目。一种是 Android Studio 提供的 Android 模拟器，另一种是真实的 Android 手机。

**创建模拟器**

在 Android Studio 中选择「**Device Manager**」，进入模拟器管理界面，这里可以创建和启动模拟器。点击「Create device」，选择一款设备（如 Pixel），点击「Next」，再选择模拟器所使用的操作系统版本，可以选择目前最新的系统，并下载对应的镜像，下载完成后点击「Next」，可以对模拟器的名字、分辨率等进行配置，这里没有特殊需求可以保持默认，直接跳过。点击「Finish」完成模拟器的创建。
创建好后，模拟器列表中会多出一个模拟器设备，点击右侧 Actions 栏目中的三角形按钮，可以启动模拟器。

**在真机上运行程序**

模拟器上运行程序有时可能会比较卡，所以一般更常见的是在真实的 Android 设备（真机）上运行和调试 Android 程序。

首先需要在设备上，打开**设置**应用，选择**开发者选项**，然后启用 **USB 调试。**
针对不同操作系统的电脑，可能需要进行一些额外的配置。可以通过 USB 和 WIFI 两种方式在真实的 Android 设备上运行和调试程序，具体可以参考 [在硬件设备上运行应用](https://developer.android.com/studio/run/device?hl=zh-cn#connect)。 当设备连接到电脑上时，状态栏上会显示当前连接的设备，可以据此判断连接是否正常。

**运行 HelloWorld**

当启动了模拟器或者连接上真机后，就可以点击模拟器或真机旁边的三角形按钮来编译并安装项目到设备上。

运行结果如图所示：

![image.png](https://s2.loli.net/2024/01/10/GUoF9t6pw2DIWTN.png)

## 分析 Android 程序

项目的结构列表位于最左边，刚创建的新项目默认使用 Android 模式的项目结构，但这并不是真实的目录结构，是为了快速开发而设置的，点击结构列表上面的下拉列表，选择「Proejct」，即看到真实的目录结构。

![image.png](https://s2.loli.net/2024/01/10/ZasFfTXnrldKSRe.png)
![image.png](https://s2.loli.net/2024/01/10/WdwTYB1XmHLkc2N.png)

### 项目根目录内容

下面从项目根目录开始，介绍下根目录下的各个文件及文件夹的作用。

- `.gradle/` 和 `.idea/`：这两个目录下放置的都是 Android Studio 自动生成的文件，不用管它们。
- `app/`：项目的代码、资源等内容都放在这个目录。开发工作基本在此目录下进行。待会还会对这个目录单独展开讲解。
- `build/`：这个目录主要包含了一些在编译时自动生成的文件。
- `gradle/`：这个目录下有个 wrapper 文件夹，其中包含两个文件：`gradle-wrapper.jar` 和 `gradle-wrapper.properties`。gradle-wrapper.jar 是用来下载 gradle 的工具，gradle-wrapper.properties 是 gradle wrapper 的配置文件，其中主要是指定了 gradle 的版本。使用 gradle wrapper 的方式可以保证项目的 gradle 版本一致性，并且不需要提前将 gradle 下载好，而是会自动根据本地的缓存情况决定是否需要联网下载 gradle。gradle-wrapper.properties 中的内容如下：

```java
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
// gradle 版本的下载地址
distributionUrl=https\://services.gradle.org/distributions/gradle-7.3.3-bin.zip
```

- `.gitignore`：这个文件用来将指定的目录或文件排除在 Git 的版本控制之外。
- `build.gradle`：项目全局的 gradle 构建脚本。后面还会介绍。
- `gradle.properties`：全局的 gradle 配置文件，在这里配置的属性会影响项目所有的 gradle 编译脚本。
- `gradlew` 和 `gradlew.bat`：用来在命令行中执行 gradle 命令，其中 gradlew 是在 Linux 或 Mac 系统中使用的，gradlew.bat 是在 Windows 系统中使用的。
- `HelloWorld.iml`：iml 文件是所有 IntelliJ IDEA 项目都会自动生成的一个文件（Android Studio 基于 IntelliJ IDEA），用于标识这是一个 IntelliJ IDEA 项目。
`local.properties`：和 gradle.properties 作用类似，但不会被提交到 Git 中，适用于本地的编译配置。比如默认会在这个文件中生成本机中的 Android SDK 和 NDK 路径。
`settings.gradle`：用于指定项目中所有引入的模块。一般都是自动引入。



## 总结

这篇文章是以《Android 第一行代码（第三版）》第一章内容为基底，总结 Android 入门基础知识。
首先简要介绍了 Android 系统的历史、系统架构及已发布的一些版本。接着是介绍如何搭建 Android 开发环境，并运行第一个 HelloWorld 程序。最后是详细分析了 Android 项目的组成元素及项目代码。
相信看完这篇文章，读者可以对 Android 开发有个粗略的认识。下一篇将介绍 Android 四大组件之一的 Activity。

## 参考文档

- [《Android 第一行代码（第三版）》郭霖著](https://www.ituring.com.cn/book/2744)
- [《安卓传奇：Android缔造团队回忆录》](https://book.douban.com/subject/36149272/)
- [Kotlin 成为 Android 官方支持开发语言 5 周年](https://www.oschina.net/news/207562/5-years-of-kotlin-on-android)
- [创建和管理虚拟设备](https://developer.android.com/studio/run/managing-avds?hl=zh-cn)
- [在硬件设备上运行应用](https://developer.android.com/studio/run/device?hl=zh-cn#connect)
- [Awesome-Android-Notebook/第一行代码（第二版）](https://github.com/JsonChao/Awesome-Android-Notebook/blob/master/notes/%E7%AC%AC%E4%B8%80%E8%A1%8C%E4%BB%A3%E7%A0%81%EF%BC%88%E7%AC%AC%E4%BA%8C%E7%89%88%EF%BC%89.md#%E4%B8%80%E5%BC%80%E5%A7%8B%E5%90%AF%E7%A8%8B%E4%BD%A0%E7%9A%84%E7%AC%AC%E4%B8%80%E8%A1%8Candroid%E4%BB%A3%E7%A0%81)
