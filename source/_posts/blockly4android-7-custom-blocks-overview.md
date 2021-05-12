---
title: Blockly4Android 开发指南（7）自定义块概述
date: 2017-10-23 22:59
tag: ["Blockly4Android"]
categories: 译文
thumbnail: http://image.wufazhuce.com/Fj06el5x-lNvctTaQp_DT8mDd715
---
### 申明

本指南翻译自 Google Blockly 官方文档。

---

这篇文档针对于那些希望在 Blockly 中创建新块的开发人员。实现自定义块需要有可以编辑的 Blockly 的本地副本，熟悉 Blockly 的用法，并且对 JavaScript 有基本的了解。

![enter image description here](https://developers.google.cn/blockly/images/logo.png)

Blockly 本身带有大量预定义的块。包括数学功能到循环结构。但是，为了与外部应用程序进行对接，必须创建自定义块以形成 API。例如，创建绘图程序时，可能需要创建一个「绘制半径为 R 的圆」的块。

在大多数情况下，最简单的方法是找到一个已经存在的真正相似的块，将其复制并根据需要进行修改。以下文档适用于需要更多帮助的开发人员。

### 定义一个块

第一步是创建一个块，指定其形状，字段和连接点。使用 Blockly 开发者工具是编写此代码最简单的方式。

→ 查看关于「[Blockly 开发者工具](https://developers.google.cn/blockly/guides/create-custom-blocks/blockly-developer-tools)」的更多信息。

或者，你可以在研究 API 之后手动编写代码进行实现。

→ 查看关于「[定义块](https://developers.google.cn/blockly/guides/create-custom-blocks/define-blocks)」的更多信息。

高级块可以响应用户或其他因素而动态地改变形状。

→ 查看关于「[存取器](https://developers.google.cn/blockly/guides/create-custom-blocks/mutators)」的更多信息。

### 代码生成

第二步是创建生成器代码来将新块导出为编程语言（如JavaScript，Python，PHP，Lua 或 Dart）。

→ 查看关于「[生成代码](https://developers.google.cn/blockly/guides/create-custom-blocks/generating-code)」的更多信息。

为了生成干净正确的代码，必须注意给定语言的操作顺序。

→ 查看关于「[运算符优先级](https://developers.google.cn/blockly/guides/create-custom-blocks/operator-precedence)」的更多信息。

创建更复杂的块需要使用临时变量和效用函数。当输入被重复使用两次并且需要被缓存时尤其如此。

→ 查看关于「[缓存参数](https://developers.google.cn/blockly/guides/create-custom-blocks/caching-arguments)」的更多信息。

