---
layout: post
title: ❤️ Flutter 制作爱心动画并部署 Github Page
date: 2022-06-03
categories: 技术
tags: ["Flutter"]
---

## 前言

又到了一年一度的 520，大家都有没有被虐狗呢？赶紧学会下面这个小动画，去赢取女神的芳心吧。

动画效果展示如下：

![](https://s2.loli.net/2022/06/03/bhMHosPVQ9dIZle.gif#crop=0&crop=0&crop=1&crop=1&id=BFtNO&originHeight=740&originWidth=1314&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

这个动画的效果和实现思路主要来自 B 站上的这个视频， [【Bilibili】【HTML+CSS】8分钟实现砰砰的爱心动画，快学起来送给喜欢的人吧！](https://www.bilibili.com/video/BV1ba4y1475n?spm_id_from=333.999.0.0)我使用 Flutter 来复刻了一下。

## 爱心动画

我们来分析一下这个效果：

1. 有 9 个竖直放置的圆角矩形，颜色是对称的，并且排列出一个心形的轮廓。
1. 每个矩形都有从没有高度展开到最终的高度再缩短到没有高度的动画，从左到右每个矩形依次执行这个动画，构成最终效果。

### 实现静态效果

首先我们不考虑动画，先将第 1 步中的静态效果实现。这一步比较简单，就直接贴代码，一些关键的地方加了注释。

```dart
// 首页
class MyHomePage extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text("爱心小动画"),
        ),
        body: Container(
          height: double.infinity,
          color: Colors.black87,
          child: LoveWidget(),
        )
    );
  }
}

// 封装整个动画组件
class LoveWidget extends StatelessWidget {
  const LoveWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 300,
      margin: EdgeInsets.only(top: 100),
      alignment: Alignment.center,
      child: Container(
        height: 200,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [ // 包含 9 个 LoveItem, 对应组成心形的 9 个圆角矩形
            LoveItem(
              color: Colors.red,
              height: 60.0,
              translateY: -30,
            ),
            LoveItem(
              color: Colors.blueAccent,
              height: 125.0,
              translateY: -60,
            ),
            LoveItem(
              color: Colors.amber,
              height: 160.0,
              translateY: -75.0,
            ),
            LoveItem(
              color: Colors.deepPurpleAccent,
              height: 180.0,
              translateY: -60.0,
            ),
            LoveItem(
              color: Colors.orange,
              height: 200.0,
              translateY: -45.0,
            ),
            LoveItem(
              color: Colors.deepPurpleAccent,
              height: 180.0,
              translateY: -60,
            ),
            LoveItem(
              color: Colors.amber,
              height: 160.0,
              translateY: -75.0,
            ),
            LoveItem(
              color: Colors.blueAccent,
              height: 125.0,
              translateY: -60,
            ),
            LoveItem(
              color: Colors.red,
              height: 60.0,
              translateY: -30,
            ),
          ],
        ),
      ),
    );
  }
}

// 抽象封装每个圆角矩形，可以指定高度、颜色、Y 轴方向的偏移（通过偏移来形成心形轮廓）
class LoveItem extends StatefulWidget {

  final double height;
  final Color color;
  final double translateY;

  const LoveItem({
    Key? key,
    required this.color,
    required this.height,
    required this.translateY,
  }) : super(key: key);

  @override
  _LoveItemState createState() => _LoveItemState();
}

class _LoveItemState extends State<LoveItem> {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: widget.height,
      width: 20,
      margin: EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: widget.color,
        borderRadius: BorderRadius.circular(10),
      ),
      transform: Matrix4.translationValues(0.0, widget.translateY, 0.0),
    );
  }
}
```

完成后效果是这样的，一个心形的轮廓已经出来了。

![](https://s2.loli.net/2022/06/03/S6YmdTEH4WDIN2s.png#crop=0&crop=0&crop=1&crop=1&height=533&id=Y6Yza&originHeight=1066&originWidth=598&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=299)

### 实现动画效果

接下来我们来考虑动画部分，因为对 Flutter 动画的知识没有特别掌握，是在做这个项目中刚开始学习的，所以使用的是最粗糙的实现，这部分代码还有很多的优化空间。大家看看实现的思路即可。

1. 在 `_LoveItemState` 中创建 `heightAnim` 和 `translateYAnim` 两个 Animation 对象，来分别对 height 和 translateY 这两个属性做动画，泛型类型都是 double。创建一个 `AnimationController` 来控制动画。

```dart
late Animation<double> heightAnim;
late Animation<double> translateYAnim;
late AnimationController controller;
```

2. 在 `initState()` 中初始化上面三个对象，`heightAnim` 和 `translateYAnim` 都是 `Tween` 对象，Tween 表示在指定范围内生成一系列连续的动画中间值，默认范围是 [0, 1]，这里我们指定范围的最小值为 0，最大值为 Widget 传入的 height 或 translateY。然后通过 `animate` 方法来指定具体的动画，这里我们使用 `CurvedAnimation` 并且自定义了一个 `Curve`。Curve 的含义是曲线，对应的是动画系统中插值器的概念，通过设置不同的「时间-动画中间值」曲线，产生不同的动画效果，我们自定义的曲线效果如图所示。初始化 AnimationController 对象设置动画的时长为 4s，并且开始重复播放。记得在 `dispose()` 中释放 controller 的资源。

```dart
  @override
  void initState() {
    super.initState();
    controller = AnimationController(vsync: this,
      duration: Duration(seconds: 4)
    );
    heightAnim = Tween(begin: 0.0, end: widget.height)
    .animate(CurvedAnimation(parent: controller, curve: CustomCurve()))
    ..addListener(() {
      setState(() {});
    });

    translateYAnim = Tween(begin: 0.0, end: widget.translateY)
        .animate(CurvedAnimation(parent: controller, curve: CustomCurve()))
      ..addListener(() {
        setState(() {});
      });

    controller.repeat();
  }

  @override
  void dispose() {
    super.dispose();
    controller.dispose();
  }

```

![](https://s2.loli.net/2022/06/03/8JSPzigGKlNLAVU.png#crop=0&crop=0&crop=1&crop=1&height=429&id=LjQw9&originHeight=858&originWidth=1200&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=600)

3. 在 `build()` 中原来使用 `widget.height` 和 `widget.translateY` 的地方替换为 `heightAnim.value` 和 `translateYAnim.value`。

```dart
  @override
  Widget build(BuildContext context) {
    return Container(
      height: heightAnim.value,
      width: 20,
      margin: EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: widget.color,
        borderRadius: BorderRadius.circular(10),
      ),
      transform: Matrix4.translationValues(0.0, transformYAnim.value, 0.0),
    );
  }
```

这样我们就可以实现如下的动画效果：

![](https://s2.loli.net/2022/06/04/k6JA2mzocTdU5CR.gif#crop=0&crop=0&crop=1&crop=1&id=Bze3f&originHeight=452&originWidth=604&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

我们再给从左到右每个 Item 依次增加一些延迟，来达到动画交替进行的效果。

1. 给 `LoveItem` 增加一个 `delay` 的属性，表示动画开始的延迟时间，可以为空，为空时表示没有延迟，立即开始动画。

```dart
class LoveItem extends StatefulWidget {

  final double height;
  final Color color;
  final double translateY;
  // 动画开始的延迟时间
  Duration? delay;
}
```

2. 在 `_LoveItemState` 的 `initState` 中，加入 delay 的逻辑，如果为空，立即开始动画，如果不为空，则延后相应的时间再开始动画。

```dart
  @override
  void initState() {
    super.initState();
    // 初始化 controller 和 animation 逻辑
    ...

    // delay 动画开始的逻辑
    if (widget.delay != null) {
      Future.delayed(widget.delay!).then((value) => {
        controller.repeat()
      });
    } else {
      controller.repeat();
    }
  }
```

3. 在 `LoveWidget` 创建 9 个 `LoveItem` 时，第一个不指定 delay 属性，立即执行动画，此后每个 Item 依次增加 200ms 的延时。

```dart
[
LoveItem(
  color: Colors.red,
  height: 60.0,
  translateY: -30,
),
LoveItem(
  color: Colors.blueAccent,
  height: 125.0,
  translateY: -60,
  delay: Duration(milliseconds: 200),
),
LoveItem(
  color: Colors.amber,
  height: 160.0,
  translateY: -75.0,
  delay: Duration(milliseconds: 400),
),
LoveItem(
  color: Colors.deepPurpleAccent,
  height: 180.0,
  translateY: -60.0,
  delay: Duration(milliseconds: 600),
),
LoveItem(
  color: Colors.orange,
  height: 200.0,
  translateY: -45.0,
  delay: Duration(milliseconds: 800),
),
LoveItem(
  color: Colors.deepPurpleAccent,
  height: 180.0,
  translateY: -60,
  delay: Duration(milliseconds: 1000),
),
LoveItem(
  color: Colors.amber,
  height: 160.0,
  translateY: -75.0,
  delay: Duration(milliseconds: 1200),
),
LoveItem(
  color: Colors.blueAccent,
  height: 125.0,
  translateY: -60,
  delay: Duration(milliseconds: 1400),
),
LoveItem(
  color: Colors.red,
  height: 60.0,
  translateY: -30,
  delay: Duration(milliseconds: 1600),
),
]
```

这样就实现了最开始所展示的效果，我们的开发部分也就结束了。

## Web 打包

既然想给女神展示，那 Web 页面无疑是最方便的一个途径，所以我希望将这个产物打包成一个 Web 页面，Flutter 优秀的跨平台特性为这个想法提供了极为便捷的支持，只需要使用以下命令

```dart
flutter build web
```

就可以构建 Web 产物了。产物可以在项目的 `build/web/` 目录下找到。

## Github Project Pages

如果要想在公网访问这个网页，我们还需要服务器来部署这个网站。家徒四壁的我并没有服务器，不过我们有白嫖的解决方案。Github 支持为每个仓库建立一个 Project Page，通常可以用来作为开源项目的首页，参考 [用Github Pages展示你的项目](https://segmentfault.com/a/1190000004639130)。我们可以利用这个功能来托管我们的网页。

首先先创建一个 Github 项目，并和本地的代码仓库关联，main 分支可以用来托管我们的代码，这里就不演示了。打开项目的 Settings，在 Pages 一栏可以配置 Project Page。我们新创建一个 gh-pages 分支，并选择这个分支作为托管网页产物的分支，点击保存即可。

![](https://s2.loli.net/2022/06/03/QtfiVJGKv985kRC.png#crop=0&crop=0&crop=1&crop=1&id=EUobp&originHeight=473&originWidth=1029&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

在本地代码中，先将上一步中 `build/web/` 目录下的 Web 网页构建产物拷贝出来，然后切到 gh-pages 分支，删除所有代码（如有），将 Web 产物粘贴到项目根目录下，然后 push 到远程仓库。稍等几分钟后就可以通过 `https://github 用户名.github.io/项目名/` 这个链接来访问这个网页。如果 `github 用户名.github.io` 已经映射到个人域名，则可以通过 `https://个人域名/项目名/` 来访问。

## Github Actions

想必聪明的读者看到上面的步骤也意识到了一个问题，如果每次发布一个新版本都需要经历这么一圈繁琐的手动操作，那开发的效率必然是大大折扣的，甚至之后这个项目都不想维护了。

这时候就要请出 Github 的另一个神器 —— Github Actions 了，这是 Github 提供的一个 CI/CD 工具链，可以通过自定义 workflow 来做一些自动化的打包、发布等工作，具体可以参考 [GitHub Actions 官方文档](https://docs.github.com/en/actions)。甚至 workflow 里面的一些任务的脚本也不需要自己去实现，Github 提供了一个 Action 任务的社区，里面已经有很多开箱即用的 Action 任务，我们需要做的就是按照自己的需求将一些任务组合在一起就可以了。

所以我们可以定义这样的一个 workflow：我们的代码部署在 main 分支，每当 main 分支上 push 了一个 commit，就开始自动化任务，**打包 web 产物，将产物拷贝并 push 到 gh-pages 分支，部署新版本的网页**。

在项目根目录下新建 `.github/workflows` 目录，并在此目录下新建 `main.yml` 文件，在这个文件里编写 CI 任务流。

我们上面自定义的 workflow 实现如下：

```yaml
name: Flutter Web Build To Github Page
# 表示当 main 分支上有 push 时触发
on:
  push:
    branches:
      - main
jobs:
  build-and-deploy:
    # 表示运行在 ubuntu 最新版本的机器上
    runs-on: ubuntu-latest
    steps:
      - name: checkout
        uses: actions/checkout@master

      - name: build
        # 表示使用 flutter-action 这个脚本来构建
        uses: subosito/flutter-action@v1
        with:
          channel: 'stable'
      # 按照下面的顺序执行打包命令
      - run: flutter pub get
      - run: flutter channel master
      - run: flutter upgrade
      - run: flutter config --enable-web
      # 构建 web 产物
      - run: flutter build web
      
      - name: deploy
        # 表示使用 actions-gh-page 这个脚本来部署
        uses: peaceiris/actions-gh-pages@v3
        with:
          # 这里直接这样写就可以，github 会自动生成用在 Actions 的 GITHUB_TOKEN
          github_token: ${{ secrets.GITHUB_TOKEN }}
          # 发布的分支
          PUBLISH_BRANCH: gh-pages
          # 发布的内容，在 build/web 目录下
          publish_dir: ./build/web
```

> 关于 actions-gh-pages 脚本中 github_token 的内容，可以参考 [The GITHUB_TOKEN in GitHub Actions: How it Works, Change Permissions, Customizations](https://dev.to/github/the-githubtoken-in-github-actions-how-it-works-change-permissions-customizations-3cgp)。


编写好这个 workflow，就可以提交到远端的 main 分支了，此时我们切到项目的 Actions Tab 下，就可以看到有 workflow 在运行了。

![](https://s2.loli.net/2022/06/03/dr6iZGTDNzKbP2X.png#crop=0&crop=0&crop=1&crop=1&id=PvYne&originHeight=411&originWidth=1233&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

上图中 `Flutter Web Build To Github Page` 这个 workflow 就是我们自定义的 workflow，同时我们也可以发现在 gh-pages 分支提交了 web 产物后，将新的产物部署到服务器上其实也是通过一个 workflow 实现的。

到这里，我们就完成了整个项目的开发和部署，可以去给女神发链接啦。

你可以在 [我的 Github](https://github.com/owenleexiaoyu/FlutterCodeLabs/tree/main/love_animation) 上找到这个小项目的完整代码。

## 参考资料

1. [【Bilibili】【HTML+CSS】8分钟实现砰砰的爱心动画，快学起来送给喜欢的人吧！](https://www.bilibili.com/video/BV1ba4y1475n?spm_id_from=333.999.0.0)
1. [用Github Pages展示你的项目](https://segmentfault.com/a/1190000004639130)
1. [GitHub Actions 官方文档](https://docs.github.com/en/actions)
1. [Flutter学习篇(七)—— flutter web ➡ 几分钟打造个人网站](https://juejin.cn/post/6844903985615224846)
