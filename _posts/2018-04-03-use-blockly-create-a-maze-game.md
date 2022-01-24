---
layout: post
title: 利用 Blockly 实现游戏场景——小蝌蚪找妈妈
tag: ["Blockly4Android"]
categories: 技术
cover: https://s2.loli.net/2022/01/24/QMcWyzV9GOHLa3l.jpg
date: 2018-04-03 20:23
author: 啸宇
---

#### 前言

在项目的第二模块，是为小孩子创建一个游戏场景，让小孩子通过拖拽 Blockly 块来玩游戏，在玩游戏中锻炼逻辑思维能力。通过前期的研究，我们发现迷宫类的游戏场景特别适合 Blockly，因为可以通过 Blockly 块来控制迷宫中角色的前后移动，左右旋转等效果。在 Blockly 官网给出的游戏例子中，就有迷宫的场景。

![img2.png](https://i.loli.net/2019/08/29/LI9dYiTRsPcOmQe.jpg)

因此在这里模仿它，实现一个我们自己的迷宫游戏，游戏背景为我们中国儿童耳熟能详的小蝌蚪找妈妈的故事。

![img3.png](https://i.loli.net/2019/08/29/MZsPkABpl1bmWNx.jpg)

#### 对 Turtle 案例的研究

在介绍游戏的实现方法之前，先来简单说说我们是如何针对这个问题找到解决方法的。

在官方给的 demo 中，有一个 Turtle 画图的例子，使用 Blockly 的块控制画笔，在一个 HTML 的画布上进行线条、图案的绘制。这其实也是一个游戏场景，通过研究这个例子，我们了解到如下几点：

1. 真正实现画图的方法、函数等全部封装在一个名为 turtle.js 的文件中，查看这个文件的源码可以看到画图的原理。
2. 需要一个 HTML 页面来展示画图效果，这个 HTML 内就加载了 turtle.js 这个脚本，这个 HTML 页面放在 WebView 中进行展示。
3. 一个 Blockly 块在生成器函数的返回值是 turtle.js 中这个动作所对应的函数调用。比如一个「前进」块，对应着对 turtle.js 中 moveForward() 这个函数一次调用。
4. 在点击运行 Blockly 的块时，在 Activity 中的回调函数内，将工作区的块转化成代码，封装成一个 Turtle.execute() 方法的参数。这个方法利用 JS 内置的 eval() 函数来依次执行转化后的代码， 然后让 WebView 去加载这个 JS 函数，就可以实现使用 Blockly 块来操作画笔的功能。

在得到以上这些信息之后，其实整体的实现思路就已经出来了。第一步，用 HTML 结合 CSS、JavaScript 来写游戏场景，将一些控制函数导出成 API，供 Blockly 块去调用。第二步，制作和这个场景契合的 Blockly 块，将块与写好的控制函数进行匹配。

#### 游戏场景实现

上面说的两步中，使用 HTML 配合 JS 来实现一个游戏其实是最难的一部分。因为需要用到 HTML5、CSS3、JavaScript 等综合知识。接下来针对这个游戏场景来讲讲具体的实现思路。

##### 1. 准备游戏数据及数据的初始化

我们按照面向对象的编程思路，将整个游戏逻辑整合到一个类 Tadpole（蝌蚪）中。首先，我们需要放置游戏数据的容器，在这里，我使用了一个 10*10 的二维数组，数组中的每一个元素对应迷宫中的一格，这个二维数组我们称之为**数据矩阵**。矩阵中的元素有以下几种值，分别对应着不同的含义。

```
//在代码中用到的一些常量
const TYPE_BLOCK = -1;   //-1表示不能走的墙壁
const TYPE_PATH = 0;     //0表示可以走的通道
const TYPE_CURRENT = 1;  //1表示角色当前位置
const TYPE_END = 2;      //2表示角色的目的地
const TYPE_SUCCESS = 3;  //3表示角色到达了目的地
```

我们默认的游戏矩阵是这样的：

```
//游戏数据矩阵，初始值都为-1，在init方法中接收外界的赋值
var gameData = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
];
```

这样的一个数据矩阵经过 CSS 渲染后，就是下图所示的样子。荷叶表示障碍物，小蝌蚪不能通过这个障碍物。

![img4.png](https://i.loli.net/2019/08/29/yfevDpJbVP7I1kY.jpg)

如果我们将矩阵中一些元素的值改变，比如将 -1 修改为 1，就表示这个迷宫中出现了一个蝌蚪的角色，比如将 -1 改为 0，就表示这个位置的障碍物消失，成为小蝌蚪可以通过的通道，再比如将 -1 改为 2，就表示迷宫中出现了一只青蛙，它就是小蝌蚪要去的目的地。

```
[
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1,  1,  0,  0,  2, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
]
```

例如上面这个矩阵，经过渲染后就是下面这个样子，是不是已经有了一个迷宫的雏形？

![img5.png](https://i.loli.net/2019/08/29/ctnfLCW37NFj6gS.jpg)

那么如何将数据矩阵渲染成我们想要的游戏界面呢，接着往下看。

##### 2. 初始化游戏界面

对于这样一个游戏，我们项目文件结构如下：

![img6.png](https://i.loli.net/2019/08/29/r3qBfdFIhgtx5UQ.jpg)

css 目录下放置样式表文件，img 目录下放置所需的图片资源，js 目录下放置 JavaScript 脚本文件，html 目录下放置 HTML 网页。

**HTML页面**

首先我们在 html 目录下新建一个 index.html 的文件，在 css 目录下新建 style.css 的样式表，在 js 目录下新建 tadpole.js 脚本。在 index.html 中引入样式表和脚本。

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>小蝌蚪找妈妈</title>
    <link rel="stylesheet" type="text/css" href="../css/style.css">
</head>
<body class="bg">
    <div class="game" id="game"></div>
    <script type="text/javascript" src="../js/tadpole.js"></script>
    <script type="text/javascript" src="../js/level1_script.js"></script>
</body>
</html>
```

在 HTML 页面中我们定义一个 div 标签，id 为 game，class 也为 game，这个 div 就是我们游戏的背景容器，称为**GameDiv**。后面我们将在代码中动态地向这个 div 中填充100个小 div，与数据矩阵中元素一一对应。


**CSS样式**

下面来写一下 style.css 文件，对我们要用到的 div 添加一些样式。

```
.bg{
    background-image: url(../img/water_bg.jpg);
    background-size: 1000px 1000px;
}

.game {
    background-color: transparent;
    position: absolute;
}

/*
block : 墙壁，不能走的区域
start : 起点
end :   终点
path :  通道，可以走的区域
current_*: 小蝌蚪当前的位置,up表示方向朝上，right表示方向朝右，down表示方向朝下，left表示方向朝左
*/
.block, .end, .path, .current_up, .current_right, .current_down, .current_left, .success{
    position: absolute;
    box-sizing: border-box;
}

.block{
    background-image: url(../img/lotus_leaf.png);
}
.path{
}

.end{
    background-image: url(../img/frog.png);
}

.success{
    background-image: url(../img/water.png);
}

.current_up{
    background-image: url(../img/tadpole_up.png);
}
.current_right{
    background-image: url(../img/tadpole_right.png);
}
.current_down{
    background-image: url(../img/tadpole_down.png);
}
.current_left{
     background-image: url(../img/tadpole_left.png);
 }
```

在这个样式表中，为 body 设置了背景图片，为 game 这个 class 设置了定位方式，为我们接下来要用到的小 div 设置了一些背景图片。比如为 class 为 block 的 div 设置荷叶背景图，为 class 为 end 的 div 设置青蛙背景图，为 class 为 current_up 的 div 设置一个头朝上的蝌蚪背景图等等。

**JS 脚本**

在 tadpole.js 文件中，我们定义一个初始化游戏界面的函数 initGameDivs()，函数实现如下：
```
	//获取屏幕的宽度和高度
    var screen_width = window.innerWidth;
    var screen_height = window.innerHeight;
    //游戏区域的尺寸
    var game_div_size = Math.min(screen_width, screen_height) - 20;
    var single_div_size = game_div_size / 10;
	//初始化页面中的DIV
    var initGameDivs = function (data, divs) {
        //设置游戏区域的宽和高，是动态变化的
        var gameDiv = document.getElementById("game");
        gameDiv.style.width = game_div_size + 'px';
        gameDiv.style.height = game_div_size + 'px';
        //设置gameDiv的位置
        var top = Math.max(10, (screen_height - game_div_size) / 2);
        var left = Math.max(10, (screen_width - game_div_size) / 2);
        gameDiv.style.top = top + 'px';
        gameDiv.style.left = left + 'px';
        for (var i = 0; i < data.length; i++) {
            var div = [];
            for (var j = 0; j < data[0].length; j++) {
                var newNode = document.createElement('div');
                newNode.className = 'block';
                //设置宽和高
                newNode.style.height = single_div_size + 'px';
                newNode.style.width = single_div_size + 'px';
                //设置位置
                newNode.style.top = (i * single_div_size) + 'px';
                newNode.style.left = (j * single_div_size) + 'px';
                //设置背景图片的缩放尺寸
                newNode.style.backgroundSize = single_div_size + 'px';
                //向gameDiv中添加字项
                document.getElementById('game').appendChild(newNode);
                div.push(newNode);
            }
            divs.push(div);
        }
    };
```

首先，我们获取到 HTML 页面的宽度和高度，然后将GameDiv 的尺寸定为页面宽高中的小的那个值减去20（留出一些空隙），GameDiv 中每个小 div 的尺寸为 GameDiv 的十分之一（正好 10*10 的排列）。这样做可以根据 HTML 页面的大小来动态调整 GameDiv 和里面小 div 的缩放，适配所有的屏幕尺寸。

在这个函数中我们通过 **getElementById()**  获取到
 id 为 game 的 div，也就是 GameDiv，然后为它设置动态的宽高以及在屏幕中的位置，进行屏幕适配。通过两个嵌套的 for 循环，创建 100 个div，同样设置这 100 个小 div 的宽高、位置、背景图缩放尺寸等属性，然后将这100个小 div 加到 GameDiv 中，同时将这100个小 div 加入一个 10*10 的二维数组中，便于后面刷新界面时为这些小 div 设置不同的 class，这个二维数组我们称之为 **DIV 矩阵**。

在 tadpole.js 中再定义一个函数 refreshGame()，传进来两个参数，一个是数据矩阵，一个是 DIV 矩阵，根据数据矩阵中元素的值，为 DIV 矩阵中对应的 div 设置不同 class，以渲染不同的背景图片。在这里我们增加了一个成员变量 mDirection，表示小蝌蚪当前的朝向，根据朝向的不同来设置不同的蝌蚪背景图（图片中蝌蚪的方向不同）。

```
    //小蝌蚪的方向,1 表示向上，2 表示向右，3表示向下， 4表示向左，默认向上
    var mDirection = 2;
	//刷新DIV
    var refreshGame = function (data, divs) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                //是不可以走的block
                if (data[i][j] == TYPE_BLOCK) {
                    divs[i][j].className = 'block';
                }
                //是可以走的path
                else if (data[i][j] === TYPE_PATH) {
                    divs[i][j].className = 'path';
                }
                //当前所在位置current
                else if (data[i][j] == TYPE_CURRENT) {
                    //根据角色不同的方向加载不同的背景图片
                    switch (mDirection) {
                        case 1:
                            divs[i][j].className = 'current_up';
                            break;
                        case 2:
                            divs[i][j].className = 'current_right';
                            break;
                        case 3:
                            divs[i][j].className = 'current_down';
                            break;
                        case 4:
                            divs[i][j].className = 'current_left';
                            break;
                    }
                }
                //是终点end
                else if (data[i][j] == TYPE_END) {
                    divs[i][j].className = 'end';
                }
                //角色成功到达终点
                else if (data[i][j] == TYPE_SUCCESS) {
                    divs[i][j].className = 'success';
                }

            }
        }
    };
```

再定义一个整体的初始化函数 init()，调用上面两个方法，完成初始化工作。
```
	//在script.js中调用
    var init = function (data) {
        //为initTime赋值
        initTime = new Date().getTime();
        //为gameData赋值
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                gameData[i][j] = data[i][j];
            }
        }
        initGameDivs(gameData, gameDivs);
        refreshGame(gameData, gameDivs);
    };
