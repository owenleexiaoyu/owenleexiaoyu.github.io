---
{"dg-publish":true,"permalink":"/HaiShu/Flutter/Flutter 实践/🦋 Flutter Nil 库使用/","tags":["编程","Flutter"],"noteIcon":"","created":"2022-04-07","updated":"2026-07-02T10:45:34.457+08:00","dg-note-properties":{"date":"2022-04-07","tags":["编程","Flutter"]}}
---

## 背景

在 Flutter 构建 UI 界面时，常常需要使用条件判断，比如某个条件不符合时，不展示某个 Widget，这时往往不能返回一个 `null`，而必须要有个 Widget 实例，通常我们会返回一个 `SizedBox`，但 SizedBox 还是会创建 RenderObject，即使它没有绘制任何东西，还是会造成一些绘制上的损耗。

这个时候可以使用 **Nil** 库来代替，Nil 是个 Widget，它只创建了一个 Element，但没有创建 RenderObject，没有绘制上损耗。

## 使用方式

1.  在 pubspec.yaml 中添加依赖

```yaml
dependencies:
  nil: ^1.1.1
```

2.  在代码中使用

```dart
import 'package:nil/nil.dart';

return Builder(
  builder: (_) {
    if (condition) {
      return const MyWidget();
    } else {
      return nil;
    }
  },
);
```

> 注意：不能用在 Cloumn、Row 等可以包含多个子组件的 children 属性里面。