---
layout: post
title: Android 实习面经分享
tags: ["Android", "面经"]
categories: 笔试面试
date: 2018-07-31 23:57
cover: http://image.wufazhuce.com/FtNJ5eJxA_5AQMmfKsV14EtRWazv
---
 
### 前言

 六月份开始准备找实习工作后，先后再拉勾、实习僧上创建账号，查找合适的实习岗位，海投简历。进入面试的公司有今日头条、腾讯、知乎、小黑盒、链家、小米，最后拿到了小米的实习offer，也算是一个happy ending。

下面将面试的一些经历写下来，算是了却一桩心事。

### 今日头条

我先后在拉勾上投了两个头条的岗位，但是很忏愧都倒在了一面上。

第一个实习岗位的一面现在看来是最为可惜的，因为题目不难，但是由于投简历投的太匆忙，没有时间好好复习，也是第一次面试，答得乱七八糟的，估计面试官也觉得浪费了时间。

问到的问题有：

1. （编程题）找出数组中的最大值
2. 对包装类的考察：
Integer v1 = 10
Integer v2 = 10
Integer v3 = new Integer(10)
Integer v4 = 128
Integer v5 = 128
Integer v6 = Integer.valueOf(10)
判断：
v1==v2
v1==v3 
v4==v5 
v1==v6 
四个布尔表达式的正误。

> 主要考察的点是Integer包装类对-128到127这个范围内的数进行了缓存，有一个缓存数组，如果不使用new关键字进行创建在这范围内的数的对象时，相同数值的引用指向数组中同一下标的对象，指向同一存储空间。而使用new关键字进行创建时，则会另外单独开辟一个存储空间，即使值相同，所指向的存储空间也并不相同。

3. “a==b”和”a.equals(b)”有什么区别？

> 常见面试题，不多说。

4. Hashtable 与 HashMap 有什么不同之处？

> 考察集合框架的知识，也是一个典型的面试题。

5. synchonized、volatile、threadlocal这几个关键字的作用
synchronized 和 ReentrantLock 有什么不同

> 考察多线程的相关知识

6. Android四大组件介绍，关于Service代码执行在哪个线程？

7. HTTP协议的请求方式有哪些，之间有什么区别？
cache_control、keep-alive这两个header的作用

8. Activity的启动模式有哪几种？给定Activity的启动模式与切换顺序，问在点击back键时任务栈如何变化。

9. looper的loop（）方式是死循环，为什么不会造成主线程卡死呢？

头条的第二个岗位的面试比第一个要难一点，主要问到的题目有如下几个：

1. HashMap时间复杂度
2. 冒泡排序的时间复杂度
3. LinkedList时间复杂度
4. 接口与抽象类的区别，抽象类和接口中哪个可以有静态代码块？

```
interface ITest{
   static {
      printf("hello");
  }
}

public abstract class Test {
    static {
       printf("hello");
   }
}
```

5. 操作系统进程间通信
6. 介绍一下Android中的Handler和Looper。
两个looper能否共享一个线程? 两个线程能否共享一个looper?
7. View事件传递机制和View绘制机制
8. Java多线程同步
9. 简单写一个单消费者单生产者的demo.

### 腾讯

在腾讯春招补录的时候投了简历，也是止于一面，腾讯的面试和头条有所不同，头条的面试官问的题目是之前准备好的，问的过程比较中规中矩，腾讯的面试官是先问了项目经历，然后从项目中涉及的技术发散开来问，想到什么问什么，然后越问越深，直到我答不上来才开始换一个话题接着问。然后问的范围也比较广，虽然投的Android岗，但是也问了很多C++的知识。

问到的问题有：
1. 知道哪些排序算法，归并排序的实现过程，稳定性，时间复杂度。
2. 数据库中的视图以及使用视图的好处，如何批量添加数据。
3. 二叉树的遍历，二叉查找树的概念。
4. Android中的动画
5. 广播接收器中的ANR
6. Service的启动，是否在主线程中执行。
7. AsynTask和Handler
8. Volley执行网络请求的流程
9. 介绍ArrayList、LinkedList、Vector的区别，在synchronizedList方法中做了哪些保证线程安全的操作？
10. HashMap的实现，散列冲突的解决方法。
11. C++中的运算符重载，内联函数，指针与引用的区别，虚函数，纯虚函数，new和malloc的区别。
12. Java中抽象类和接口的区别，类是否能够多继承，接口是否能够多继承。


### 知乎