```

（这里从外界传入一个 data 的二维数据，遍历这个数组，对数据矩阵进行赋值操作，将实际的数据矩阵提取到外部，有利于代码的拓展，后面再介绍）

#### 编写控制函数

这里我们只需要三个控制函数，分别是前进、左转、右转。

```
    const DIRECTION_UP = 1;    //1表示方向向上
    const DIRECTION_RIGHT = 2;  //2表示方向向右
    const DIRECTION_DOWN = 3;  //3表示方向向下
    const DIRECTION_LEFT = 4;  //4表示方向向左
	//根据当前的方向向前走
    var move_forward = function () {
        var index_i = -1;
        var index_j = -1;
        //遍历这个数据矩阵，找到当前的位置
        for (var i = 0; i < gameData.length; i++) {
            for (var j = 0; j < gameData[0].length; j++) {
                if (gameData[i][j] == 1) {
                    index_i = i;
                    index_j = j;
                    break;
                }
            }
        }
        //根据方向修改往前走了一步后的数据矩阵
        switch (mDirection) {
            case 1:  //方向朝上
                //必须是不等于-1才能往前走
                if (gameData[index_i - 1][index_j] != TYPE_BLOCK) {
                    gameData[index_i - 1][index_j] += 1;
                    gameData[index_i][index_j] -= 1;
                }
                break;
            case 2:  //方向朝右
                //必须是不等于-1才能往前走
                if (gameData[index_i][index_j + 1] != TYPE_BLOCK) {
                    gameData[index_i][index_j + 1] += 1;
                    gameData[index_i][index_j] -= 1;
                }
                break;
            case 3:  //方向朝下
                //必须是不等于-1才能往前走
                if (gameData[index_i + 1][index_j] != TYPE_BLOCK) {
                    gameData[index_i + 1][index_j] += 1;
                    gameData[index_i][index_j] -= 1;
                }
                break;
            case 4:  //方向朝左
                //必须是不等于-1才能往前走
                if (gameData[index_i][index_j - 1] != TYPE_BLOCK) {
                    gameData[index_i][index_j - 1] += 1;
                    gameData[index_i][index_j] -= 1;
                }
                break;
        }
        refreshGame(gameData, gameDivs);
    };
    //角色左转
    var turn_left = function () {
        if (mDirection == DIRECTION_UP) {
            mDirection = DIRECTION_LEFT;
        } else {
            mDirection = mDirection - 1;
        }
        refreshGame(gameData, gameDivs);
    };
    //角色右转
    var turn_right = function () {
        if (mDirection == DIRECTION_LEFT) {
            mDirection = DIRECTION_UP;
        } else {
            mDirection = mDirection + 1;
        }
        refreshGame(gameData, gameDivs);
    };
