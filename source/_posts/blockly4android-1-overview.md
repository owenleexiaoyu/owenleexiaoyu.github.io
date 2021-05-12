---
title: Blockly4Android 开发指南（1） Blockly 概述
tag: ["Blockly4Android"]
date: 2017-10-15 23:09
categories: 译文
thumbnail: http://image.wufazhuce.com/FrUWn0mdckLL1xMVOShHa_UirhDl
subtitle: Blockly 官方文档原创翻译
---

### 申明

本指南翻译自 Blockly 官方文档。

---

### Blockly 简介

Blockly 是一个向 Web 和 Android 应用程序添加可视化代码编辑器的库。Blockly 代码编辑器通过使用联锁的图形化的块来代表代码中的一些概念比如变量、逻辑表达式、循环等。它方便用户应用编程原理，而不必担心命令行中闪烁的光标和语法。

> Blockly 是面向开发者的，使用 Blockly 构建的应用是面向学生的。Blockly 是一个针对于有经验的开发者的复杂库，如果你是希望使用教育类型的应用而非开发应用，请你移步「[计算科学学习](https://www.google.com/edu/resources/computerscience/learning/)」  。

### 开发一个 Blockly 应用

从用户的视角来看，通过 Blockly 可以直观地、可视化地编写代码；从开发者的视角来看，Blockly 实际上是一个包含了用户生成的，语法正确的代码的文本框。Blockly 可以将代码块导出成多种语言，包括：

- JavaScript
- Python
- PHP
- Lua
- Dart

以下是构建 Blockly 应用的高级细分：

1. **集成Blockly编辑器**。最简单的Blockly编辑器包括一个用于存储不同类型块（block）的工具箱（toolbox）和一个用于排列块的工作区（workspace）。你了解如何在 [Web](https://developers.google.cn/blockly/guides/get-started/web) 或 [Android](https://developers.google.cn/blockly/guides/get-started/android) 的入门文档中集成 Blockly 的详情。

2. **创建你应用的块**。一旦您的应用程序中有 Blockly，您需要创建块以供用户来进行编程，然后将其添加到 Blockly 工具箱中。在[创建自定义块概述](https://developers.google.cn/blockly/guides/create-custom-blocks/overview)了解具体实现。

3. **构建应用其余部分**。就 Blockly 本身而言只是生成代码的一种方式，你应用的核心在于你自身的编程思维和能力。

### Blockly 的优势和其他选择

Blockly 是越来越多的可视化编程环境之一。决定在你的应用中使用哪一个环境是重要的一步，所以这里有一些 Blockly 最大的优点来帮助你做出决定：

- **代码可导出**。用户可以将他们基于块构建的程序提取成其他通用的编程语言，然后平顺地过渡到使用文本来编程的过程中。
- **开源**。关于 Blockly 的所有内容都是开源的，你可以在 github 上 fork 我们的项目，创建你自己的分支，添加到你自己的站点和 Android 应用中。
- **可拓展的**。你可以为你的 API 添加自定义块或者移除无用的块来适应你的需求。
- **能力强**。Blockly 并非是一个玩具。你可以通过它实现复杂的编程任务，比如在单个块中计算标准偏差。
- **国际化**。Blockly 已经被翻译成40多种语言进行推广，包括阿拉伯语和希伯来语中文字从右到左的版本。

即使有上述这些积极的因素，Blockly 也不是每个应用的必选的方案。以下是一些其他有帮助的可视化编辑器：

- **[Scratch Blocks](https://scratch.mit.edu/developers)**：由MIT的 Scratch 进行设计，并基于 Blockly 的代码基础。Scratch Blocks 提供了一个简化的编程模式，非常适合年轻的学习者。
- **[Draplet](https://github.com/PencilCode/droplet)**：Pencil Code 开发的可视化编程编辑器，它的独特功能是可以把文本代码转化成块。
- **[Snap](https://github.com/jmoenig/Snap--Build-Your-Own-Blocks)**：一种受 Scratch 启发的图形编程语言，它不是一个库，而是一个具有集成执行环境的完整应用程序。