知乎止于二面，知乎一面的题目不多，也不是很难，大多是让我介绍一个比较的概念，然后看我说的是否全面、是否正确；二面的题目难度对我来说比较大，主要是复习的时间太短，关于操作系统和计算机网络的相关知识都还没有看，所以被问得一脸懵逼。

一面题目：

1. Fragment的生命周期
2. 介绍广播接收器
3. HashMap的实现原理及如何扩容
4. Java中抽象类和接口的区别
5. 自定义View和事件分发机制
6. 算法题：
将一个32比特的int类型的数字反转。
Given a 32-bit signed integer, reverse digits of an integer.

Example 1:
Input: 123
Output: 321

Example 2:
Input: -123
Output: -321

Example 3:
Input: 120
Output: 21

Note:
Assume we are dealing with an environment which could only store integers within the 32-bit signed integer range: [-2^31,  2^31- 1]. For the purpose of this problem, assume that your function returns 0 when the reversed integer overflows.

class Reverse{
    public int reverse(int input){
       int result = 0;
       while(input != 0){
           int x = input % 10;
           input = input / 10;
           result = result * 10 + x;
       } 
        return result;
   }

二面题目：
1. 先问了项目，问到了在推箱子游戏中如何设计算法让小人自动完成推箱子的操作，找出最优解（因为我在介绍项目的时候提到了推箱子游戏）
2. 进程会占哪些内存？
3. Https和Http的区别，Http1.0和Http2.0的区别
4. TCP的滑动窗口
5. 红黑树
6. Android的打包流程
7. ART虚拟机和Dalvik虚拟机的区别
8. 网络框架（okhttp）中的连接池的作用
9. Java中异常和错误的区别

### 小米

一面题目：
1. 了解过NDK开发吗
2. px、dp、sp概念和联系
3. 介绍Handler，AsycTask，AsycTask是同步还是异步的
4. 算法题：如何判断一个链表中有环？
5. 算法题：将【I am from China】这个字符串（例子）转换输出成【China from am I】

二面题目：
1. 算法题：给定一个数，在一个数组中找到两个元素的和等于这个给定的数。
2. 其他题目不记得了。。。

### 大疆

大疆是投的秋招提前批，投简历->在线测评->笔试->面试。
在线测评主要是做了一些性格测试，外加一些高中的排列组合问题。笔试是4道算法题，都很难，我一道都没做出来，不知怎么还进了面试，目前通过了一面和二面，进入了线下终面，目前还没开始。关于网络和操作系统方面的一些问题没有答好。

一面问题：
1. 介绍项目，针对项目提了一些问题
2. 介绍Activity的启动模式
3. Fragment的生命周期
4. Android中内存溢出
5. Java中的垃圾回收机制
6. Http和Https的区别
7. Tcp的三次握手与四次挥手，是否能将挥手过程减到三次。
8. 自定义一个仪表盘控件的绘制过程，调用哪些方法。
9. 算法题：如何判断一个链表有环。

二面问题：
1. 用到了什么网络框架？
2. dp、dpi的概念，如何在不同的设备上让一个view呈现相同的物理尺寸。
3. PC上的Java虚拟机与Android中的虚拟机有什么区别。
4. 字符串查找子串的算法。
5. 用户态和核心态的区别
6. 虚拟内存的概念
7. Https如何保证安全，抓包能看到原始数据吗，有没有破解的可能性。

PS：小黑盒和链家的面试题目由于当时没有及时记下来，现在时间久了忘记了。这两家公司面试中问的就基本上都是Android的知识点。

### 总结

经过这几次面试，我还是感觉到自己基础的不扎实，关于操作系统的计算机网络的知识，一问一个不会的。所以计算机方面的基础知识一定要巩固好，比如操作系统和计算机网络。然后算法题一定要多练，如果不是应聘算法岗，在面试中问到的算法都是比较常见的，多刷题会很有帮助。笔试的算法题通常会比较难，而且不是光会一个思路就行，而是要提交出能通过测试用例的程序，所以日常的刷题就更有必要了。还有一个就是对常见面试题一定要多练习说的能力，比如抽象类和接口的区别，出现的次数非常频繁，但是如果不注重总结，可能每次遇到的时候都不能将答案完整有条理地回答出来，所以针对一些常见的面试问题，或者在复习针对一些重要的知识点，都要多练习将答案说出来，尽量做到完整，不引入错误（不知道的千万不要乱说，说多错多），有条理。这样有条理的流畅的回答会比那些磕磕绊绊的、夹杂着错误的回答好得多。