```

在函数 move_forward() 中，先遍历数据矩阵，查到矩阵中值为 1 的元素坐标，如果没找到，说明小蝌蚪已经到达目的地，则遍历矩阵，查找值为 3 的元素坐标，定位到小蝌蚪当前所在位置。然后根据其当前的朝向，判断小蝌蚪前面一个元素是不是障碍物，如果不是，就修改前面一个元素和当前所在位置元素的值，做到动态修改数据矩阵的目的。

在 turn _left() 和 turn _right() 这两个方法中，其实就是修改了 mDirection 这个变量的值，使它能够正确表示左转、右转之后的蝌蚪朝向。（其实方向的值用 0~3 会更好一些）

##### 游戏结果检查

游戏结果检查的逻辑其实也比较简单，就是遍历数据矩阵，查找矩阵中有没有值为 3 的元素。如果有，就说明小蝌蚪正确到达目的地，如果没有，就说明没有到达目的地。

```
	//是否成功
    var flag_success = false;
    //所用时间,根据所用时间来进行星级评定
    var usedTime = 0;
    //游戏初始化时的时间
    var initTime = 0;
    //检查游戏是否结束时的时间
    var finishTime = 0;
    //判断游戏是否结束
    var check_game = function (data) {
        //用户的评星
        var rating = 0;
        //为finishTime赋值
        finishTime = new Date().getTime();
        usedTime = finishTime - initTime;
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                if (data[i][j] == 3) {
                    flag_success = true;
                    break;
                }
            }
        }
        if (flag_success == true) {
            //如果成功到达目的地并且用时少于1分钟，评为3星
            if(usedTime < 60000){
                rating = 3;
            }
            //如果成功到达目的地并且用时少于3分钟，评为2星
            else if(usedTime < 180000){
                rating = 2;
            }
            //如果成功到达目的地并且用时少于5分钟，评为1星
            else if(usedTime < 300000){
                rating = 1;
            }
            window.android.showGameResult(rating, "恭喜你成功了");
        }else{
            window.android.showGameResult(rating, "没有到达目的地");
        }

    };
