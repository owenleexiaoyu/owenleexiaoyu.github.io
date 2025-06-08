---
{"dg-publish":true,"permalink":"/HaiShu/Android/🤖 Android 启程/","tags":["编程","Android"],"noteIcon":"","created":"2024-01-10T23:06:26.664+08:00","updated":"2025-06-08T17:24:35.741+08:00"}
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

### app 目录内容

因为大部分的开发工作在此目录下，所以接下来详细分析一下 app 目录。

| **文件或目录**             | **说明**                                                                               |
| --------------------- | ------------------------------------------------------------------------------------ |
| `build/`              | 与项目根目录下的 build 目录类似，包含编译时自动生成的文件。                                                    |
| `libs/`               | 如果项目中用到了第三方 jar 包，就需要把它们放在这个 libs 目录下。这个目录下的 jar 包会被自动添加到构建路径中去。                     |
| `androidTest/`        | 用来编写 Android Test 测试用例的，可以对项目进行一些自动化测试。                                              |
| `java/`               | 放置 Java 和 Kotlin 代码的文件夹。Android Studio 自动在这个目录下生成了一个 MainActivity.kt 文件。             |
| `res/`                | 用于存放项目中使用的图片、布局、字符串等资源。包含很多子目录，比如图片放在 drawable 目录下，布局放在 layout 目录下，字符串放在 values 目录下。 |
| `AndroidManifest.xml` | 整个 Android 项目的配置文件，可以在这个文件里定义四大组件和添加静态权限声明。后面会详细说明。                                  |
| `test/`               | 在这个文件夹下编写 Unit Test 测试用例。                                                            |
| `.gitignore`          | 和项目根目录下 .gitignore 文件作用类似，用于将 app 目录范围内指定的目录或文件排除在 Git 版本控制之外。                       |
| `app.iml`             | IntelliJ IDEA 项目自动生成的文件，无需关心。                                                        |
| `build.gradle`        | app 模块的 gradle 构建脚本，其中会指定很多项目构建相关的配置。后面会详细说明。                                        |
| `proguard-rules.pro`  | 这个文件用于指定代码的混淆规则，混淆会使破解者难以阅读反编译的代码。                                                   |

### 详解项目初始代码

接下来通过分析项目初始代码，介绍 Android 项目如何运行起来，如何在界面上显示出 Hello World! 的内容。
首先打开 `AndroidManifest.xml` 文件，从中可以找到如下代码：

```xml
<activity
  android:name=".MainActivity"
  android:exported="true">
  <intent-filter>
    <action android:name="android.intent.action.MAIN" />
    <category android:name="android.intent.category.LAUNCHER" />
  </intent-filter>
</activity>
```

这段代码表示对 MainActivity 进行注册，没有在 AndroidManifest.xml 里注册的 Activity 是不能使用的。其中 intent-filter 里的两行代码非常重要:

```xml
<action android:name="android.intent.action.MAIN" />
<category android:name="android.intent.category.LAUNCHER" />
```

这表示了 MainActivity 是这个项目的主 Activity，在手机上点击应用图标，首先启动的就是这个 Activity，也就是应用程序的入口。
MainActivity 是一个 Activity，Activity 是 Android 的四大组件之一，表示应用的界面，应用所能看到的 UI，基本上都是承载在 Activity 里。看下 MainActivity 的代码： 

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
    }
}
```

MainActivity 继承自 AppCompatActivity，AppCompatActivity 是 AndroidX 提供的一种向下兼容的 Acitivity，可以使 Activity 在不同系统版本中的功能保持一致性。Activity 是系统提供的一个基类，必须继承它或者它的子类才能拥有 Activity 的特性（AppCompatActivity 是 Activity 的子类）。
MainActivity 中有个 onCreate 方法，这是 Activity 创建时的生命周期回调方法。这个方法里第二行调用 `setContentView` 方法，给当前 Activity 引入一个 activity_main 的布局，在 activity_main 布局中编写 UI 相关的代码。
布局文件定义在 res/layout 目录下，来看下 activity_main.xml 的内容：

```kotlin
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello World!"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        />

