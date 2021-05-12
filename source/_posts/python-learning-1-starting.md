---
title: Python 学习系列（一） Python 启程
date: 2017-09-08 13:51
tags: ["Python"]
categories: 技术
thumbnail: http://image.wufazhuce.com/FtCjSX944FE3I62c-sR0UwkfRcOw
subtitle: 人生苦短，我用 Python
---
> 写在最前：我为什么要学习 Python？
> Python 在我看来是一门非常好的胶水语言，首先语法简洁，很容易上手；其次它有非常多的第三方库，不需要频繁地去造轮子，适合快速开发；第三，很好地适用于各种研究领域，比如数据挖掘、机器学习、人工智能、科学计算等等。这些优点足以让一个开发人员心动，这也是我把 Python 作为我的第二门主要的编程语言的原因。

简单讲述一下学习 Python 的理由后，就可以正式开始 Python 的学习之路了。

**（一）搭建开发环境**

由于我所使用的操作系统是 windows，所以就只介绍在 windows 下进行开发环境的搭建，其他操作系统的安装过程请自行搜索相关教程。进入 Python 的官方网站：[「Python 官网」](http://python.org)下载 Python 安装程序。

![img1.png](https://i.loli.net/2019/08/29/7DxtSnveIPfWCaX.jpg)

目前，Python 有两大版本，即 Python 2.x 和 Python 3.x，不巧的是这两大版本之间不是兼容的。那么到底选择哪个呢？我选择的是 Python 3.x 的版本，因为Python 3.x 是代表了 Python 的未来，大部分的第三方库都完成了代码重构来兼容 Python 3.x，越来越多的项目也逐渐使用 3.x 版本进行开发。所以单从学习的角度出发，学习 3.x 无疑是更好的选择。

在官网中点击Downloads，进入下载页面：

![img2.png](https://i.loli.net/2019/08/29/OQaXVz3it6qrEvI.jpg)

选择最新的 3.x 版本，点击进行下载windows操作系统下的Python程序。下载完毕后进行安装。

![img3.png](https://i.loli.net/2019/08/29/VNDBptksz9SaFJZ.jpg)

安装结束后，打开 cmd 命令行工具，输入 python，查看是否安装成功。如果安装成功则会显示当前的 Python 版本信息，并且进入 Python 的运行环境（显示 Python 提示符''>>>"），此时可以在命令行中直接编写python代码，要退出时输入 exit() 就可以退出 Python 的交互环境。安装 Python 环境的同时，还会安装 pip、IDLE 和 Python 文档。pip 是 Python 的包管理工具，可以利用 pip 来下载第三方的 Python 库。IDLE 是 Python 自带的一款代码编辑器，支持交互式和脚本式的代码编辑操作。

安装成功如图所示：

![img4.png](https://i.loli.net/2019/08/29/qGntK7SiZ1Rk9sx.jpg)

**（二）运行第一个Python程序**

安装好Python的运行环境后，就可以动手编写第一个python程序了。相信对于绝大多数的程序员来说，hello world都是自己敲出来的第一行代码。所以现在就来看看如何用 Python 打印输出 hello world 吧。

方法一：在 cmd 命令行中运行程序

之前我们在命令行中输入了 "python"，进入了 Python 的交互环境，可以直接编写代码。
```python
C:\Users\redant>python
Python 3.6.1 (v3.6.1:69c0db5, Mar 21 2017, 18:41:36) [MSC v.1900 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> print("hello world!")
hello world!
>>>
```

方法二：使用 IDLE 的交互式模式
打开 IDLE，就会直接进入 Python 的交互环境，此时的操作和在命令行中一致。

![img5.png](https://i.loli.net/2019/08/29/FpmuVEzk8SMnlaK.jpg)

方法三：使用IDLE创建脚本文件运行程序

打开IDLE，使用快捷键「Ctrl+N」，新建脚本文件，编写 hello world 代码。

![img6.png](https://i.loli.net/2019/08/29/vbunyJdMWwIY83B.jpg)

将该文件保存为后缀为 .py 的文件，按下 F5，就会运行这个脚本文件，运行结果如图：

![img7.png](https://i.loli.net/2019/08/29/OI6SYs5TQfw9uKp.jpg)

成功输出我们想要的 hello world 后，Python 启程就告一段落了，下一篇将介绍 Python 中的变量和数据类型，再会。


