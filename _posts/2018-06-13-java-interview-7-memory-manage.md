---
layout: post
title: Java 笔试面试（7）Java平台与内存管理
tags: ["Java"]
categories: 笔试面试
date: 2018-06-13 14:21:00
cover: https://s2.loli.net/2022/01/24/q4SweHrEWcPfGox.jpg
---
### Java 笔试面试（7）Java平台与内存管理

#### 1. JVM

JVM用来把Java编译生成的中间代码转换为机器可以识别的编码并执行。它有自己完善的硬件架构，如处理器、堆栈、寄存器等，还有相应的指令系统，它屏蔽了与具体操作系统平台相关的信息，使得Java程序只需生成在JVM上运行的字节码（中间代码 class文件），就可以在多个平台上不加修改地顺利运行。每当一个Java程序运行时，就会有一个对应的JVM实例，只有当程序运行结束后，这个JVM才会退出。**JVM通过main（）方法来启动一个Java程序。**

#### 2. JVM加载class文件原理

JVM会将编译生成的.class文件按照需求和一定规则加载到内存中，组织成一个完整的Java应用程序。这个加载过程是通过类加载器来完成的。即由ClassLoader及其子类来实现，ClassLoader也是一个类，本质是把类文件从硬盘读取到内存中。

类的加载方式：
1. 隐式加载：程序在使用new等方式创建对象时，会隐式调用类加载器把对应的类加到JVM中。
2. 显示加载：通过直接调用Class.forName() 方法把所需的类加到JVM中。

类的加载是动态的，不会一次性把所有的类都加到JVM中，而是将保证程序运行的基础类完全加到JVM中，其他类则在需要的时候进行加载。这样一方面可以提高加载速度，另一方面可以节约程序运行过程中对内存的开销。

类加载步骤：
1. 装载：根据查找路径找到相应的class文件，然后导入。
2. 链接：可以分为三个小步：
	- 检查：检查待加载的class文件的正确性。
	- 准备：给类中的静态变量分配存储空间。
	- 解析：将符号引用转换成直接引用（可选）。
3. 初始化：对静态变量和静态代码块执行初始化工作。

#### 3. 垃圾回收

Java中垃圾回收是一个非常重要的概念，主要作用是回收程序中不再使用的内存。

3个任务：
- 分配内存
- 确保被引用对象的内存不被错误地回收
- 回收不再被引用的对象的内存空间

可以避免因开发人员错误地操作内存而导致应用程序的崩溃。但是，垃圾回收器必须跟踪内存的使用情况，释放没用的对象，在完成内存的释放后还要处理堆中的碎片，这些操作会增加JVM的负担，从而降低程序的执行效率。

使用有向图来记录和管理堆内存中的所有对象，识别哪些对象是可达的（有引用变量指向的是可达的）哪些是不可达的（没有引用变量指向的是不可达的），不可达对象都是可以被回收的。

垃圾回收算法：
1. 引用计数算法
2. 追踪回收算法
3. 压缩回收算法
4. 复制回收算法
5. 按代回收算法

开发人员不能实时调用垃圾回收器对某个对象或所有对象进行垃圾回收，但是可以通过System.gc() 方法“通知 ”垃圾回收器运行。

#### 4. Java中的堆和栈

基本数据类型的变量以及对象的引用变量，内存都分配在栈里。

对象的内存分配在堆上或常量池（如字符串常量和基本数据类型常量）中，需要通过new等方式进行创建。

一个JVM实例对应一个堆，所以多个线程共享堆内存，因此多线程访问堆中的数据需要对数据进行同步。