</androidx.constraintlayout.widget.ConstraintLayout>
```

可以看到 XML 文件中有个 `TextView`，这是 Android 系统提供的一个控件，用来在界面上展示文字，其中有行代码是 `android:text="Hello World!"`，正是这行代码将 Hello World! 展示到界面上。

### 详解项目中的资源

接下来再来介绍下 Android 项目中的各种资源。

![image.png](https://s2.loli.net/2024/01/10/efnmtcA6OPU8uqr.png)

res 目录下各类子目录的作用见下表：

- `drawable`：所有以 drawable 开头的文件夹用来存放图片
    - drawable
    - drawable-v24
    - drawable-hdpi
    - drawable-xhdpi
    - drawable-xxhdpi
- `mipmap`：所有 mipmap 开头的文件夹用来存放应用图标
    - mipmap-anydpi-v26
    - mipmap-hdpi
    - mipmap-xhdpi
    - mipmap-xxhdpi
    - mipmap-xxxhdpi

> drawable 和 mipmap 有很多以 hdpi、xhdpi、xxhdpi 为后缀的文件夹，这是为了让程序更好地兼容各种设备。在开发时，最好能够给同一张照片提供几个不同分辨率的版本，分别放在这些目录下，然后程序运行时会自动根据当前设备分辨率的高低选择加载哪个目录下的图片。如果只有一种分辨率的图片的话，可以把它放在 `drawable-xxhdpi` 目录下，这是最主流的设备分辨率目录，mipmap 也是同理。

- `layout`：所有 layout 开头的文件夹用来存放布局文件
- `values`：所有 values 开头的文件夹用来存放字符串、颜色、样式等配置

再来看看如何使用这个目录下的资源，以字符串资源为例，打开 `res/values/strings.xml` 文件，内容如下所示：

```xml
<resources>
  <string name="app_name">HelloWorld</string>
</resources>
```

可以看到这里定义了一个应用程序名的字符串，引用该字符串有两种方式：

- 代码中使用 `R.string.app_name`
- XML 中使用 `@string/app_name`

drawable、mipmap、layout 的引用方式和字符串类似，比如 drawable 资源是将上面 string 换成 drawable，布局文件是将 string 换成 layout，比如前面 MainActivity 中的 `setContentView(R.layout.activity_main)`。
再举一个例子来帮助理解，打开 AndroidManifest.xml：

```xml
<application
  android:allowBackup="true"
  android:icon="@mipmap/ic_launcher"
  android:label="@string/app_name"
  android:roundIcon="@mipmap/ic_launcher_round"
  android:supportRtl="true"
  android:theme="@style/AppTheme">
</application>
```

其中，项目的应用图标是通过 `android:icon` 属性指定，应用名称是通过 `android:label` 属性指定，应用的主题通过 `android:theme` 属性指定。可以看到这里对资源的引用方式正是第二种在 XML 中引用资源的语法。

### 详解 build.gradle 文件

Android Studio 采用 Gradle 来构建 Android 项目。Gradle 是一个优秀的项目构建工具，基于 Groovy 的领域特定语言（DSL）来声明项目设置，摒弃了传统基于 XML（如 Maven）的各种繁琐配置。
前面提到，项目中有两个 `build.gradle` 文件，一个在项目根目录下，一个在 app 目录下，这两个文件对构建 Android 项目都起到至关重要的作用，下面来对这两个文件的内容进行详细分析。

**项目根目录下的 build.gradle**

先来看项目根目录下的 build.gradle 文件。

```groovy
buildscript {
    ext.kotlin_version = '1.3.61'
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:3.5.2'
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}
```

`buildscript` 闭包表示项目构建脚本，定义了项目构建过程中的依赖。
`allprojects` 闭包表示这里面的配置会应用到项目的所有模块中。
buildscript 和 allprojects 两处都有一个 `repositories` 闭包，其中都声明了 `google()` 和 `mavenCentral()` 这两行配置，它们分别对应一个代码托管仓库，google 仓库中包含的主要是 Google 自己扩展依赖库，如 AndroidX；而 mavenCentral 仓库中包含的大多是第三方开源库，声明这两行配置，就可以在项目中轻松引用任何 google 和 mavenCentral 上的依赖库了。
`dependencies` 闭包使用了 classpath 声明了两个插件：一个 Gradle 插件和一个 Kotlin 插件。Gradle 并不是专门为构建 Android 项目而开发的，Java、C++ 等很多项目也可以使用 Gradle 来构建，因此需要一个专门用于构建 Android 项目的 Gradle 插件 `com.android.tools.build:gradle`，也被称为 AGP（Android Gradle Plugin）。另一个 Kotlin 插件是当项目用 Kotlin 开发时，需要这个插件，它将 Kotlin 源码编译成 JVM 的字节码。

**app 目录下的 build.gradle**

下面再来分析一下 app 目录下的 build.gradle 文件。

```groovy
apply plugin: 'com.android.application'
apply plugin: 'kotlin-android'
apply plugin: 'kotlin-android-extensions'

android {
    compileSdkVersion 29
    buildToolsVersion "29.0.2"
    defaultConfig {
        applicationId "com.example.helloworld"
        minSdkVersion 21
    	targetSdkVersion 29
    	versionCode 1
    	versionName "1.0"
    	testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'),
                    'proguard-rules.pro'
        }
    }
}

dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    implementation "org.jetbrains.kotlin:kotlin-stdlib-jdk7:$kotlin_version"
    implementation 'androidx.appcompat:appcompat:1.1.0'
    implementation 'androidx.core:core-ktx:1.1.0'
    testImplementation 'junit:junit:4.12'
    androidTestImplementation 'androidx.test.ext:junit:1.1.1'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.2.0'
}
```

第一行应用了一个插件，有两种值可选：

- `com.android.application`：表示这是一个应用程序模块
- `com.android.library`：表示这是一个库模块

这两个的区别是：应用程序可以直接运行，库模块只能作为代码库依附于别的应用程序模块来运行。这两个插件就来自于项目根目录下 通过 classpath 引入的 `com.android.tools.build:gradle`
接下来两行应用了 `kotlin-android` 和 `kotlin-android-extensions` 两个插件，都来自于项目根目录下通过 classpath 引入的 `org.jetbrains.kotlin:kotlin-gradle-plugin`。如果要用 Kotlin 开发 Android 项目，第一个插件是必须的，第二个插件实现了一些非常好用的 Kotlin 扩展功能。
接下来是一个大的 `android` 闭包，用于配置项目构建的各种属性：

| **配置** | **说明** |
| --- | --- |
| `compileSdkVersion` | 用于指定项目的编译版本，这里指定成 29 表示使用 Android 10.0 系统 SDK 编译 |
| `buildToolsVersion` | 用于指定项目构建工具的版本 |

然后，在 andorid 闭包中嵌套了一个 defaultConfig 闭包，可以看到对项目更多细节的配置。

| **配置**                      | **说明**                                                                                                                                                                                                     |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `applicaitonId`             | 应用的唯一标识符，绝对不能重复，默认会使用创建项目时指定的包名                                                                                                                                                                            |
| `minSdkVersion`             | 指定项目最低兼容的 Android 系统版本。这里指定成 21 表示最低兼容到 Android 5.0 系统                                                                                                                                                     |
| `tartgetSdkVersion`         | 指定的值表示在该目标版本上已经做了充分的测试，系统将会为应用程序启动一些最新的功能和特性。比如 Android 6.0 引入了运行时权限，如果将 targetSdkVersion 设为 23 或更高，那么系统就会为应用启用运行时权限，如果将 targetSdkVersion 设为 22，说明程序最高只在 Android 5.1 系统上做过充分测试，Android 6.0 系统引入的新功能不会对应用启用 |
| `versionCode`               | 指定项目的版本号                                                                                                                                                                                                   |
| `versionName`               | 指定项目的版本名                                                                                                                                                                                                   |
| `testInstrumentationRunner` | 用于在当前项目中启用 JUnit 测试，可以为当前项目编写测试用例，以保证功能的正确性和稳定性                                                                                                                                                            |

接下来，看下 `buildTypes` 闭包，buildTypes 闭包中用于指定应用打包时的配置。通常只有两个子闭包：`debug` 和 `release`。

- debug 子闭包：指定生成测试版安装包的配置，一般是忽略不写
- release 子闭包：指定生成正式版安装文件的配置

在 release 子闭包中，会指定如下配置：

| **配置**          | **说明**                                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `minifyEnabled` | 指定是否对项目的代码进行混淆，true 表示混淆，false 表示不混淆                                                                                                                    |
| `proguardFiles` | 指定混淆时使用的规则文件。这里指定了两个文件：`proguard-android-optimize.txt`：在`<Android SDK>/tools/proguard` 目录下，是所有项目通用的混淆规则；`proguard-rules.pro`：在当前项目的根目录下，用于编写当前项目特有的混淆规则 |

整个 android 闭包中的内容分析完了，还剩一个 `dependencies` 闭包，它用于指定当前项目所有的依赖关系。通常有 3 种依赖方式：

- 本地依赖：第一行的 `implementation fileTree` 就是一个本地依赖声明，表示将 libs 目录下的所有 .jar 后缀的文件都添加到项目的构建路径当中。
- 远程依赖：第二行的 implementation 则是远程依赖声明，`androidx.appcompat:appcompat:1.1.0` 是一个标准的远程依赖库格式，其中：
   - 第一个分号前面的 androidx.appcompat 被称为 groupId，表示域名，用于和其他公司的库做区分；
   - 第一个分号和第二个分号中间部分的 appcompat 被称为 artifactId，表示工程（产物）名，用于和同一公司不同库工程做区分；
   - 第二个分号后面的 1.1.0 是版本号，用于和同一个库中不同的版本做区分。

加上这个声明后，Gradle 会在构建项目时会首先检查一下本地是否已经有这个库的缓存，如果没有则会自动联网下载，然后在添加到项目的构建目录当中。

- 库依赖：上面代码里没有用到，它的基本格式是 `implementation project` 后面加上依赖的库的名称，比如创建了一个和 app 模块的同级的模块/库叫 helper，那么添加这个库的依赖只需要添加 `implementation project(':helper')` 这句声明即可。

剩下的 testImplementation 和 androidTestImplementation 都是用于声明测试用例库的，暂时用不到，可以先忽略。

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
