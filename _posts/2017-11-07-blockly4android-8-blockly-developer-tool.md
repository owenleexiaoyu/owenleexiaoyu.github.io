---
layout: post
title: Blockly4Android 开发指南（8） Blockly 开发者工具
tags: ["Blockly4Android"]
categories: 译文
date: 2017-11-07 21:38
---
### 申明

本指南翻译自 Google Blockly 官方文档。

---

「[Blockly 开发者工具](https://blockly-demo.appspot.com/static/demos/blockfactory/index.html)」是一个自动部署 Blockly 配置过程的基于 web 的开发者工具，包括创建自定义块，构建工具箱以及配置 Web Blockly工作区。

使用该工具的流程分成三部分：

- 使用「块工厂 Block Factory」和「块导出器 Block Exporter」建自定义块。
- 使用「工作区工厂 Workspace Factory」构建工具箱和默认工作区。
- 使用工作区工厂（当前只有 Web 版具备此功能）配置工作区。

### 块工厂选项卡

「块工厂选项卡」中可帮助你为自定义块创建「[块定义](https://developers.google.cn/blockly/guides/create-custom-blocks/define-blocks)」和「[代码生成器](https://developers.google.cn/blockly/guides/create-custom-blocks/generating-code)」。在此选项卡上，您可以轻松地创建，修改和保存自定义块。

#### 定义块

本视频详细介绍了定义块的步骤。 UI 是过时的，但其重点的块功能仍然准确。

> 译者注：因为无法科学上网，所以暂无视频。

![enter image description here](https://developers.google.cn/blockly/images/update_button.png)

#### 管理库

你可以在先前保存的块之间进行切换，也可以通过单击库中的按钮创建新的空块。更改现有块的名称是快速创建具有类似定义的多个块的另一种方法。

![enter image description here](https://developers.google.cn/blockly/images/blocklib_button.png)

#### 导入导出库

定义好的块被保存到浏览器的本地存储中清除浏览器的本地存储将删除你的块。想要无限期地保存块，你必须下载你的库。你的块库被下载为可以导入的 XML 文件，以将 Block Library 设置为下载文件时的状态。请注意，导入块库将替换当前库，因此您可能希望先导出。

![enter image description here](https://developers.google.cn/blockly/images/block_manage_buttons.png)

### 块导出器选项卡

当你设计好你的块后，你需要在「块导出器选项卡」上完成导出这些块的块定义和发生器存根，以便在应用程序中使用它们。

保存在你块库中的所有块都会展示在「块选择器 Block Selector」中，点击块选择是否导出这个块。如果想选中库中所有块，可以通过「选择」→「库中所有块」来实现。如果你使用「工作区工厂选项卡」构建了工具箱或配置了工作区，也可以通过单击「选择」→「工作区工厂中所有块」来选择所使用的所有块。

#### 块选择器


![enter image description here](https://developers.google.cn/blockly/images/block_exporter_select.png)

通过导出设置，你可以选择要生成的目标语言以及是否需要所选块的块定义，生成器存根。当你选择了这些后，点击「导出」下载你的文件。

![enter image description here](https://developers.google.cn/blockly/images/block_exporter_tab.png)

> 注意：如果在 Mac 上使用保存对话框，则一次只能下载一个文件

### 工作区工厂选项卡

工作区工厂可以轻松配置工具箱和工作区中的默认块。你可以在「工具箱」和「工作区」按钮之间切换来编辑工具箱和起始工作区。

![enter image description here](https://developers.google.cn/blockly/images/ws_fac_tb_ws_buttons.png)

#### 构建工具箱

这个选项卡帮助构建工具箱的 XML 表示。你需要先熟悉「工具箱」的功能。如果你已经在此处编辑了一个工具箱的XML表示，则可以通过单击「加载到编辑」加载它。

#### 无分类的工具箱

如果你只有少数几个块并且不想分类来展示这些块，只需将它们拖拽到工作区，你就能在预览中看到你的块出现在工具箱中。

![enter image description here](https://developers.google.cn/blockly/images/workspace_fac_no_cat.png)

#### 有分类的工具箱

如果你想将你的块分类展示，请单击「+」按钮，在下拉菜单中选择一项作为新的类别。这将添加一个类别到您的类别列表，你可以选择和编辑。选择“标准类别”添加一个单独的标准块类别（逻辑，循环等）或选择「标准工具箱」添加所有标准块类别。使用箭头按钮重新排列类别。

![enter image description here](https://developers.google.cn/blockly/images/category_menu.png)

> 注意：标准类别和工具箱包含了[「Playground」](https://blockly-demo.appspot.com/static/tests/playground.html)中的所有块。这组块不适合大多数应用程序，应根据需要修剪。此外，一些块在手机上还不支持。

要更改所选类别的名称或颜色，可以使用「编辑类别」下拉菜单。将块拖动到工作区将会将其添加到选定的类别。

![enter image description here](https://developers.google.cn/blockly/images/edit_category.png)

#### 高级块

默认情况下，可以将库中的任何标准块或块添加到工具箱中。如果你在 JSON 中定义的块不在库中，则可以使用“导入自定义块”按钮导入它们。

一些块应该一起使用或包含默认值。这是使用[「块组groups」和「影子块 shadows」](https://developers.google.cn/blockly/guides/configure/web/toolbox#block_groups)来完成的。在编辑器中相互连接的任何块将作为一个块组添加到工具箱中。附加到另一个块上的块可以通过选择子块并单击「制作阴影」按钮，将这个块更改为阴影块。注意：只有不包含变量的子块可以更改为影子块。

如果工具箱中包含了【变量】或【函数】块，请在工具箱中包含“变量”或“函数”类别，以便用户充分利用该块。详细了解[「变量」或「函数」类别](https://developers.google.cn/blockly/guides/configure/web/toolbox#categories)。

#### 配置工作区（对于 Web 版 Blockly）

要配置工作区的不同部分，请转到「工作区工厂选项卡」并选择「工作区」。

**选择工作区选项**

为[配置选项](https://developers.google.cn/blockly/guides/get-started/web#configuration)设置不同的值，并在预览区域查看结果。启用「[网格](https://developers.google.cn/blockly/guides/configure/web/grid)」或[「缩放」](https://developers.google.cn/blockly/guides/configure/web/zoom)显示更多的配置选项。而且，切换到使用类别通常需要更复杂的工作空间;当你添加第一个类别时，会自动添加垃圾箱和滚动条。

![enter image description here](https://developers.google.cn/blockly/images/configure_workspace.png)

**添加预加载的块到工作区**

这是可选的，但如果要在工作空间中显示一组块，则可能需要：

- 当应用程序加载
- 当一个事件（推进一个级别，点击一个帮助按钮等）被触发。

将块拖动到编辑空间中以便在预览中的工作空间中查看它们。您可以创建组，禁用块，并将某些特定块变为阴影块。

![enter image description here](https://developers.google.cn/blockly/images/load_workspace_blocks.png)

#### 导出

工作区工厂为您提供以下导出选项：

![enter image description here](https://developers.google.cn/blockly/images/workspace_export_opt.png)

- 初学者代码：产生初学者 html 和 javascript 来注入你自定义的 Blockly 工作区。 
- 工具箱：生成 XML 表示来指定你的工具箱。 
- 工作空间块：产生可以加载到工作空间的 XML 表示。