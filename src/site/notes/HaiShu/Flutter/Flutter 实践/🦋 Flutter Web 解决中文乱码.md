---
{"dg-publish":true,"permalink":"/HaiShu/Flutter/Flutter 实践/🦋 Flutter Web 解决中文乱码/","tags":["编程","Flutter"],"noteIcon":"","created":"2022-10-19","updated":"2026-07-02T10:45:17.110+08:00"}
---

## 现象

在 Flutter Web 开发中，笔者注意到一个现象：如果有中文文字，会先显示乱码，需要过一会才能正确展示，英文文字通常没有这个问题。

乱码如图所示：

![](https://s2.loli.net/2022/06/25/3PKR5cFYatTEglL.jpg)

在 Flutter Web 中有三种渲染模式：`auto`、`html` 和 `canvaskit`。点击运行按钮（运行 `flutter build web` 命令）时，选择的渲染模式是 auto，它在移动端使用 html 渲染，在 PC 端使用 canvaskit 渲染。而 canvaskit 渲染需要加载超大体积的中文字体文件，因此在页面加载过程中，中文的显示就比较慢，从而出现乱码的现象。

## canvaskit vs HTML

下面来简单介绍一下 `canvaskit` 和 `HTML` 两种渲染模式：

**canvaskit 渲染模式**：底层基于 Skia 的 WebAssembly 版本，上层使用 WebGL 进行渲染，能较好保证 UI 一致性和滚动性能。缺点是兼容性比较差（Chrome 从 57 版本才开始支持 WebAssembly）。另外，Skia 的 WebAssembly 文件大小达到 2.5M，并且 Skia 自绘引擎需要字体库支持，需要依赖超大的中文字体文件，对页面加载性能影响较大，因此目前不推荐在 Flutter Web 中直接使用 canvaskit 渲染模式。

**HTML 渲染模式**：利用 HTML + Canvas 来实现 Web 上的渲染，兼容性表现优秀。这个模式下初始包大小约为 1.2M，是 canvaskit 模式下的 1/2，并且可以通过干预编译流程来控制输出产物，优化空间大。

下面表格列出了两者的对比：

| 模式 | 加载性能 | 滚动性能 | 兼容性 |
| --- | --- | --- | --- |
| canvaskit | **加载性能差**：初始包大小为 2.5M（主要是 wasm 文件），优化空间小 | **滚动性能较好** | **兼容性差**，使用 WebAssembly + WebGL 对齐渲染能力 |
| HTML | **加载性能一般**，初始化包大小为 1.2M，优化空间大 | **滚动性能一般**，在复杂动画、图表场景下稍显吃力 | **兼容性好**，使用 HTML + Canvas 对齐渲染能力 |

## 解决乱码的方案

将渲染方案改为 html，可以解决中文乱码的问题，这里提供了两种方式：

方式一：用命令行运行，指定渲染模式。

```dart
// debug 模式（使用 chrome 浏览器）
flutter run -d chrome --web-renderer html
// debug 模式（使用 edge 浏览器）
flutter run -d edge --web-renderer html
// debug 模式（不指定浏览器）
flutter run -d web-server --web-renderer html

// release 包
flutter build web --web-renderer html
```

方式二：上面的方式对于习惯点击运行按钮的人来说不太适用。这时可以在 `web/index.html` 文件中直接指定渲染方式（见 head 内 script 标签中的代码）。

```html
<html>
  <head>
    <script text="text/javascript">
      // window.flutterWebRenderer = "canvaskit";
      window.flutterWebRenderer = "html";
    </script>
  </head>
  <body>
    <script>
      // 简略写法
      loadMainDartJs();
    </script>
  </body>
</html>
```

再次运行后，就不会有中文乱码问题了。

## 参考文档

[Flutter.cn - Web 渲染器](https://flutter.cn/docs/development/tools/web-renderers)

[FlutterWeb性能优化探索与实践 by 美团技术团队](https://mp.weixin.qq.com/s/fE11vs2qnRIHAWYv1af-gA)

[FlutterWeb开发进出坑总结](https://juejin.cn/post/7111984589086588959)