```

可以看到我们在这个函数中引入评星系统，这个星级是根据是否成功到达目的地以及所用时间长短来划分的。如果成功到达目的地且用时少于 1 分钟，评 3 星（满）；如果成功到达目的地且用时在 1~3 分钟之间，评 2 星；
如果成功到达目的地且用时在 3~5 分钟之间，评 1 星；
如果成功到达目的地但用时在超出 5 分钟或者没有成功到达目的地，评 0 星。（initTime 这个变量在 init() 方法中初始化） 

同时，我们可以看到我们调用了 **window.android.showGameResult(rating, "恭喜你成功了");** 这样一个方法。这个方法是去调用了 Android 本地的 Java 对象的方法，主要是用于展示一个本地的 Dialog 而不是一个网页的弹窗，这个我们后面再介绍。

##### 定义执行函数和API导出

```
    //执行相应的方法
    var execute = function (code) {
        try{
            eval(code);
            check_game(gameData);
        }
        catch (e) {
            if (e !== Infinity) {
                alert(e);
            }
        }
    };
    //导出API
    this.init = init;
    this.move_forward = move_forward;
    this.turn_left = turn_left;
    this.turn_right = turn_right;
    this.execute = execute;
```

我们模仿 turtle.js 中的写法，定义一个执行函数 execute()，传入 Blockly 块所生成的代码，这些代码是 move_forward() 等控制函数的调用。利用 eval() 函数一次执行这些代码，然后检查游戏结果。

导出 API 是为了在其他的 JS 文件中也能够调用 Tadpole 这个类的函数。比如我们在 level1_script.js 文件中就调用了 init() 方法来对一个 Tadpole 对象初始化。

```
var game = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1,  1,  0,  0,  2, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
];
var tp = new Tadpole();
tp.init(game);
```

在这个 JS 文件中我们就可以知道，实际的初始数据矩阵是通过外界的 JS 文件传入，这样做的好处在于我们可以非常方便进行游戏场景的复制，设置不同形状的迷宫。只需要复制这个 JS 文件，然后修改其中的数据矩阵即可。

#### 设计 Blockly 块，匹配控制函数

上面这一大段内容都是介绍这个游戏场景的实现，实际上它可以作为一个独立的 HTML 游戏，运行在网页上，使用键盘控制小蝌蚪的前行和转向，和 Blockly 还没有什么关联。现在我们要做的就是设计 Blockly 的块，使用这些块来控制小蝌蚪的动作。

这个流程和第一模块中的流程基本上是相同的，进行块定义、加入工具栏、编写生成器函数、编写回调等等。

**1. 块定义和生成器函数**
```
{
    "type": "tp_move_forward",
    "message0": "往前游一下",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "",
    "helpUrl": ""
  }
