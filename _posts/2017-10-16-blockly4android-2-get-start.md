---
layout: post
title: Blockly4Android 开发指南（2）开始使用 Blockly
date: 2017-10-16 21:20
tag: ["Blockly4Android"]
categories: 译文
subtitle: 翻译的 Google Blockly 官方文档第二篇
---
### 申明

本文翻译自Google Blockly 官方文档。

---

这份指南适用于那些希望将 Blockly 作为代码编辑器来进行 App 开发的 Android 开发者。在阅读这份指南之前，我们希望你对 Blockly 的用法有一定了解，并且知道如何使用 Android Studio 进行 App 的开发。

在 Android 应用中使用 Blockly 的基本步骤是：

1. 创建工程并且配置 Activity
2. 配置项目依赖
3. 继承 AbstractBlocklyActivity 并实现必要的方法

当你完成上述三步，你的应用程序会和 Blockly 官方 Demo 的基本效果一致，得到一个包含许多 Block 的工具箱（toolbox）和一个大工作区（workspace），如图所示：

![img1](https://i.loli.net/2019/08/29/8A2CTk3J6lveXYh.jpg)

### 创建工程和 Activity

如果你还没有创建工程，就在 Android Studio 中用「Empty Activity」模板创建一个新的工程。Blockly 需要项目的 minSdkVersion 大于或等于18。如果你已经有了一个工程，就在添加一个「Empty Activity」到已有的工程中。

![img2](https://i.loli.net/2019/08/29/u4niqFsrwMILotc.jpg)

这两种情况下，你都不需要为你的 Blockly Activity 创建对应的布局文件，它会自动使用 Blockly 库中提供的布局文件。

在 AndroidManifest.xml 文件中，像如下代码一样设置 **windowSoftInputMode**：

```
<application ...
    android:windowSoftInputMode="stateHidden|adjustPan"
    />
```

这样设置 windowSoftInputMode 确保即使在有输入框的情况下，键盘都处于隐藏状态。当键盘（或其他输入法编辑器 Input Method Editor）出现时，它还将确保工作区平移以显示这些区域。

AndroidManifest.xml 文件中 < appliction > 标签里 style 所设置样式为 AppTheme， 在 res/values/styles.xml 文件中找到这个样式，设置它的父样式为 **BlocklyVerticalTheme**。

```
<style name="AppTheme" parent="BlocklyVerticalTheme">
    <!-- Customize your theme here. -->
    ...
</style>
```
（译者注：其实设置样式这步应该在导入依赖后进行，因为没导入依赖前系统中找不到 BlocklyVerticalTheme 这个样式）

### 配置工程依赖

打开你项目工程的 build.gradle 文件，并确保它包含 JCenter 仓库。同时还要确保它包含 Android 的支持和兼容性类的 Google maven 仓库。由最新版本的 Android Studio 创建的项目文件应该已经包含了这些仓库，如下所示：

```
allprojects {
    repositories {
        jcenter()
        maven {
            url 'https://maven.google.com'
        }
    }
}
```

接下来，打开你应用的 build.gradle 文件，通常这个文件都在工程的 app 目录下。在依赖的模块里添加以下几行依赖：

```
compile 'com.android.support:appcompat-v7:26.0.1'
compile 'com.android.support:recyclerview-v7:26.0.1'
compile 'com.android.support:support-v4:26.0.1'
compile 'com.google.blockly.android:blocklylib-vertical:0.9-beta.20171003'
```

（译者注：其实关键的依赖只有最后那个 Blockly 库，其他依赖在创建工程的过程中基本都已经导入了）

> ![a.png](https://i.loli.net/2019/08/30/8gYSm73q5VULt4f.png) 
请注意：在 JCenter 网站的 [**blocklylib-core**](https://bintray.com/bintray/jcenter?filterByPkgName=blocklylib-core) 和 [**blocklylib-vertical**](https://bintray.com/bintray/jcenter?filterByPkgName=blocklylib-vertical) 中查看依赖的最新版本。

### 实现基类 Activity

最简单的开发一个 Android Blockly Activity 的方法就是区继承 [**AbstractBlocklyActivity**](https://github.com/google/blockly-android/blob/master/blocklylib-core/src/main/java/com/google/blockly/android/AbstractBlocklyActivity.java)，我们强烈推荐在你第一个 Blockly  应用中使用它。这个类有如下几个抽象方法需要你来覆盖，这些抽象方法的具体实现你可以参考 [**SimpleActivity**](https://github.com/google/blockly-android/blob/master/blocklydemo/src/main/java/com/google/blockly/android/demo/SimpleActivity.java)。

#### getToolboxContentsXmlPath()

getToolboxContentsXmlPath() 返回 assets/ 目录下定义工具箱（toolbox）内容的 XML 文件路径。
 
```
@Override
protected String getToolboxContentsXmlPath() {
    return "default/toolbox.xml";
}
```

> ![a.png](https://i.loli.net/2019/08/30/8gYSm73q5VULt4f.png) 请注意：想了解关于工具箱（toolbox）的更多内容，请参阅「[填充工具箱](https://developers.google.cn/blockly/guides/configure/android/toolbox)」

#### getBlockDefinitionsJsonPaths()

getBlockDefinitionsJsonPaths() 返回 assets/ 目录下定义块（Block）的 .json 文件路径，以下代码实现了导入Blockly库中提供的默认块（Block）。

```
@Override
protected List<String> getBlockDefinitionsJsonPaths() {
    List<String> assetPaths = new ArrayList<>(DefaultBlocks.getAllBlockDefinitions());
    // Append your own block definitions here.
    return assetPaths;
}
```

DefaultBlocks 类中包含了 Blockly 预定义块的帮助函数。 getAllBlockDefinitions（）返回一个所有预定义块路径的数组。从这个地方开始是容易的，尽管开发者们最终会想要选择与应用程序相关的特定块，以及特定于运行时环境的创建块。

关于创建新的 Blockly 块的详细信息，请参阅「[添加自定义块](https://developers.google.cn/blockly/guides/configure/android/add-custom-blocks)」。

#### getGeneratorsJsPaths()
getGeneratorsJsPaths() 返回 assets/ 目录下定义 Blockly  块实现方法的生成器 .js 文件的路径。下面代码表示引入包括 Blockly 默认块的所有 JavaScript 实现。

```
private static final List<String> JAVASCRIPT_GENERATORS = Arrays.asList(
    // Custom block generators go here. Default blocks are already included.
);

@Override
protected List<String> getGeneratorsJsPaths() {
    return JAVASCRIPT_GENERATORS;
}
```

> ![a.png](https://i.loli.net/2019/08/30/8gYSm73q5VULt4f.png) 请注意：在「[自定义生成器](https://developers.google.cn/blockly/guides/configure/android/custom-generators)」中了解更多关于生成器（generators）内容。

#### getCodeGenerationCallback()

getCodeGenerationCallback() 返回将生成的代码返回给应用的回调，这个方法在用户点击标题栏（actionbar）中的 run/play 按钮时被调用。

```
CodeGenerationRequest.CodeGeneratorCallback mCodeGeneratorCallback =
        new LoggingCodeGeneratorCallback(this, "LoggingTag");

@Override
protected CodeGenerationRequest.CodeGeneratorCallback getCodeGenerationCallback() {
    return mCodeGeneratorCallback;
}
```

在上述代码中，应用对于每次调用都使用相同的生成器回调。这种做法是常见的，但不是必须的。

#### onInitBlankWorkspace()

虽然不是一种抽象方法，但是如果您的应用程序包含 default / variable_blocks.json，则现在需要onInitBlankWorkspace（）来定义可用的变量。支持变量的功能目前正在开发中。

```
@Override
protected void onInitBlankWorkspace() {
    // Initialize available variable names.
    getController().addVariable("item");
}
```

### 下一步

这时候，你的应用程序应该可以编译和运行，效果类似于 SimpleActivity 。接下来，你可以从如下几个不同方面来进行进一步的开发。

- [自定义活动布局](https://developers.google.cn/blockly/guides/configure/android/customize-layout)，为应用的导航和可视化让出空间。
- 在新的块 .json 文件中[定义和添加自定义块](https://developers.google.cn/blockly/guides/create-custom-blocks/define-blocks)
- [自定义工具箱中的类别和块](https://developers.google.cn/blockly/guides/configure/android/toolbox)
- [从源头构建 Blockly 库，并链接 **.aar** 文件](https://developers.google.cn/blockly/guides/modify/android/building_and_linking)