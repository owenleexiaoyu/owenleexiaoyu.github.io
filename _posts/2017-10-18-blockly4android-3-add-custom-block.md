---
layout: post
title: Blockly4Android 开发指南（3）添加自定义块
date: 2017-10-18 22:40
tag: ["Blockly4Android"]
categories: 译文
cover: http://image.wufazhuce.com/FlClKq2eSOZO3zvYc4uZSDYkYFTU
subtitle: 官方文档中关于添加自定义块的描述
---

### 申明

本指南翻译自 BLockly 官方文档。

---

Blockly 中的块由三部分组成：

- 块定义对象：定义块的外观和行为，包括文本，颜色，作用域和连接。
- 工具箱引用：工具箱 XML 文件中每种类型的块的引用，因此用户可以将其添加到工作区。
- 发生器函数：生成此块的代码字符串。它总是用 JavaScript 编写，即使目标语言不是 JavaScript。

虽然 Blockly 的 Web 版本还支持使用 JavaScript 以代码的方式来构建块定义对象，但 Android 版 的 Blockly 不支持这个功能。

### 块定义

构建一个新块的定义最简单的方式是使用「[BLockly 开发者工具](https://developers.google.cn/blockly/guides/create-custom-blocks/blockly-developer-tools)」。由于 Android 版的 Blockly 仅支持 JSON 格式的块定义，因此将工厂的「语言代码」设置为 JSON。有关此格式的详细信息，请点击「[此处](https://developers.google.cn/blockly/guides/create-custom-blocks/define-blocks#json_definitions)」。

当使用 AbstractBlocklyActivity 时， getBlockDefinitionsJsonPaths（）方法返回应用程序 assets 目录下的资源文件路径列表，向系统提供块定义文件。块定义可以通过调用 reloadBlockDefinitions（）来重新加载。

当使用原始的 BlocklyController 时，通过多个 BlocklyController.addBlockDefinitions（..）方法之一添加块定义。  

可以加载多个 .json 文件，但应该确保块的类型 ID 是唯一的。

### 添加工具箱引用

让系统知道你添加了新的块并不够，你还需要让用户知道这一点。工具箱就让用户知道他们能用哪些块。 Android 版的 BLockly 使用和 Web 版相同形式的 XML 文件来定义工具箱，详情请参阅「[此处](https://developers.google.cn/blockly/guides/configure/android/toolbox)」。

AbstractBlocklyActivity 使用 getToolboxContentsXmlPath（）返回的 .xml 资源文件的内容填充工具箱，reloadToolbox（）将重新加载工具箱（再次调用 getToolboxContentsXmlPath（））。

你也可以调用任何 BlocklyController.setToolboxConfiguration(..) 的方法。

通常来说，大多数块应该包含在工具箱中，但是有一些可以被忽略。这可以用于支持不推荐使用的块，教导个别概念，或隐藏当前无法使用的块。有关详细信息，请参阅「[填充工具箱](https://developers.google.cn/blockly/guides/configure/android/toolbox)」。

### 添加生成器函数

最后，为了将块转化为代码，将一种类型的块与一个JavaScript生成器函数进行配对。

请在「[使用自定义生成器](https://developers.google.cn/blockly/guides/configure/android/custom-generators)」中查看更多相关内容。