```
以前进的块为例来作说明，这个块的定义其实是最简单的那一种，连参数都没有，只有文本和上下连接。

![img7.png](https://i.loli.net/2019/08/29/aetbisQLgmBlWrP.jpg)

再看看它所对应的生成器函数是怎样的：

```
//角色向前走
Blockly.JavaScript['tp_move_forward'] = function(block) {
    return 'move_forward();\n';
};
```
也非常的简单，就是返回对 move_forward() 函数的调用。

**2. 工具栏**

```
<toolbox>
    <block type="tp_move_forward"></block>
</toolbox>
```

工具栏也超级简单，就是将用到的块做了一个引用。这里我们制作了多个工具栏，便于在不同的关卡中展示要用到的不同的块。

**3. Activity 中的逻辑**

```
/**
 * 小蝌蚪找妈妈的blockly界面
 */
public class TadpoleBlocklyActivity extends AbstractBlocklyActivity {
    private static final String TAG = "TadpoleBlocklyActivity";
    //当前所在的关卡，默认为0，即第一关
    private int mIndex = 0;
    //根据不同的关卡，加载不同场景
    private String [] htmlPaths = {
            "file:///android_asset/tadpole/html/level1.html",
            "file:///android_asset/tadpole/html/level2.html",
            "file:///android_asset/tadpole/html/level3.html",
            "file:///android_asset/tadpole/html/level4.html"
    };
    //根据不同的关卡，加载不同的工具栏
    private String [] toolboxPaths = {
            "tadpole/toolbox/toolbox_level1.xml",
            "tadpole/toolbox/toolbox_level2.xml",
            "tadpole/toolbox/toolbox_3.xml",
            "tadpole/toolbox/toolbox_3.xml"
    };
    private Handler mHandler = new Handler();
    private WebView mWebview;
    private CodeGenerationRequest.CodeGeneratorCallback mCallback = new CodeGenerationRequest.CodeGeneratorCallback() {
        @Override
        public void onFinishCodeGeneration(final String generatedCode) {
            Log.i(TAG, "onFinishCodeGeneration: "+generatedCode);
            mHandler.post(new Runnable() {
                @Override
                public void run() {
                    String encoded = "tp.execute("
                            + JavascriptUtil.makeJsString(generatedCode) + ")";
                    mWebview.loadUrl("javascript:"+encoded);
                }
            });
        }
    };
    @NonNull
    @Override
    protected String getToolboxContentsXmlPath() {
        Log.i(TAG, "getToolboxContentsXmlPath: mIndex------->"+mIndex);
        return toolboxPaths[mIndex];
    }

