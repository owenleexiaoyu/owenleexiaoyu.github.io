---
title: Blockly4Android 开发指南（6）自定义 Activity 布局
date: 2017-10-22 22:40
tag: ["Blockly4Android"]
categories: 译文
thumbnail: http://image.wufazhuce.com/FhiVdSeYEo8Pu7yS2Gu-GwnaKkvR
---
### 申明

本指南翻译自 Google Blockly 官方文档。

---

默认情况下，[AbstractBlocklyActivity](https://github.com/google/blockly-android/blob/master/blocklylib-core/src/main/java/com/google/blockly/android/AbstractBlocklyActivity.java) 用一个大的工作区（workspace）填充整个屏幕。这个工作区由 [blockly_unified_workspace.xml](https://github.com/google/blockly-android/blob/master/blocklylib-core/src/main/res/layout/blockly_unified_workspace.xml) 来定义，布局上将工作区、工具箱和垃圾桶组合在一起。

![enter image description here](https://developers.google.cn/blockly/images/unified-layout-android.png)

这个布局由onCreateContentView() 方法加载到 Activity 中：

```
protected View onCreateContentView(int containerId) {
    return getLayoutInflater().inflate(R.layout.blockly_unified_workspace, null);
}
```

在程序中可以重载此方法以使用自己的视图。在 [SplitActivity](https://github.com/google/blockly-android/blob/master/blocklydemo/src/main/java/com/google/blockly/android/demo/SplitActivity.java) 和 [TurtleActivity](https://github.com/google/blockly-android/blob/master/blocklydemo/src/main/java/com/google/blockly/android/demo/TurtleActivity.java) 中可以找到两个相关示例：

```
Override
protected View onCreateContentView(int parentId) {
    View root = getLayoutInflater().inflate(R.layout.split_content, null);
    mGeneratedTextView = (TextView) root.findViewById(R.id.generated_code);

    return root;
}
```

这两种情况下，修改后的布局都是在效果预览视图的旁边简单地引用了 blockly_unified_workspace.xml 的布局。

```
<include layout="@layout/blockly_unified_workspace" />
```

### 直接引用 Blockly UI

虽然 blockly_unified_workspace 可以轻松地在 Blockly 工作区旁边添加一些额外的 UI，但通过直接添加 Blockly UI 可以实现更高级的布局。

[AbstractBlocklyActivity](https://github.com/google/blockly-android/blob/master/blocklylib-core/src/main/java/com/google/blockly/android/AbstractBlocklyActivity.java) 中的默认实现是使用 [BlocklyActivityHelper](https://github.com/google/blockly-android/blob/master/blocklylib-core/src/main/java/com/google/blockly/android/BlocklyActivityHelper.java)，它会查找以下 fragment 的ID：

- blockly_workspace：定义主要工作区域的[WorkspaceFragment](https://github.com/google/blockly-android/blob/master/blocklylib-core/src/main/java/com/google/blockly/android/WorkspaceFragment.java)。
- blockly_categories：可选的[CategorySelectorUI](https://github.com/google/blockly-android/blob/master/blocklylib-core/src/main/java/com/google/blockly/android/ui/CategorySelectorUI.java)，用于在工具箱中更改块的类别。默认实现是一个 [CategorySelectorFragment](https://github.com/google/blockly-android/blob/master/blocklylib-core/src/main/java/com/google/blockly/android/CategorySelectorFragment.java)。
- blockly_toolbox_ui：用户可以从 [BlockListUI](https://github.com/google/blockly-android/blob/master/blocklylib-core/src/main/java/com/google/blockly/android/ui/BlockListUI.java) 中将新块拖动到工作区。虽然严格上说只是是其中一个可选的方案，但实际上这是将块添加到工作区的最常用方式。默认实现是一个 [FlyoutFragment](https://github.com/google/blockly-android/blob/master/blocklylib-core/src/main/java/com/google/blockly/android/FlyoutFragment.java)。
- blockly_trash_ui：一个可选的 [BlockListUI](https://github.com/google/blockly-android/blob/master/blocklylib-core/src/main/java/com/google/blockly/android/ui/BlockListUI.java)，列出所有最近删除的块。默认实现是一个[FlyoutFragment](https://github.com/google/blockly-android/blob/master/blocklylib-core/src/main/java/com/google/blockly/android/FlyoutFragment.java)。

在 Activity 中可以覆盖 onCreateContentView() 方法来构建或扩充任何布局，并且可以将这些 fragment 放置在任何位置。使用包含这些 fragment 的自定义布局示例可以在 [FlyoutDemos](https://github.com/google/blockly-android/blob/master/blocklydemo/src/main/java/com/google/blockly/android/demo/FlyoutDemos.java) 的 Activity 中找到。

有关 fragment 的配置选项和 XML 布局属性的详细信息，请查看上述每个 fragment 的 JavcDoc 文档。

有关示例请查看：[blockly_unified_workspace.xml](https://github.com/google/blockly-android/blob/master/blocklylib-core/src/main/res/layout/blockly_unified_workspace.xml)

### 控制按钮

除了 fragment 之外，BlocklyActivityHelper 还会查找四个 View 的 ID 作为按钮。

- blockly_zoom_in_button：放大（放大）工作区。
- blockly_zoom_out_button：缩小（缩小）工作区。
- blockly_center_view_button：重置工作区。
- blockly_trash_icon：打开或关闭垃圾桶列表，如果存在并且可关闭。它也作为删除块的放置目标。

在 [blockly_unified_workspace](https://github.com/google/blockly-android/blob/master/blocklylib-core/src/main/res/layout/blockly_unified_workspace.xml) 中，这些按钮堆叠在工作区的右侧（或在左侧，从右到左的语言中）。

![enter image description here](https://developers.google.cn/blockly/images/buttons-android.png)


 

