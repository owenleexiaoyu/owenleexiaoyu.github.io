---
layout: post
title: 造轮子学习法
categories: 想法
tags: ["学习"]
---

这篇文章是我自己对于造轮子学习法的感受。第一次接触这个学习编程的方法是看到一篇解析 ButterKnife 原理的文章《[带你手撸一个Kotlin版的EventBus](https://blog.csdn.net/haojiagou/article/details/105363300)》，不同于其他讲流程、贴源码的解析文章，它是从头写一个简单的 ButterKnife，从而讲解实现原理。读者可以按照那篇文章动手来实现一个简单的 View 注入框架，也就是造一个自己的 ButterKnife 轮子。我跟着那篇文章实现了 ButterKnife 的主体功能，起名叫做 [CakeKnife](https://github.com/owenleexiaoyu/AndroidCodelabs/tree/main/CakeKnife)。之后，我又找到一篇同样以造轮子方式来实现 Rxjava 核心功能以及一些操作符函数的文章《[一起来造一个RxJava，揭秘RxJava的实现原理](https://blog.csdn.net/tellh/article/details/71534704)》，自己跟着实践，同样造了一个简单的 RxJava 的轮子 [RxJavaCore](https://github.com/owenleexiaoyu/AndroidCodelabs/tree/main/RxJavaCore)，感觉对 RxJava 的理解更加清楚了，会更近一步思考各个操作符的实现逻辑。

那什么是造轮子学习法呢？

我个人对它的定义是：**造轮子学习法是对一个框架进行仿制学习，从零开始，先实现这个框架的核心功能，再不断丰富细节，就好像是自己设计一个框架一样，从而学习框架最核心的设计思路**。

不仅我觉得这个学习方法非常有用，我在 B 站上关注的一位技术 UP 主同样推崇这个方法，还出了视频进行介绍，我也有记笔记：[如何提升编程能力](http://lixiaoyu.life/2022/09/28/how-to-improve-programming-skills.html)






