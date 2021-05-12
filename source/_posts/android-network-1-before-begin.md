---
title: Android 网络编程系列（一）写在开始之前
date: 2017-10-11 16:40:25
tags: ["Android 网络编程"]
categories: 技术
thumbnail: http://image.wufazhuce.com/FvFsnN9Ix9qVdf6Lasj6TWZd7dQZ
subtitle: 系列文章的第一篇，写一些其他的。（内含 Android 网络编程学习资料）
---
#### 前言
这几天给自己制定了一个短期的学习目标，深入地学习一下Android网络编程的知识，希望能够由表及里，从最基本的HTTP协议理解，到Android中原生的WebView、HttpUrlConnection的使用，再到一些著名的网络网络框架比如Volley、OkHttp、Retrofit等的基础用法，最后达到从源码角度理解上述网络框架原理和精髓的层次。我不知道自己能够做到哪一步，反正走一步算一步，毕竟坚持就是胜利。

以前自己的学习效率非常糟糕，一个不是很难的知识点往往要花费我很多的时间和精力来学习。后来我看到了一篇关于[「如何高效学习」](http://keeganlee.me/post/full-stack/20170909)的文章，觉得深受启发。所以在这次的系列学习中，我决定按照这篇文章中的一些方法来实践一下。

#### 明确学习目的

「如何高效学习」一文中讲到，学习要想提高效率，需要做到三点：目标导向、难度适中、能用得上。其中第一点就是要求我们在学习一样东西之前要首先确定自己的目标，自己希望从这个东西中获得什么。

对于我这次的阶段性学习来说，目的就是要深入理解Android的网络编程知识，深入意味着不再是仅仅浮于表面，知道一些函数的调用，而是要通过大量的阅读，充分理解这个知识点。并且要将学到的知识运用到实际的项目开发中去。
#### 收集资料

之前学习Android的知识，基本上是通过看书或者视频，一页一页、一个视频一个视频地看，针对性不强，现在我要学的算是一个Android开发中的一个专题内容。需要更多针对性的资料来阅读。而且在「如何高效学习」这篇文章中，作者也提到，如果要学习一个知识点，必须进行大量的泛读。这个观点其实很好理解，一千个读者就有一千个哈姆雷特。即使是在技术这一方面，相同的东西，也会有很多不同的研究方向。并且，不同的开发者对于这个相同的东西也会有不一样的理解，甚至某一个开发者对于这个技术的理解出现了错误，这时如果不去对比其他资料而是全盘接收的话，那么这个错误无疑还会延续到自己身上。货比三家的手段在这里同样是适用的。

所以这次在确定了学习这个专题后，我做的第一件事就是进行资料的收集。我的学习路线基本是参考了刘望舒Android知识体系中的网络编程这一部分内容。他整理了Android网络编程中的知识点，也有相应的教程供大家学习。

![img1](https://i.loli.net/2019/08/29/lcr42p1NF695sjw.jpg)

这些知识点总结来说分为一下6个部分：
- 了解HTTP协议
- Android中的WebView
- HttpUrlConnection用法
- Volley用法（深入到源码）
- OkHttp用法（深入到源码）
- Retrofit用法（深入到源码）

以下就是我为这些知识点收集到的一些资料，基本上都是Android圈中大牛的博客比如郭霖大大、鸿洋大大等等，当然也不能忘了还有刘望舒大大。选择他们的博客是因为他们作为大牛，对于这些知识的理解一般来说都要超过普通的开发者，减少了很多出错的可能，并且能够有比较深刻的理解。在这里推荐一个鸿洋大大维护的Android学习网站[「玩Android」](www.wanandroid.com)，里面也有Android的知识体系，收集了一些质量上乘的博客。可以省去很多手动收集资料的时间。

1. 了解HTTP协议
* 刘望舒博客Http原理
[HTTP协议原理](http://liuwangshu.cn/application/network/1-http.html)
* 阮一峰Http协议
[HTTP 协议入门](http://www.ruanyifeng.com/blog/2016/08/http.html)
* 菜鸟Http教程
[HTTP 教程](http://www.runoob.com/http/http-tutorial.html)
2. WebView的使用
* typename WebView系列（3篇）
[Android WebView 开发详解(一)](http://blog.csdn.net/typename/article/details/39030091)
[ Android WebView 开发详解(二)](http://blog.csdn.net/typename/article/details/39495409)
[ Android WebView 开发详解(三)](http://blog.csdn.net/typename/article/details/40302351)
3. HttpUrlConnection用法
* 郭霖HttpUrlConnection
[使用HttpURLConnection还是HttpClient？](http://blog.csdn.net/guolin_blog/article/details/12452307)
* 《第一行代码》相关内容
4. Volley的使用（源码）
* 郭霖Volley系列教程（4篇）
[初识Volley的基本用法](http://blog.csdn.net/guolin_blog/article/details/17482095)
[使用Volley加载网络图片](http://blog.csdn.net/guolin_blog/article/details/17482165)
[定制自己的Request](http://blog.csdn.net/guolin_blog/article/details/17612763)
[带你从源码的角度理解Volley](http://blog.csdn.net/guolin_blog/article/details/17656437)
* 刘望舒Volley博客（2篇）
[从源码解析Volley](http://liuwangshu.cn/application/network/3-volley.html)
[Volley用法全解析](http://liuwangshu.cn/application/network/4-volley-sourcecode.html)
* 鸿洋Volley
[Volley 图片加载相关源码解析](http://blog.csdn.net/lmj623565791/article/details/47721631)
* 泡在网上的日子Volley
[网络请求库Volley详解](http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2015/0526/2934.html)
4. OkHttp的使用（源码）
* Okhttp官方文档
[Okhttp](https://square.github.io/okhttp/)
* 鸿洋Okhttp博客（3篇）  
[是时候来了解OkHttp了](http://blog.csdn.net/lmj623565791/article/details/47911083)
[当OkHttp遇到Https](http://blog.csdn.net/lmj623565791/article/details/48129405)
[一个改善的okHttp封装库](http://blog.csdn.net/lmj623565791/article/details/49734867)
* 泡在网上的日子Okhttp
[OkHttp使用教程](http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2015/0106/2275.html)
* 刘望舒OkHttp（4篇）
[OkHttp2.x用法全解析](http://liuwangshu.cn/application/network/5-okhttp2x.html)
[OkHttp3用法全解析](http://liuwangshu.cn/application/network/6-okhttp3.html)
[源码解析OkHttp前篇-请求网络](http://liuwangshu.cn/application/network/7-okhttp3-sourcecode.html)
[源码解析OkHttp后篇-复用连接池](http://liuwangshu.cn/application/network/8-okhttp3-sourcecode2.html)
5. Retrofit用法及原理（源码）
* Retrofit官方文档
[Retrofit](http://square.github.io/retrofit/)
* 鸿洋Retrofit博客
[Retrofit2 完全解析 探索与okhttp之间的关系](http://blog.csdn.net/lmj623565791/article/details/51304204)
* [你真的会用Retrofit2吗?Retrofit2完全教程](http://www.jianshu.com/p/308f3c54abdd)
* 刘望舒Retrofit（3篇）
[Retrofit2前篇-基本使用](http://liuwangshu.cn/application/network/9-retrofit2.html)
[Retrofit2后篇-注解](http://liuwangshu.cn/application/network/10-retrofit2-annotations.html)
[源码解析Retrofit](http://liuwangshu.cn/application/network/11-retrofit2-sourcecode.html)

#### 结语
资料收集完毕，就可以进入下一阶段了，从头开始，从基础入手，干翻这个系列专题！！

下篇文章见。