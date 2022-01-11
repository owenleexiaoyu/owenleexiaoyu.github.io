---
layout: post
title: pip install scrapy报错解决
subtitle: 「error：Unable to find vcvarsall.bat」的解决方法
date: 2017-05-17 23:11
categories: 技术
cover: http://image.wufazhuce.com/FotCjChgljMwJkIau9A3LBhoBiyC
tag: ["Python"]
---
今天在使用pip install scrapy 命令安装Scrapy爬虫框架时，出现了很让人头疼的错误，错误截图如下：

![img1.png](https://i.loli.net/2019/08/29/TBlMIKZqSCRwDvm.jpg)

在网上查找解决方法时，大致知道了问题的原因。是因为缺少C语言的编译环境，其中一种解决方法就是安装相对应版本的Visual Studio，但是安装VS本身就极其麻烦，所以这种方法是不推荐的。第二种方法就是下载已经编译好的安装包。
#### 1. 下载.whl安装包
可以到下面这个网址中下载与python版本以及系统（32位或64位）相匹配的Twisted版本，比如我下载的就是**Twisted-17.1.0-cp35-cp35m-win_amd64.whl**

>http://www.lfd.uci.edu/~gohlke/pythonlibs/

#### 2. 安装下载的.whl安装包
    
在命令行中使用**pip install Twisted的路径..**的命令来安装Twisted

#### 3. 安装Scrapy

此时在命令行中使用**pip install scrapy**来安装Scrapy就会提示安装成功了。输入**scrapy -h**也可以看到相应使用帮助。截一下图抒发一下激动的心情。

![img2.png](https://i.loli.net/2019/08/29/lDpcv5PybZ6rJWa.jpg)