    @NonNull
    @Override
    protected List<String> getBlockDefinitionsJsonPaths() {
        List<String> jsonPaths = new ArrayList<>();
        jsonPaths.add("tadpole/tadpole.json");
        return jsonPaths;
    }

    @NonNull
    @Override
    protected List<String> getGeneratorsJsPaths() {
        List<String> jsPaths= new ArrayList<>();
        jsPaths.add("tadpole/generator.js");
        return jsPaths;
    }

    @NonNull
    @Override
    protected CodeGenerationRequest.CodeGeneratorCallback getCodeGenerationCallback() {
        return mCallback;
    }

    @Override
    protected View onCreateContentView(int containerId) {
        mIndex = getIntent().getIntExtra("index",0);
        Log.i(TAG, "onCreateContentView: mIndex------>"+mIndex);
        View root = getLayoutInflater().inflate(R.layout.activity_tadpole, null);
        mWebview = root.findViewById(R.id.tp_webview);
        mWebview.getSettings().setJavaScriptEnabled(true);
        mWebview.setWebChromeClient(new WebChromeClient());
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
        mWebview.addJavascriptInterface(new MyJSInterface(this), "android");
        mWebview.loadUrl(htmlPaths[mIndex]);
        return root;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ActionBar actionBar = getSupportActionBar();
        actionBar.setElevation(0);
        actionBar.setBackgroundDrawable(getResources().getDrawable(R.drawable.water));
    }
}
```

我们新建 TadpoleActivity 继承自 AbstractBlocklyActivity，覆盖里面的抽象方法。在 onCreateContentView() 方法里面加载我们自定义的布局。自定义布局中有效果展示的 WebView，并引入了 Blockly 的工作区，用于摆放 Blockly 的块。

```
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="horizontal" android:layout_width="match_parent"
    android:layout_height="match_parent">
    <WebView
        android:id="@+id/tp_webview"
        android:layout_width="0dp"
        android:layout_height="match_parent"
        android:layout_weight="1">
    </WebView>
    <RelativeLayout
        android:layout_width="0dp"
        android:layout_height="match_parent"
        android:layout_weight="1">
        <include layout="@layout/blockly_unified_workspace" />
    </RelativeLayout>
</LinearLayout>
```

在 onFinishCodeGeneration() 这个回调函数中，调用WebView 加载生成的 JS 代码，实现最终效果。

在这里还有一个需要注意的地方，我们之前在JS代码的 check_game() 这个函数中提到 **window.android.showGameResult(rating, "恭喜你成功了");** 这行代码是调用本地 Java 对象的方法。现在我们就来讲讲这里是如何调用的。

在 onCreateContentView() 函数中，我们通过 findViewById() 找到 Webview 控件，然后有如下一行代码：

```
mWebview.addJavascriptInterface(new MyJSInterface(this), "android");
```

这行代码中涉及一个类 MyJSInterface，我们先来看看这个类是怎样的：

```
public class MyJSInterface {
    private Context mContext;
    public MyJSInterface(Context context){
        this.mContext = context;
    }

    /**
     * 展示游戏运行结果
     * @param rating
     * @param msg
     */
    @JavascriptInterface
    public void showGameResult(int rating, String msg){
        Util.showDialog(mContext,msg, rating,new Handler());
    }
}
```

可以看到这个类中定义了一个方法 showGameResult()，展示游戏结果。这个方法中接收 rating 和 msg 两个参数，调用 Util.showDialog() 这个静态方法，显示一个 Dialog。

WebView 的 addJavascriptInterface() 这个方法的作用是将一个 MyJSInterface 对象以 “android” 这个名字注入到 JS 代码中，在 JS 代码中可以通过 window.android 获取到这个对象，从而调用这个对象的方法，这是远程 JS 调用 Android 本地函数的一种实现。在我们的代码中我们用一个原生的 Dialog 代替 JS 中的 Alert 窗口，更加美观，也更有拓展的余地。

#### 结语

经过这么一大篇的叙述，终于将使用 Blockly 实现游戏场景介绍完毕。从内容的分配上就可以知道这第二模块的开发难度不在于块的设计或者块与游戏的对接上，而是在于游戏场景的设计与实现上。要做到游戏场景与 Blockly 有一定的契合度并不容易，需要好好构思。
























