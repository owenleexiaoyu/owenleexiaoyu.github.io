---
title: Blockly4Android 开发指南（5）使用自定义 JavaScript 生成器
date: 2017-10-22 12:45
tag: ["Blockly4Android"]
categories: 译文
thumbnail: http://image.wufazhuce.com/FprUVlnmAbwkEPOgYnufP2AsYXyP
---
### 申明

本指南翻译自 Google Blockly 官方文档。

---
 
 生成器将块转化为一段字符串文本，通常情况下是传统的编程语言代码。Android 版的 Blockly 使用和 Web 版相同的 JavaScript 生成器框架，默认情况下将块转化为 JavaScript 代码。

### 加载生成器函数

对于继承自 [AbstractBlocklyActivity](https://github.com/google/blockly-android/blob/master/blocklylib-core/src/main/java/com/google/blockly/android/AbstractBlocklyActivity.java) 的 Activity 来说，通过覆盖 AbstractBlocklyActivity.getGeneratorsJsPaths() 这个方法来得到生成器文件。Activity 必须实现这个方法，返回所需生成器的 assets 目录下的资源路径列表。这些文件和 Blockly 的标准块的 JavaScript 语言核心生成器文件一起被加载。每次进行代码生成时都会调用此方法，因此列表可以是动态的或符合上下文的。

就像块定义文件一样，可以加载多个 .js 文件。这些文件按顺序加载，因此重复的 id（参考块定义）将导致替换以前的生成器定义。

### JavaScript 块实现示例

下面这段代码是 Turtle demo 中的一个生成器示例：

```
Blockly.JavaScript['turtle_width'] = function(block) {
  // Generate JavaScript for setting the width.
  var width = Blockly.JavaScript.valueToCode(block, 'WIDTH',
      Blockly.JavaScript.ORDER_NONE) || '1';
  return 'Turtle.penWidth(' + width + ');\n';
};
```

这段代码在 [blocklydemo/assets/turtle/generators.js](https://github.com/google/blockly-android/blob/master/blocklydemo/src/main/assets/turtle/generators.js) 文件中，匹配 [blocklydemo / assets / turtle / turtle_blocks.json](https://github.com/google/blockly-android/blob/master/blocklydemo/src/main/assets/turtle/turtle_blocks.json) 中的块定义。 TurtleActivity.getGeneratorsJsPaths() 方法通过常量 [TURTLE_BLOCK_GENERATORS](https://github.com/google/blockly-android/blob/master/blocklydemo/src/main/java/com/google/blockly/android/demo/TurtleActivity.java#L52) 返回此路径。

上面这个函数为 id  为 turtle_width 的块提供代码转化，接收 “WIDTH” 域的输入生成代码字符串，设置给变量 width（如果未设置则为 '1'），并包装成 Turtle.penWidth（..）的函数调用。结果可能如下所示：

```
Turtle.penWidth(3);
Turtle.penWidth(x);
Turtle.penWidth(x / 2);
```

有关写入生成器的更多详细信息，请参阅「[生成代码](https://developers.google.cn/blockly/guides/create-custom-blocks/generating-code)」。

### 生成其他语言代码

Android 版的 Blockly 默认转化成的语言为 JavaScript。如果你想使用其他的编程语言，覆盖  AbstractBlocklyActivity.getBlockGeneratorLanguage() 方法并返回一个语言定义，其中包含核心语言文件路径和使用该语言定义生成器函数的文件路径。

```
Override
protected LanguageDefinition getBlockGeneratorLanguage() {
    return new LanguageDefinition("lua/lua_compressed.js", "Blockly.Lua");
}
```

Blockly 的主代码仓库中有几种流行语言的「[生成器](https://github.com/google/blockly/tree/master/generators)」。

### 生成器如何运行

Android 版的 Blockly 在后台服务中维护一个 WebView，以运行用 JavaScript 编写的生成器。代码在 CodeGeneratorService 类中。大多数开发人员应该只需要通过扩展 AbstractBlocklyActivity 提供的更高级别的 API，并且可以忽略这个细节。



