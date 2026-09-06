---
{"dg-publish":true,"permalink":"/HaiShu/Flutter/Flutter 实践/🦋 AS 中生成 Flutter 模板代码的技巧/","tags":["编程","Flutter"],"noteIcon":"","created":"2022-10-10","updated":"2026-07-02T10:37:12.168+08:00","dg-note-properties":{"date":"2022-10-10","tags":["编程","Flutter"]}}
---

在开发 Flutter 时，常常需要创建新的页面或新的 Widget，每次都重新手写总是很麻烦，这篇文章介绍一些减少手写样板代码的方式。

> 笔者使用的是 Android Studio，所以这里的技巧都是在 AS 中使用的。

## 快捷输入

Android Studio 的 Flutter 插件提供了一些在代码编辑区域的快捷输入，根据这些输入可以快速生成模板代码。最常用的快捷输入是 `stless` 和 `stful`。

![](https://s2.loli.net/2022/05/24/XxWOAgnvHcYkwKD.png)

`stless` 表示生成一个 Stateless 的 Widget。

```dart
// | 表示多行光标，可以输入类名
class | extends StatelessWidget {
  const |({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

`stful` 表示生成一个 Stateful 的 Widget。

```dart
// | 表示多行光标，可以输入类名
class | extends StatefulWidget {
  const |({Key? key}) : super(key: key);

  @override
  _|State createState() => _State();
}

class _|State extends State<> {
  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

一个小缺点：不能自动生成 import，需要额外手动 import material 库。

## AS 文件模板

Android Studio 提供了强大的代码和文件模板功能，我们可以使用它来创建 Flutter 的模板。

### 如何创建模板

在文件目录处，右键选择 New，选择 Edit File Templates...，会出现一个编辑模板的弹窗。

![](https://s2.loli.net/2022/05/24/G9NCUrJohEBxus8.png)

在弹窗中，点击下图红框中的 + 号，就可以创建一个文件模板了，只需要将模板代码输入到右侧的编辑区域即可。

![](https://s2.loli.net/2022/05/24/wsTz4QM3KA78guS.png)

### 代码模板示例

下面两个 StatelessWidget 和 StatefulWidget 的模板来自 [Flutter and Dart collection of file templates for Android Studio development](https://gist.github.com/buntagonalprism/499850a3723dbded9146270c63375088)。

**StatelessWidget 模板**

```dart
#set( $nameparts = $NAME.split("_"))
#set( $namepart = '')
#set( $classname = '')
#foreach( $namepart in $nameparts )
    #set( $classname = $classname + $namepart.substring(0, 1).toUpperCase() + $namepart.substring(1))
#end

import 'package:flutter/material.dart';

class $classname extends StatelessWidget {

    // TODO: add state variables, methods and constructor params
    $classname();
    
    @override
    Widget build(BuildContext context) {
        // TODO: add widget build method
        return null;
    }

}
```

**StatefulWidget 模板**

```dart
#set( $nameparts = $NAME.split("_"))
#set( $namepart = '')
#set( $classname = '')
#foreach( $namepart in $nameparts )
    #set( $classname = $classname + $namepart.substring(0, 1).toUpperCase() + $namepart.substring(1))
#end

import 'package:flutter/material.dart';

class $classname extends StatefulWidget {

    @override
    _${classname}State createState() => new _${classname}State();

}

class _${classname}State extends State<$classname> {
    // TODO: add state variables and methods
    
    @override
    Widget build(BuildContext context) {
        // TODO: add widget build method
        return null;
    }
}
```

这里最值得注意的是 import 语句前的的一段代码，它是把小写下划线格式的 dart 文件名，转换成大驼峰格式的 dart 类名。比如 `hello_world_widget.dart` 就会变成 `HelloWorldWidget`。

这样就可以模仿着写一个自己的模板了，比如笔者针对 Stateless 的 Scaffold 的页面制作了一个模板：

```dart
#set( $nameparts = $NAME.split("_"))
#set( $namepart = '')
#set( $classname = '')
#foreach( $namepart in $nameparts )
    #set( $classname = $classname + $namepart.substring(0, 1).toUpperCase() + $namepart.substring(1))
#end
import 'package:flutter/material.dart';

class $classname extends StatelessWidget {
  const $classname({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("$classname"),
      ),
      body: Container(),
    );
  }
}
```

### 如何使用模板

在文件目录处，右键选择 New，选择自己创建的模板（如下图），就会弹出一个弹窗，输入 dart 文件名即可生成模板代码文件。

![](https://s2.loli.net/2022/05/24/C3TuXLdbWwkVRmc.png)

## 参考文档

[How to make templates in Android Studio](https://factory.dev/blog/templates-android-studio)

[Flutter and Dart collection of file templates for Android Studio development](https://gist.github.com/buntagonalprism/499850a3723dbded9146270c63375088)