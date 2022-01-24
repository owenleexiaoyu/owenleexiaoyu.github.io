---
layout: post
title: Blockly4Android 开发指南（4）工具箱
date: 2017-10-19 22:26
tag: ["Blockly4Android"]
categories: 译文
cover: https://s2.loli.net/2022/01/24/SnedkTaZ3U5GC81.jpg
subtitle: Blockly 官方文档中的 Toolbox
---
### 申明

本指南翻译自 Google Blockly 官方文档。

---

工具箱是用户可以创建新块的侧面菜单。使用 XML 代码来指定工具箱的结构，它可能是节点树或字符串。如果您不喜欢手动输入 XML，我们建议你查看「[Blockly 开发者工具](https://developers.google.cn/blockly/guides/create-custom-blocks/blockly-developer-tools)」。使用「Blockly 开发者工具」，您可以构建一个工具箱，并使用可视化界面自动生成其工具箱 XML 代码。这个 XML 文件放在assets 目录下，其路径在 BlocklyController 构造时传递给 BlocklyController。如果您的 Activity 继承自 [AbstractBlocklyActivity](https://github.com/google/blockly-android/blob/master/blocklylib-core/src/main/java/com/google/blockly/android/AbstractBlocklyActivity.java)，则可以使用 getToolboxContentsXmlPath（）方法返回的 XML 文件路径自动完成此操作：

```
Override
protected String getToolboxContentsXmlPath() {
    return "default/toolbox.xml";
}
```

下面的代码是使用节点树的一个最简实例：

```
<toolbox>
  <block type="controls_if"></block>
  <block type="controls_whileUntil"></block>
</toolbox>
```

这个工具箱将加载如下的块（block）：

![enter image description here](https://developers.google.cn/blockly/images/toolbox-minimal-android.png)

如果只有少量的块，那么它们可能没有任何类别显示（如上面的最简实例所示）。在这种简单模式下，所有可用的块都显示在工具箱中。

### 分类

工具箱中块可以划分成不同的类别进行组织，下面的代码中有两个类别（“控制”和“逻辑”），每个类别包含三个块：

```
<toolbox>
  <category name="Control">
    <block type="controls_if"></block>
    <block type="controls_whileUntil"></block>
    <block type="controls_for"></block>
  </category>
  <category name="Logic">
    <block type="logic_compare"></block>
    <block type="logic_operation"></block>
    <block type="logic_boolean"></block>
  </category>
</toolbox>
```

以下是所产生的工具箱，点击“逻辑”类别，便可以在弹出的窗口中看到这个类别下的三个“逻辑块”：

![enter image description here](https://developers.google.cn/blockly/images/toolbox-categories-android.png)

可以使用 colour 属性来为一个类别的所有块分配一个颜色。这里需注意 colour 是英国的拼写。颜色值是定义色调的数字（0-360）。

```
<toolbox>
  <category name="Logic" colour="210">...</category>
  <category name="Loops" colour="120">...</category>
  <category name="Math" colour="230">...</category>
  <category name="Colour" colour="20">...</category>
</toolbox>
```

指定的颜色成为这个类别下的块的背景色，效果如下：

![enter image description here](https://developers.google.cn/blockly/images/toolbox-colours-android.png)

> 标签着色正在开发，敬请期待。

### 块组（Block Groups）

XML 可能包含自定义块或块组。这里有四个块：

1. 一个简单的 **logic_boolean** 的块：
![enter image description here](https://developers.google.cn/blockly/images/true.png)

2. 一个已修改为显示数字 42 而不是默认值 0 的 **math_number** 块：
![enter image description here](https://developers.google.cn/blockly/images/42.png)

3. 一个具有三个math_number块连接到它的controls_for块：
![enter image description here](https://developers.google.cn/blockly/images/count-with.png)

4. 一个具有两个 **math_number** 影子块连接到它 **math_arithmetic** 块：
![enter image description here](https://developers.google.cn/blockly/images/1plus1.png)

以下是生成这四个块的 XML 代码：

```
<toolbox>
  <block type="logic_boolean"></block>

  <block type="math_number">
    <field name="NUM">42</field>
  </block>

  <block type="controls_for">
    <value name="FROM">
      <block type="math_number">
        <field name="NUM">1</field>
      </block>
    </value>
    <value name="TO">
      <block type="math_number">
        <field name="NUM">10</field>
      </block>
    </value>
    <value name="BY">
      <block type="math_number">
        <field name="NUM">1</field>
      </block>
    </value>
  </block>

  <block type="math_arithmetic">
    <field name="OP">ADD</field>
    <value name="A">
      <shadow type="math_number">
        <field name="NUM">1</field>
      </shadow>
    </value>
    <value name="B">
      <shadow type="math_number">
        <field name="NUM">1</field>
      </shadow>
    </value>
  </block>
</toolbox>
```

这些自定义块或组的 XML 与 Blockly 的 XML 保存格式相同。因此，为这些块构建 XML 的最简单的方法是使用「[Code application](https://blockly-demo.appspot.com/static/demos/code/index.html)」来构建块，然后切换到 XML 选项卡并复制结果。 x，y 和 id 属性被工具箱忽略，可能被删除。

影子块是执行若干功能的占位符块：

- 它们表示父级块的默认值。
- 它们允许用户直接输入值，而不需要使用数字或字符串块。
- 与常规块不同，如果用户在影子块的位置上放置块，则影子块将被替换。
- 他们提示用户预期输入的值的类型。

阴影块不能直接用Code应用程序构建。相反，可以使用常规块，然后将 XML 中的 <block ...> 和 </ block> 更改为 <shadow ...> 和 </ shadow>。

### 更改工具箱

基于 AbstractBlocklyActivity 的应用程序可以随时通过调用 this.reloadToolbox（）来更改工具箱中可用的块。这将再次调用 getToolboxContentsXmlPath（）方法，返回一个新的值。