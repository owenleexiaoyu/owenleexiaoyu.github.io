---
{"dg-publish":true,"permalink":"/HaiShu/Flutter/Flutter 实践/🥳 边学边玩，Flutter 制作 2048 游戏/","tags":["编程","Flutter"],"noteIcon":"","created":"2022-05-24","updated":"2026-07-02T10:33:23.225+08:00"}
---

## 前言

最近在学习 Flutter 的一些知识，想着独立写一个小示例来运用一下所学的东西，所以就有了这个Flutter 版本 2048 小游戏的项目。完整代码请戳 [Github](https://github.com/owenleexiaoyu/FlutterCodeLabs/blob/main/flutter_games/lib/games/2048/game_2048_page.dart)。

2048 小游戏曾经也是风靡一时，应该很多人都玩过，不过我们还是简单说一下这个游戏的机制，这里有个网页版的 [2048](https://play2048.co/)，大家可以实际体验一下。一般来说，它是一个 4 \* 4 的棋盘，共有 16 个小块，每个小块中，要么是空的，要么有一个数字，玩家可以上下左右四个方向去滑动（或者通过键盘方向键控制）。当左右滑动时，同一行上数字小块会被移到最左端或者最右端，中间没有空格，相邻的相同数字的小块合并成一个，数字是之前格子的两倍，比如 2 和 2 会合并成 4 和 空格。每次滑动后有格子移动时，就会在棋盘的空的小块里随机生成一个数字。游戏的目标是合并出 2048 这个数字。

好的，介绍完这个游戏怎么玩后，我们就可以进入正题，开始实现我们 Flutter 版本的 2048 了。

我们最终实现的效果如下，还原度是不是还可以？

![](https://s2.loli.net/2022/05/24/4esEvRHt7KhW2AO.gif)

## UI 界面

首先我们先来画一下界面。从上面的效果图我们可以看到，这个游戏界面可以分为两部分，一个是上方的标题、分数、历史最高分、重新开始游戏按钮等元素：

![](https://s2.loli.net/2022/05/24/vgZct6hJOCBnsLK.png)

一个是下方的棋盘部分，有 4 \* 4 个小格子：

![](https://s2.loli.net/2022/05/24/iPhbHBaGsekR82M.png)

如果游戏结束时，这部分上面还会盖有一个游戏结束的蒙层：

![](https://s2.loli.net/2022/05/24/q9kVh5bGfwJytMz.png)

游戏整体 UI 的代码，精简一下是这样的：

```dart
class Game2048Page extends StatefulWidget {
  @override
  _Game2048PageState createState() => _Game2048PageState();
}

class _Game2048PageState extends State<Game2048Page> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      body: Container(
        padding: EdgeInsets.only(top: 30),
        color: GameColors.bgColor1,
        child: Column(
          children: [
            Flexible(child: gameHeader()),
            Flexible(flex: 2,child: Game2048Panel())
          ],
        )
      ),
    );
  }

  // 省略了代码
  Widget gameHeader() {
    return Container();
  }
}
```

因为界面里需要展示变化的当前分数和历史最高分数，所以 `Game2048Page` 是继承自 `StatefulWidget`。布局结构整体是一个 Column 的垂直方向布局，上面是 `gameHeader()`，抽成了一个方法，里面就是标题、描述、分数等信息，下面是 `Game2048Panel` 表示棋盘，定义成了一个 Widget，Header 和 Panel 是 1 ：2 的高度比例（这个后面会提到是干嘛的）。

### Header 部分

Header 部分比较简单，就粗略介绍一下。我们需要展示当前的分数和历史最高分，所以在 `_Game2048PageState` 中定义两个变量，并在相应的 UI 元素中展示出来，分数下方还有个 New Game 的按钮，点击按钮可以重新开始游戏。这部分 UI 代码精简后是这样的，更新分数和重新开始游戏的逻辑我们后面再实现。

```dart
class _Game2048PageState extends State<Game2048Page> {

  /// 当前分数
  int currentScore = 0;
  /// 历史最高分
  int highestScore = 0;
 
  Widget gameHeader() {
  	return Row(
    	children: [
        Text("2048"),
        Column(
          children: [
            Text(currentScore.toString()),
            Text(highestScore.toString()),
            ElevatedButton(
            	onPressed: () {
                // 重新开始游戏，这里的逻辑之后再实现
              },
              child: Text("New Game"),
            )
          ]
        ),
      ]
    )
  }
}
```
### Panel 部分

Panel 部分被定义成了一个叫做 `Game2048Panel` 的 Widget，继承自 StatefulWidget，因为内部有是否游戏结束等状态。UI 部分，当游戏结束时，我们使用 Stack 布局，蒙层盖在棋盘的上方，游戏没有结束时，只有棋盘。棋盘宽高比是 1 : 1，使用 AspectRatio 组件，棋盘可以识别用户上下左右滑动的手势，所以需要 GestureDetector 组件，棋盘中 4 \* 4 的小格子，用 GridView 来实现。`Game2048Panel` 的 UI 结构大致如下图所示：

![](https://s2.loli.net/2022/05/24/Kn9HbNZjVAPT8h6.png)


这部分整体的代码精简一下（去掉了 UI 细节）是这样的：

```dart
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_games/games/2048/game_colors.dart';

class Game2048Panel extends StatefulWidget {
  final ValueChanged<int>? onScoreChanged;

  Game2048Panel({Key? key, this.onScoreChanged}) : super(key: key);

  @override
  Game2048PanelState createState() => Game2048PanelState();
}

class Game2048PanelState extends State<Game2048Panel> {
  /// 每行每列的个数
  static const int SIZE = 4;

  /// 判断是否游戏结束
  bool _isGameOver = false;

  @override
  Widget build(BuildContext context) {
    if (_isGameOver) {
      return Stack(
        children: [
          _buildGamePanel(context),
          _buildGameOverMask(context),
        ],
      );
    } else {
      return _buildGamePanel(context);
    }
  }

  Widget _buildGamePanel(BuildContext context) {
    return GestureDetector(
      child: AspectRatio(
        aspectRatio: 1.0,
        child: Container(
          child: MediaQuery.removePadding(
            /// GridView 默认顶部会有 padding，通过这个删除顶部 padding
            removeTop: true,
            context: context,
            child: GridView.builder(
              /// 禁用 GridView 的滑动
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: SIZE,
              ),
              itemCount: SIZE * SIZE,
              itemBuilder: (context, int index) {
                return _buildGameCell(0);
              },
            ),
          ),
        ),
      ),
    );
  }

  /// GridView 中的子组件，表示每个小块
  Widget _buildGameCell(int value) {
    return Text(
      value == 0 ? "" : value.toString(),
    );
  }

  /// 游戏结束时盖在 Panel 上的蒙层
  Widget _buildGameOverMask(BuildContext context) {
    return AspectRatio(
        aspectRatio: 1.0,
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text("Game Over"),
              ElevatedButton(
                  onPressed: () {
                    // 重新开始游戏
                  },
                  child: Text("ReStart"))
            ],
          ),
        ));
  }
}
```

这里有几个小细节可以说一下，一个是使用 GridView 的时候，顶部默认会有一个 Padding，这样会影响最后展示的效果，所以这里用 `MediaQuery.removePadding()` 组件包裹了 GridView，并且设置 `removeTop` 为 true，就可以去掉这部分的 padding。第二个是默认 GridView 是可以滚动的，而这里我们不希望它滚动，所以给 GridView 的 `physics` 属性设置为 `NeverScrollableScrollPhysics`，禁用了它的滚动。

到这一步，我们就可以构建出如下所示的 UI 界面：

![](https://s2.loli.net/2022/05/24/4tYUv5A8X2unrGi.png)

## 游戏逻辑

构建好基础的 UI，我们就可以开始一步步编写逻辑实现了。
### 数据源及游戏初始化

首先我们先来构造这个游戏的数据源，4 \* 4 的棋盘，棋盘中每个格子要么是空的，要么是数字，我们很容易能想到用一个 int 的二维数组来表示它，空格子我们用 0 来表示。也就是下面代码里的 `_gameMap`。

```dart
// Game2048Panel
// 数据源，类型是 List<List<int>>
List _gameMap = List.generate(SIZE, (_) => List<int>.generate(SIZE, (_) => 0));
```

在小格子 Cell 中，我们通过将 GridView 的 index 转化为二维数组的坐标，从 \_gameMap 中取出数据显示在 Cell 中。

```dart
GridView.builder(
  itemCount: SIZE * SIZE,
  itemBuilder: (context, int index) {
    int indexI = index ~/ SIZE;
    int indexJ = index % SIZE;
    return _buildGameCell(_gameMap[indexI][indexJ]);
  },
),
```

```dart
Widget _buildGameCell(int value) {
  return Container(
    decoration: BoxDecoration(
      color: GameColors.mapValueToColor(value),  // 数值和背景颜色有个映射
      borderRadius: BorderRadius.circular(5),
    ),
    child: Center(
      child: Text(
        value == 0 ? "" : value.toString(), // 如果数字是0，展示空字符串，效果上就是空格，否则展示数字
      ),
    ),
  );
}
```

这样我们数据的展示就完成了。因为一开始 *gameMap 中都是 0，所以这步完成后，棋盘里都是空格，我们可以 Mock 一些数据，看看实际显示效果。这里我们写一个在* gameMap 中随机坐标生成一个非 0 数字的函数 `_randomNewCellData`：

```dart
/// 在 gameMap 里随机位置放置指定的数字，
/// 需要刷新界面时，需要将这个函数放在 setState 里
void _randomNewCellData(int data) {
  /// 在产生新的数字（块）时，
  /// 需要先判断下是否map中所有的数字都不为0
  /// 如果都不为0，就直接return，不产生新数字
  if (isGameMapAllNotZero()) {
    debugPrint("gameMap中都不是0，不能生成");
    return;
  }
  while (true) {
    Random random = Random();
    int randomI = random.nextInt(SIZE);
    int randomJ = random.nextInt(SIZE);
    if (_gameMap[randomI][randomJ] == 0) {
      _gameMap[randomI][randomJ] = data;
      break;
    }
  }
}

/// 判断Map中的数字是否都不为0
bool isGameMapAllNotZero() {
  bool isAllNotZero = true;
  for (int i = 0; i < SIZE; i++) {
    for (int j = 0; j < SIZE; j++) {
      if (_gameMap[i][j] == 0) {
        isAllNotZero = false;
        break;
      }
    }
  }
  return isAllNotZero;
}
```

这是一个简单的随机算法，判断 \_gameMap 中的数是否都不为 0，如果都不为 0，则返回；否则就随机生成一组行列坐标，如果这个坐标上的数是 0，就给这个坐标赋一个非 0 值，如果这个坐标上的数不是 0，则继续随机生成一组坐标，直到生成坐标上的数是 0 为止。

然后在 `initState` 调用这个方法，就可以初始化游戏数据啦，我们默认随机生成一个 2 和一个 4。

```dart
@override
void initState() {
  super.initState();
  _initGameMap();
}

/// 初始化数据
void _initGameMap() {
  /// 执行两次随机
  _randomNewCellData(2);
  _randomNewCellData(4);
}
```

现在运行程序，就可以看到随机放置数字小块的效果啦：

![](https://s2.loli.net/2022/05/24/iPhbHBaGsekR82M.png)
### 滑动手势识别

接下来非常重要的一步就是要识别用户上下左右滑动的手势，因为对 `GestureDetector` 的 API 不了解，不确定是否有更简单的做法，我这里的实现方式和 Android 的手势识别比较接近，在 `onPanDown` 时，记录下手指的下落坐标，在 `onPanUpdate` 里，记录下当前的坐标。为了过滤掉斜向的滑动，这里定义了两个阈值：**主方向的最小滑动距离** 和 **交叉方向上的最大滑动距离**。如果当前坐标 - 下落坐标在水平方向的距离 > 主方向最小滑动距离，并且当前坐标 - 下落坐标在垂直方向的距离 < 交叉方向最大滑动距离，就表示是水平方向的滑动。反过来则是垂直方向的滑动，再比较在主轴方向上当前坐标和下落坐标的大小，可以进一步判断出是向左滑动还是向右滑动（向上滑动还是向下滑动）。

```dart
/// 当上下滑动时，左右方向的偏移应该小于这个阈值，左右滑动亦然
double _crossAxisMaxLimit = 20.0;

/// 当上下滑动时，上下方向的偏移应该大于这个阈值，左右滑动亦然
double _mainAxisMinLimit = 60.0;

/// onPanUpdate 会回调多次，只需要第一次有效的就可以了，
/// 在 onPanDown 时设为 true，第一次有效滑动后，设为 false
bool _firstValidPan = true;

GestureDetector(
  onPanDown: (DragDownDetails details) {
    lastPosition = details.globalPosition;
    _firstValidPan = true;
  },
  onPanUpdate: (DragUpdateDetails details) {
    final currentPosition = details.globalPosition;

    /// 首先区分是垂直方向还是水平方向滑动
    if ((currentPosition.dx - lastPosition.dx).abs() > _mainAxisMinLimit &&
        (currentPosition.dy - lastPosition.dy).abs() < _crossAxisMaxLimit) {
      // 水平方向滑动
      if (_firstValidPan) {
        debugPrint("水平方向滑动");
        /// 然后区分是向左滑还是向右滑
        if (currentPosition.dx - lastPosition.dx > 0) {
          // 向右滑
          debugPrint("向右滑");
        } else {
          // 向左滑
          debugPrint("向左滑");
        }
        _firstValidPan = false;
      }
    } else if ((currentPosition.dy - lastPosition.dy).abs() > _mainAxisMinLimit &&
        (currentPosition.dx - lastPosition.dx).abs() < _crossAxisMaxLimit) {
      // 垂直方向滑动
      if (_firstValidPan) {
        debugPrint("垂直方向滑动");
        /// 然后区分是向上滑还是向下滑
        if (currentPosition.dy - lastPosition.dy > 0) {
          // 向下滑
          debugPrint("向下滑");
        } else {
          // 向上滑
          debugPrint("向上滑");
        }
        _firstValidPan = false;
      }
    }
  },
}
```

这段代码里还有一个变量 `_firstValidPan` 需要解释下，因为 `onPanUpdate` 在手指滑动过程中会一直回调，所以当我们识别到一个有效的滑动（判断出明确的方向）时，后续的 onPanUpdate 就不需要处理了，需要在 onPanDown 中重置这个变量。

现在运行代码，我们在棋盘里用手指上下左右滑动，可以打印出正确的手势滑动方向。
### 数字块的移动与合并

完成手势识别后，接下来就是数字块的移动，并且合并相同块（中间没有其他数字的阻隔）的计算逻辑了。

```dart
GestureDetector(
  onPanUpdate: (DragUpdateDetails details) {
    /// 首先区分是垂直方向还是水平方向滑动
    if (horizontalSwipe) {
      // 水平方向滑动
      if (_firstValidPan) {
        debugPrint("水平方向滑动");
        /// 然后区分是向左滑还是向右滑
        if (currentPosition.dx - lastPosition.dx < 0) {
          // 向左滑
          debugPrint("向左滑");
          setState(() {
            /// 合并相同的块，移动非0的块到最左边
            _joinGameMapDataToLeft();
            if (!_noMoveInSwipe) {
              _randomNewCellData(2);
            }
            _checkGameState();
          });
        }
        _firstValidPan = false;
      }
    } else {
      /// 省略部分代码
    }
  },
}
```

上面的代码中，判断出向左滑动后，调用了 `_joinGameMapDataToLeft` 方法，这个方法中就是合并和移动的逻辑，同样的，其他方向还有 `_joinGameMapDataToRight`、`_joinGameMapDataToTop`、`_joinGameMapDataToBottom` 的方法。

这里我的合并和移动算法比较挫，肯定有更简单，复杂度更低的算法来实现。以向左滑动为例，来看看合并和移动的算法，其他方向同理：

```dart
void _joinGameMapDataToLeft() {
  /// 开始改变map中的数据时，先将noMoveInSwipe置为true
  _noMoveInSwipe = true;
  /// 每一行都要计算，所以用 for 循环遍历每一行
  for (int i = 0; i < SIZE; i++) {
    int j1 = 0;
    while (j1 < SIZE - 1) {
      if (_gameMap[i][j1] == 0) {
        j1++;
        continue;
      }
      for (int j2 = j1 + 1; j2 < SIZE; j2++) {
        if (_gameMap[i][j2] == 0) {
          continue;
        } else if (_gameMap[i][j2] != _gameMap[i][j1]) {
          break;
        } else {
          _gameMap[i][j1] = 2 * _gameMap[i][j1];
          _gameMap[i][j2] = 0;

          /// 在这里有两个块的合并，增加分数
          _currentScore += (_gameMap[i][j1] as int);

          /// 把分数回调给外界
          widget.onScoreChanged?.call(_currentScore);

          /// 这行要写在记录score之后，不然gameMap[i][j1]实际是gameMap[i][j2]，就是0了
          j1 = j2;

          /// 有块的合并，说明有移动
          _noMoveInSwipe = false;
        }
      }
      j1++;
    }
    int notZeroCount = 0;
    for (int k = 0; k < SIZE; k++) {
      if (_gameMap[i][k] != 0) {
        if (k != notZeroCount) {
          _gameMap[i][notZeroCount] = _gameMap[i][k];
          _gameMap[i][k] = 0;

          /// 有非0数字和0交换，说明有移动
          _noMoveInSwipe = false;
        }
        notZeroCount++;
      }
    }
  }
}
```

合并相同的非 0 数字：每一行都需要计算，所以用了一个 for 循环。在一行的计算中，定义了 j1、j2 两个下标，指向要比较数值相同的前后两个块，j1  的范围是 \[0, SIZE -1)，如果 j1 所指向的块是0，则跳到下一个块。j2 的范围是 \[j1 + 1, SIZE)，如果 j2 所指向的块是 0，则跳到下一个块；如果不是 0 但是不等于 j1 所指的块，则说明 j1 块不和后面的块数字相等，无法合并，直接跳出内层循环，让 j1 移到下一个；否则就是 j2 所在的块和 j1 所在的块数字相同，这时候就把这两个块合并，j1 所在块数字变为原来的两倍，j2 所在块变为 0，并且让 j1 直接移到 j2 处，下一次的外层循环就从 j2 + 1 处继续。

移动非 0 数字到最左侧：定义了一个变量 `notZeroCount`，**代表遍历到的非 0 数字的个数，其实它也表示第 n（n 从 0 开始） 个非 0 数字应该放置的下标**。游标 k 范围是 \[0, SIZE)，依次递增，如果遇到非 0 数字，需要比较 k 和 notZeroCount，如果两者相同，说明这个非 0 数字已经放在了正确的位置，不需要移动了；如果不相等，说明之前遍历过数字为 0 的块，这时候这个非 0 数字应该被放在下标为 notZeroCount 的位置，而不是下标为 k 的位置，需要将两个位置的数字交换。notZeroCount 在遇到非 0 数字的块后会自增。

下面的图片演示了一个具体的示例，读者可以对照着代码进行理解。

![](https://s2.loli.net/2022/05/24/so51dluAHbLTqGi.png)

完成这一步，棋盘中的小格子就可以在棋盘中上下左右移动了。到这一步运行起来的效果如下：

![](https://s2.loli.net/2022/05/24/vkFHOe519q7SzQp.gif)

不过我们还没有新的数字块产生，所以下一步自然是在滑动后产生新的数字块。

### 产生新的数字块

如果一次滑动，有块的移动或合并，则在移动或合并完后，需要在空的块里随机再产生一个数字，如果既没有块的移动也没有块的合并，则不会产生一个新的数字块。首先定义了一个 bool 类型的变量 `_noMoveInSwipe`，代表一次滑动中有没有块的移动，块的移动包含两种情况：块的合并和非 0 块移到最左边。回到上面的代码，在 `_joinGameMapDataToLeft` 中，每次调用该方法时，都会将 *noMoveInSwipe 置为 true，在块的合并时和块的移动交换时，给这个变量设为 false。然后在* `*_joinGameMapDataToLeft*` *之后判断如果* noMoveInSwipe 为 false，则调用 `_randomNewCellData(2)` 随机生成一个数字为 2 的块。

```plain
/// 这一次手势滑动，是不是没有块移动，如果没有块移动，就不能产生新的块
bool _noMoveInSwipe = true;
```

![](https://s2.loli.net/2022/05/24/gNhYiRUEc6oFKlP.png)

![](https://s2.loli.net/2022/05/24/gYMQibdNkF78wHc.png)

![](https://s2.loli.net/2022/05/24/PmhKJIYwT5QXu2k.png)

这步完成后，其实 2048 的主体功能就完成了，我们已经可以开始不断滑动来合并数字块了。演示效果如下：

![](https://s2.loli.net/2022/05/24/qvYtwE6oR17C4j3.gif)
### 更新分数

游戏没有分数就少了很多乐趣，所以我们需要给它加上记分机制。当有两个块合并时，我们需要更新当前的分数，在当前分数上加上合并后的数值。因为这个分数的数字并不是显示在 Game2048Panel 里面，而是显示在 Game2048Page 的 Header 部分，所以我们需要通过一种方式将最新的分数传递给 Game2048Page。这里我们给 Game2048Panel 添加一个 `onScoreChanged` 的回调，可以在数字块合并后把变化后的分数传给父容器。

```dart
class Game2048PanelTest extends StatefulWidget {
  /// 分数变化的回调
  final ValueChanged<int>? onScoreChanged;

  Game2048PanelTest({Key? key, this.onScoreChanged}) : super(key: key);
}
```

  

![](https://s2.loli.net/2022/05/24/dA2nBWZxi5fmLXk.png)

在父容器 Game2048Page 中，首先声明了两个状态变量，`currentScore` 和 `highestScore`，另外在 Game2048Panel 的 onScoreChanged 回调里，给 currentScore 赋值，并判断是否大于 highestScore，如果大于，将 currentScore 的值赋给 highestScore 并持久化到磁盘中，接着刷新界面。

```dart
/// 当前分数
int currentScore = 0;
/// 历史最高分
int highestScore = 0;

Column(
  children: [
    Flexible(child: gameHeader()),
    Flexible(flex: 2,child: Game2048Panel(
    	key: _gamePanelKey,
      onScoreChanged: (score) {
        setState(() {
          currentScore = score;
          if (currentScore > highestScore) {
            highestScore = currentScore;
            storeHighestScoreToSp();
          }
        });
      },
      )
    )
  ],
)
```

![](https://s2.loli.net/2022/05/24/4esEvRHt7KhW2AO.gif)

保存历史最高分数用到了 `shared_preferences` 这个插件来保存数据，它可以保存 Key-Value 格式的数据，这里不具体展开，看看代码的实现：

```dart
Future<SharedPreferences> _spFuture = SharedPreferences.getInstance();

void readHighestScoreFromSp() async {
  final SharedPreferences sp = await _spFuture;
  setState(() {
    highestScore = sp.getInt(GAME_2048_HIGHEST_SCORE) ?? 0;
  });
}
```

在进入游戏界面时，需要从 SP 中将历史最高分数读取出来，展示在 Header 里，在 `initState` 方法中调用 `readHighestScoreFromSp` 方法。

```dart
@override
void initState() {
  super.initState();
  readHighestScoreFromSp();
}

void readHighestScoreFromSp() async {
  final SharedPreferences sp = await _spFuture;
  setState(() {
    highestScore = sp.getInt(GAME_2048_HIGHEST_SCORE) ?? 0;
  });
}
```

### 判断游戏结束

每次手指滑动，移动 / 合并了块，产生了新的数字块后，我们都需要检查一下游戏是否结束。写一个 `_checkGameState` 的方法，当 \_gameMap 中所有的数字都不为  0 时，开始检查横纵方向上是否存在可以合并的数字，如果都没有，则代表游戏结束，如果有可以合并的，则游戏没有结束。

```dart
void _checkGameState() {
  if (!isGameMapAllNotZero()) {
    return;
  }
  /// 如果 Map 中数字都不为0，则需要判断横纵方向上是否存在可以合并的数字，
  /// 如果有，则游戏不算结束，都没有的话，游戏结束
  bool canMerge = false;
  for (int i = 0; i< SIZE; i++) {
    for (int j = 0; j< SIZE  - 1; j++) {
      if (_gameMap[i][j] == _gameMap[i][j + 1]) {
        canMerge = true;
        break;
      }
    }
    if (canMerge) {
      break;
    }
  }
  for (int j = 0; j < SIZE; j++) {
    for (int i = 0; i < SIZE  - 1; i++) {
      if (_gameMap[i][j] == _gameMap[i + 1][j]) {
        canMerge = true;
        break;
      }
    }
    if (canMerge) {
      break;
    }
  }
  // 横纵遍历完后，如果没有可以合并的，游戏结束
  if (!canMerge) {
    setState(() {
      _isGameOver = true;
    });
  }
}
```

![](https://s2.loli.net/2022/05/24/QdqHaJomtVrw9Ej.jpg)

### 重新开始游戏

不要忘了我们还有两个地方可以触发重新开始游戏，一个是 Header 部分的 New Game 按钮，一个是游戏结束蒙层上的 Restart 按纽。实现重新开始游戏的逻辑很简单，我们只需要将 `_gameMap` 的数据全部清空，初始化一次游戏数据，并且重置一些状态，比如当前的分数和是否游戏结束的状态，然后刷新界面就可以了。

```dart
void reStartGame() {
  setState(() {
    _resetGameMap();
    _initGameMap();
    // 清空分数
    _currentScore = 0;
    // 将分数回调给父容器
    widget.onScoreChanged?.call(_currentScore);
    // 重置游戏状态，游戏没有结束，不会出现蒙层
    _isGameOver = false;
  });
}

/// 清空游戏数据源，全部置为 0
void _resetGameMap() {
  for (int i = 0; i < SIZE; i++) {
    for (int j = 0; j < SIZE; j++) {
      _gameMap[i][j] = 0;
    }
  }
}
```

Restart 按钮是在 Game2048PanelState 内部，所以在点击事件中直接调用 `reStartGame` 方法即可，但 New Game 按钮是在 Game2048Page 的 Header 部分，不在 Game2018PanelState 内部，那该怎么调用到这个方法呢？答案是 Global Key，我们在 Game2048Page 中声明一个范型为 Game2018PanelState 的 GlobalKey，并将这个 GlobalKey 传给 Game2048Panel 的 key 属性，这样就可以在 Header 的按钮中获取到 Game2018PanelState 的实例并且调用它的公开方法了。

> 这里要注意，Game2018PanelState 现在是可以被外界访问的了，所以不能暴露的变量和方法都要声明成私有的，变量名和方法明前面加上 `_`。

```dart
/// 用于获取 Game2048PanelState 实例，以便可以调用restartGame方法
GlobalKey _gamePanelKey = GlobalKey<Game2048PanelTestState>();

/// New Game 按钮
InkWell(
  onTap: () {
    (_gamePanelKey.currentState as Game2048PanelState).reStartGame();
  },
  child: Text("NEW GAME"),
),
```

### 最后一点细节：横竖屏适配

最后的最后，我们来完善一个小细节，就是横竖屏的适配。前面提到，Header 部分和 Panel 的比例是 1 ：2，为什么要定一个比例呢，就是为了适配横竖屏的情况。Flutter 中，可以通过 `OrientationBuilder` 判断出是横屏还是竖屏。在竖屏情况下，我们使用 Column 组件，Header 在上方占三分之一高度，Panel 在下方占三分之二的高度。横屏情况下，使用 Row 组件，Header 在左边占三分之一宽度，Panel 在右方占三分之二的宽度。这样一个简单的横竖屏适配就完成了。

```dart
Container(
  padding: EdgeInsets.only(top: 30),
  color: GameColors.bgColor1,
  child: OrientationBuilder(
    builder: (context, orientation) {
      if (orientation == Orientation.portrait) {  // 竖屏
        return Column(
          children: [
            Flexible(child: gameHeader()),
            Flexible(flex: 2,child: gamePanel)
          ],
        );
      } else {  // 横屏
        return Row(
          children: [
            Flexible(child: gameHeader()),
            Flexible(flex: 2,child: gamePanel)
          ],
        );
      }
    },
  ),
),
```

横屏下效果如图：

![](https://s2.loli.net/2022/05/24/zsDxwH4CLFjSJl7.jpg)

## 结语

到这里这个 Flutter 版的 2048 小游戏就制作完成啦，边学边玩也是很有趣的体验。简单总结下这个小项目涉及的一些小知识点：
-   AspectRatio、OrientationBuilder、GridView 等 Widget 的使用
-   Flutter 的手势识别
-   跨组件传递状态和调用其他组件的公开方法
祝大家学习愉快。