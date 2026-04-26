---
{"dg-publish":true,"permalink":"/HaiShu/Kotlin/WanAndroid 项目迁移 KMP/","tags":["Kotlin","KMP","编程"],"noteIcon":"","created":"2025-03-28","updated":"2025-06-08T10:37:28.702+08:00"}
---


## 前言

[WanAndroid](https://github.com/owenleexiaoyu/WanAndroid) 是笔者的一个个人项目，在此项目中尝试 MVP、MVVM 等代码架构，实践一些主流开源库。目前最新的版本是基于 Kotlin + MVVM + 协程。最近，笔者希望开启一个新的大版本迭代，整体将项目改造为一个 KMP + Compose Multiplatform 的跨平台项目，能够运行在 Android、iOS、Desktop、Web 等多个平台上。这篇文章记录了项目迁移的操作和踩坑过程。

## 迁移实践

整体上，笔者参考了 Google 官方提供的 [将 Kotlin Multiplatform 添加到现有项目](https://developer.android.com/kotlin/multiplatform/migrate?hl=zh-cn) 文档。目标是在项目中添加一个 KMP 模块，在 KMP 模块中添加一些简单的 KMP 和 Compose Multiplatform 的代码，能够在 Android 和 iOS 上成功运行起来。

Android Studio Meerkat（猫鼬）中提供了新建 KMP 模块的功能，但是要求 Kotlin 版本 1.9.20，AGP 版本 8.9。

### 步骤 1：升级 Android Studio

将 Android Studio 从 Flamingo 升级到 Meerkat，这步是比较简单的，去官网下载对应的安装包即可，笔者安装了此时最新稳定版 [Meerkat 2024.3.1](https://androidstudio.googleblog.com/2025/03/android-studio-meerkat-202431-now.html)。

![](https://img.lixiaoyu.life/blog-res/2025/03/b539b59d794b36f6759e0d31b68b6cf2.png)

> Android Studio Meerkat 新功能：
> [Android Studio Meerkat | 2024.3.1](https://developer.android.google.cn/studio/releases)
> [Android Studio Meerkat | 2024.3.1 更新，快来看看有什么新功能吧](https://juejin.cn/post/7478167090499764259)
> 之前项目升级 Flamingo 的记录：[升级 Android Studio Flamingo](https://www.yuque.com/owenlee/uu7gp7/dcgg979d0no55i2c)


使用 AS Meerkat 打开 WanAndroid 项目，Sync 失败了，提示信息如下：

```xml
Your build is currently configured to use incompatible Java 21.0.5 and Gradle 7.3.3. Cannot sync the project.

We recommend upgrading to Gradle version 8.10.

The minimum compatible Gradle version is 8.5.

The maximum compatible Gradle JVM version is 17.
```

这是项目的 Gradle 版本和 Java 版本不兼容，将 Settings - Build Tool - Gradle - Gradle JDK 修改为 JDK 11，就可以正常 Sync 和编译项目了。

创建 KMP 模块除了要求 Meerkat 的 AS 版本外，还要求 Kotlin 1.9.20，AGP 版本 8.9（对应的 Gradle 版本是 8.11）。

### 步骤 2：升级 Gradle 和 AGP 版本

当前的 Gradle 版本为 7.3.3，AGP 版本为 7.2.2，尝试将 Gradle 版本升级到 8.11，AGP 版本升级到 8.9。不出意外升级失败了。

```xml
Multiple build operations failed.
    Could not create task ':app:processDebugResources'.
    Could not create task ':flipped_uikit:generateDebugRFile'.
Could not create task ':app:processDebugResources'.
Cannot use @TaskAction annotation on method IncrementalTask.taskAction$gradle_core() because interface org.gradle.api.tasks.incremental.IncrementalTaskInputs is not a valid parameter to an action method.
```

原因是 WanAndroid 项目源码依赖了笔者的另一个仓库 Flipped 里的库，依赖方式如下：

```xml
// settings.gradle

include ':app'
include ':flipped_uikit'
project(":flipped_uikit").projectDir = new File("../Flipped/flipped_uikit")

// app/build.gradle

implementation project(":flipped_uikit")
```

Flipped 项目的 Gradle 版本和 AGP 版本也不是最新的，和要升级的版本存在不兼容。这里有两种处理方式：

+ 将 Flipped 项目的 Gradle 和 AGP 版本也升级到 8.11 和 8.9，保持源码编译
+ 将 Flipped 中的 flipped_uikit 库发布为二进制产物，通过二进制依赖方式集成到项目中

笔者一直想试试将自己的组件发布到 MavenCentral 或者 Jitpack 上，所以这里采用了第二种方式。

这里简单写一下过程：

1. 使用 Android Studio 提供的 AGP Upgrade Assistant 将 Flipped 项目 Gradle 版本从 7.2 升级到 7.5，AGP 版本从 7.1.1（对应 compileSDKVersion 32） 升级到 7.4.2（对应 compileSDKVersion 33）。

> AGP Upgrade Assistant 还挺好用的，能清楚展示适合升级的 Gradle 版本和 AGP 版本，还有升级后，一些写法的调整也能自动修改：比如升级到 AGP 7.4.2 后，项目包名从 AndroidManifest.xml 变到了 build.gradle 中。
>

2. 将 flipped_uikit 库发布到 Jitpack 上，没有选择 MavenCentral 是因为操作更加麻烦，Jitpack 要简单很多，整体参考了 [小记多lib module上传JitPack](https://juejin.cn/post/6955003369941368845?searchId=2025032314214660C37312A7A59BDD2089) 这篇博客。
3. 在 WanAndroid 项目中通过二进制方式依赖 flipped_uikit

```xml
// app/build.gradle

// implementation project(":flipped_uikit")
implementation 'com.github.owenleexiaoyu.Flipped:uikit:1.0.0'
```

WanAndroid 项目升级 Gradle 和 AGP 的过程：

1. 使用升级工具将 WanAndroid 项目 Gradle 版本从 7.3.3 升级到 7.5，AGP 版本从 7.2.2 升级到 7.4.2

```xml
// gradle/wrapper/gradle-wrapper.properties

# distributionUrl=https\://services.gradle.org/distributions/gradle-7.3.3-bin.zip
distributionUrl=https\://services.gradle.org/distributions/gradle-7.5-bin.zip

// build.gradle

dependencies {
  # classpath 'com.android.tools.build:gradle:7.2.2'
  classpath 'com.android.tools.build:gradle:7.4.2'
}
```

2. 把 WanAndroid 的 Kotlin 版本，包括 gradle-kotlin 插件，kotlin stdlib 版本都从 1.8.10 升到 1.9.20
3. 使用升级工具将 WanAndroid 项目 Gradle 版本从 7.5 升级到 8.11，AGP 版本从 7.4.2 升级到 8.9

升级后，Sync 成功，但编译时报错：

```xml
> Inconsistent JVM-target compatibility detected for tasks 'compileDebugJavaWithJavac' (1.8) and 'compileDebugKotlin' (21).	
```

这是因为 Java 和 Kotlin 编译出来的字节码不兼容。目前项目里 Java 目标字节码是 Java 8，将 Kotlin 的目标字节码也设为 Java 8

```xml
// app/build.gradle

android {
    kotlinOptions {
        jvmTarget = '1.8'
    }
}
```

把前置的 Gradle、AGP 版本升级好后，就可以使用 Android Studio 创建一个 KMP 模块了。

### 步骤 3：创建一个 KMP 模块

选择 File - New - New Module，进入模块创建页面，选择 Kotlin Multiplatform Share Module，输入 Module name 和 Package name 即可完成创建。

![](https://img.lixiaoyu.life/blog-res/2025/03/3ec77b57e57c8af64ad44c31f0b98e7b.png)

创建好后，模块中的目录结构如下图所示：

![](https://img.lixiaoyu.life/blog-res/2025/03/e11ae94831f1346fd65c731db7fc7813.png)

其中包含三个最重要的 sourceSet：

+ commonMain：跨平台的公共代码，比如 expact 的类和函数，Compose 代码等
+ androidMain：Android 平台的代码，比如 actual 的类和函数实现，可以依赖 Android SDK 或 Android 三方库，
+ iosMain：iOS 平台的代码，比如 actual 的类和函数实现，可以依赖 iOS  SDK 或 iOS 三方库

### 步骤 4：在 Android 项目中调用 KMP 代码
在 `app/build.gradle` 中添加 wankmp 模块的依赖，就可以在原来的 WanAndroid 代码中调用 KMP 代码了。

```xml
// settings.gradle

include ':wankmp'

// app/build.gradle

dependencies {
    implementation project(":wankmp")
}
```

在项目中找个地方添加一个控件，调用 KMP 的代码：

```kotlin
class DrawerFragment: Fragment() {

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        // ...
        binding.itemKmp.setTitleText("KMP: ${Greeting().greet()}")
    }

}
```

效果如下：

![](https://img.lixiaoyu.life/blog-res/2025/03/14848bf7fbac0f0835b1d8382ffe5cbf.png)

### 步骤 5：创建并运行 iOSApp
成功在 Android 平台上跑起来包含了 KMP 的代码，接下来尝试在项目中创建 iOSApp 的代码。这一步骤笔者借助了[Kotlin Multiplatform wizard](https://kmp.jetbrains.com/)<font style="color:rgb(25, 25, 28);"> 来创建 iOS 项目代码。</font>

<font style="color:rgb(25, 25, 28);">在网页上填写项目名、包名、目标平台为 Android 和 iOS，并且 iOS 选择 Share UI，也就是使用 Compose Multiplatform 开发跨平台 UI。点击下载，可以把模板代码打包成一个压缩包进行下载。</font>

![](https://img.lixiaoyu.life/blog-res/2025/03/006c2ef98bbc001a13f0868b8a153473.png)

下载后，解压缩，并用 Android Studio 打开项目。运行 Android App，可以顺利编译成功并运行。但是点击 iOSApp 中的 iOSApp.xcodeproj，在 Xcode 中打开 iOS App 代码，编译运行时失败，遇到的第一个问题是 JDK 要求 17，笔者电脑上 JDK 版本是 14，升级到了 17，在 Xcode 里编译还是失败。

失败提示：

```xml
Undefined symbol: _OBJC_CLASS_$_UITextLoupeSession
```

后面笔者又尝试在 AS 上安装 Kotlin Multiplatform 插件，这时候理论上可以直接在 AS 上跑 iOSApp，但是 iOSApp 的运行选项报错，有个红叉，且 iOSApp 这个编译选项中的 Execution target 下拉栏展示是空白，看不到任何 iOS 模拟器。

![](https://img.lixiaoyu.life/blog-res/2025/03/556c0ddeb9dcbdcdb0d8b515314bfc4c.png)

这个问题社区里也有很多其他人遇到过：[https://youtrack.jetbrains.com/issue/KT-61624/Empty-execution-target-drop-down-when-xcode-has-simulators-other-than-iPhones](https://youtrack.jetbrains.com/issue/KT-61624/Empty-execution-target-drop-down-when-xcode-has-simulators-other-than-iPhones)，说是需要把非 iPhone 的模拟器删除，笔者尝试删除了 ipad 等模拟器，但依旧无效。

此时笔者注意到 iOSApp 的配置里有 `iOS Deployment target 15.3`，`minimum deployment 15.3`，怀疑是项目目标版本较高，当前的 Xcode 版本不支持。于是笔者将 Xcode 版本从 14.2 升级到 15.4。Xcode 15.4 要求 macOS 系统版本为 Sonoma 14 及以上，因此还需要前置升级系统 macOS 版本。

> 此时最新系统版本是 Sequoia，不希望直接升到 Sequoia，在系统设置里检查更新，会直接要求升级到 Sequoia，一个技巧是去 AppStore 搜索 macOS Sonoma，然后点击更新，会跳转到系统设置的更新，但是能够下载 Sonoma 版本的操作系统。
>

将 macOS 系统升级到 Sonoma 14.8.4(Sonoma 最新版本)，Xcode 升级到 15.4（15.x 的最新版本）后，再次启动 Xcode，为模拟器下载 iOS 17.5系统，直接用 Xcode 编译 iOSApp 项目，可以编译成功并运行。效果如下：

![](https://img.lixiaoyu.life/blog-res/2025/03/1af3dcdef9fa8e7e4526f74447b3d85d.png)

将模板项目中的 iOSApp 目录中的所有 iOS 项目代码复制到原本 WanAndroid 目录下。并且复制模板项目中 KMP 和 Compose Multiplatform 示例代码到 wankmp 共享模块里。然后在 wankmp 这个 KMP 模块的 build.gradle.kts 中，增加 commonMain 的依赖，这里选择了 Compose Multiplatform 1.6.0 版本，对应的 Kotlin 版本是 1.9.22：

> 注意这里添加的 compose 依赖是 org.jetbrains 包名开头的，而不是 androidx 开头的。Compose Multiplatform 和 Jetpack Compose 的版本对应关系在 [Compatibility and versions](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-compatibility-and-versioning.html) 中可以找到。
>

```kotlin
commonMain {
    dependencies {
        implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.22")
        // Add KMP dependencies here
        implementation("org.jetbrains.compose.runtime:runtime:1.6.0")
        implementation("org.jetbrains.compose.foundation:foundation:1.6.0")
        implementation("org.jetbrains.compose.material:material:1.6.0")
        implementation("org.jetbrains.compose.ui:ui:1.6.0")
        implementation("org.jetbrains.compose.components:components-ui-tooling-preview:1.6.0")
        implementation("org.jetbrains.compose.components:components-resources:1.6.0")
    }
}
```

在 build.gradle.kts 中添加 Compose Compiler 插件：

```kotlin
plugins {
    id("org.jetbrains.kotlin.multiplatform")
    id("com.android.kotlin.multiplatform.library")
    id("org.jetbrains.compose") version "1.6.0"
}
```

然后尝试在自己项目中运行 iOS App。

直接在不出意外失败了，提示编译脚本失败。

> 笔者尝试下来，发现在 Android Studio 中直接使用 Kotlin Multiplatform 插件来编译运行 iOS 代码，能看到更多的 KMP 相关编译信息，有助于问题排查。
>

```xml
FAILURE: Build failed with an exception.

* What went wrong:
Cannot locate tasks that match ':composeApp:embedAndSignAppleFrameworkForXcode' as project 'share' not found in root project 'WanAndroid'.
```

KMP 会在 iOS 源码编译前，添加一个 Gradle 的编译任务 `./gradlew :composeApp:embedAndSignAppleFrameworkForXcode`，这里的 composeApp 是模块名，iOSApp 的代码是从模板里复制到项目中，但此时项目中的共享 KMP 模块名称是 wankmp，所以这里模块名没有对上。找到 `iOSApp/iOSApp.xcodeproj/project.pbxproj` 文件：

```xml
/* Begin PBXShellScriptBuildPhase section */
		F36B1CEB2AD83DDC00CB74D5 /* Compile Kotlin Framework */ = {
			isa = PBXShellScriptBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			inputFileListPaths = (
			);
			inputPaths = (
			);
			name = "Compile Kotlin Framework";
			outputFileListPaths = (
			);
			outputPaths = (
			);
			runOnlyForDeploymentPostprocessing = 0;
			shellPath = /bin/sh;
			shellScript = "if [ \"YES\" = \"$OVERRIDE_KOTLIN_BUILD_IDE_SUPPORTED\" ]; then\n  echo \"Skipping Gradle build task invocation due to OVERRIDE_KOTLIN_BUILD_IDE_SUPPORTED environment variable set to \\\"YES\\\"\"\n  exit 0\nfi\ncd \"$SRCROOT/..\"\n./gradlew :composeApp:embedAndSignAppleFrameworkForXcode\n";
		};
/* End PBXShellScriptBuildPhase section */
```

在其中 shellScript 内容中的 `./gradlew :composeApp:embedAndSignAppleFrameworkForXcode` 改为 `./gradlew :wankmp:embedAndSignAppleFrameworkForXcode`。

改完之后再次尝试，失败，报错信息为：

```xml
./gradlew Permission denied
```

gradlew 这个文件没有权限。搜索到 [https://youtrack.jetbrains.com/issue/KT-63135/Some-browser-strip-the-executable-bit-of-the-gradle-wrapper](https://youtrack.jetbrains.com/issue/KT-63135/Some-browser-strip-the-executable-bit-of-the-gradle-wrapper) 也遇到过类似问题，解决方式是执行 `chmod +x ./gradlew` 给 gradlew 这个文件添加权限。

第三次运行，失败，这次的报错信息是：

```xml
/Users/WanAndroid/iosApp/iosApp/ContentView.swift:3:8: error: no such module 'wankmpKit'
import wankmpKit
```

找不到 `wankmpKit` 模块。解决方案是在 [https://blog.jetbrains.com/kotlin/2021/07/multiplatform-gradle-plugin-improved-for-connecting-kmm-modules/](https://blog.jetbrains.com/kotlin/2021/07/multiplatform-gradle-plugin-improved-for-connecting-kmm-modules/) 这篇文章里找到的。还是因为复制了模板的代码，这个配置里的 `Framework Search Paths` 是模板里的 composeApp，不是 wankmp，改为 wankmp 后终于可以编译成功，运行成功了🥳，运行效果和模板代码运行起来一样。 ![](https://img.lixiaoyu.life/blog-res/2025/03/6661cd44db558243b6058ba73de6c7fc.png)

### 步骤 6：在 Android 项目中添加 Compose Multiplatform 代码

上面第 4 步里成功调用了 KMP 的代码，第 5 步里在 commonMain 里添加了一些模板项目里的 Compose Multiplatform 代码，笔者希望修改下 Android 项目的代码，创建一个新的 Activity，展示 Compose 的界面。

模板项目在 commonMain 中生成的 App() 这个 Composable 函数： 

```kotlin
@OptIn(ExperimentalResourceApi::class)
@Composable
@Preview
fun App() {
    MaterialTheme {
        var showContent by remember { mutableStateOf(false) }
        Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
            Button(onClick = { showContent = !showContent }) {
                Text("Click me!")
            }
            AnimatedVisibility(showContent) {
                val greeting = remember { Greeting().greet() }
                Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                    Image(painterResource(Res.drawable.compose_multiplatform), null)
                    Text("Compose: $greeting")
                }
            }
        }
    }
}
```



在 Android 项目引入 `androidx.activity.activity-compose` 库，引用 commonMain 里的 Compose 代码：

```kotlin
class KMPActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            App()
        }
    }

}
```

编译一下，失败了，报错信息如下：

```kotlin
java.lang.NoSuchMethodError: No static method setContent$default(Landroidx/activity/ComponentActivity;Landroidx/compose/runtime/CompositionContext;Lkotlin/jvm/functions/Function0;ILjava/lang/Object;)V in class Landroidx/activity/compose/ComponentActivityKt; or its super classes (declaration of 'androidx.activity.compose.ComponentActivityKt' appears in /data/app/~~2mgx1rZg7umBFer7fdPA8g==/cc.lixiaoyu.wanandroid-FRohvSXBzHbsXPyYTtmHZw==/base.apk)
                                                                                                    	at cc.lixiaoyu.wanandroid.core.about.KMPActivity.onCreate(KMPActivity.kt:12)
```

这是在 Android 项目里没有启用 Compose Compiler 插件（[解决JetpackCompose 编译通过但是运行报错的问题](https://blog.csdn.net/zxj2589/article/details/131870294)），解决方式是在 app/build.gradle 里添加以下配置：

```kotlin
buildFeature {
	compose true
}

composeOptions {
	kotlinCompilerExtensionVersion '1.5.8' // 对应的 compose-compiler 的版本
}
```

添加后，就顺利地在 Android 项目里运行起 Compose 代码了 🥳。运行效果如下：

![](https://img.lixiaoyu.life/blog-res/2025/03/c1fcf2df77574a6240dcbe1fe6d27f2c.png)![](https://img.lixiaoyu.life/blog-res/2025/03/6ba464c9f3168d2c974cd0d854165161.png)
## 结语

为了在 WanAndroid 项目中添加 KMP 和 Compose Multiplatform 的共享模块，以及 iOS 平台的代码，经历了升级 Gradle、AGP、Kotlin、JDK、macOS、Xcode 一系列工具，走了一些弯路，踩了好多连环坑，也花了挺多时间，特此记录一下，如果有其他人也在迁移已有的 Andorid 项目到 KMP 及 Compose Multiplatform，希望能提供一些小帮助。 

接下来，笔者将会把原有 Android 项目中的 Android 代码，逐步往 wankmp 这个共享模块中迁移，实践 KMP 开发和 Compose 开发。

