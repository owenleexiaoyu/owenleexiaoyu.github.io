---
layout: post
title: Java 笔试面试（8）容器
tags: ["Java"]
categories: 笔试面试
date: 2018-06-13 15:25:00
cover: http://image.wufazhuce.com/Fi8XSRZCdEi-67YEpZAPF0KRsr6X
---

### Java 笔试面试（8）容器

#### 1. Collections 框架

Java Collections框架包含了大量集合接口以及这些接口的实现类和操作它们的方法。

Collection接口是顶层接口；它的子接口有List、Set、Queue；

List是有序的，实现类有ArrayList、LinkedList、Vector（Stack是Vector的子类）

Set表示集合的概念，元素不能重复。
有两个实现类：HashSet、TreeSet（实现了SortSet接口，元素是有序的）

Map用于保存键值对，值可以重复，键是唯一的，不能重复。实现类有：HashMap、TreeMap、LinkedHashMap、WeekHashMap、IndentityHashMap等

#### 2. ArrayList、LinkedList、Vector

这三个类都是均为可变长列表。

ArrayList和Vector都是基于**Object[] array**数组来实现的。**插入效率低，查找效率高，有初始长度**，当存储的元素超过这个长度时就要动态地扩充它们的存储空间。Vector默认扩充到原来的**2**倍（每次扩充空间的大小可以设置），ArrayList默认扩充到原来的**1.5**倍（不能设置扩充空间的大小）。

ArrayList与Vector最大的区别在于，ArrayList的方法是不同步的，**ArrayList不是线程安全的**；Vector的大部分方法都是同步的，**Vector是线程安全的**，性能要略低于ArrayList。

LinkedList是采用**双向链表**来实现的，**插入效率高，查找效率低**。也是**非线程安全**的。

#### 3. HashMap、Hashtable、TreeMap、WeekHashMap

HashMap是Hashtable的轻量级实现。两者都采用了hash法进行索引。

| HashMap     |     Hashtable |
| :--------:| :------: |
| 非线程安全的，开发人员需要提供额外的同步机制    |   线程安全的 |
| 允许null作为键（最多只能有一个）|不允许null作为键|
|继承自Dictionary类|是Map接口的一个实现类|
|hash数组的默认大小是11，增加方式是old*2+1 |hash数组的默认大小是16，而且一定是2的倍数| 

TreeMap实现了SortMap接口，能够把它保存的记录按键排序，取出来的是排序后的键值对。

如果需要输出的顺序和输入的顺序一致，用LinkedHashMap可以实现。

WeekHashMap与HashMap相似，不同之处在于WeekHashMap中key采用“弱引用的”方式，只要WeekHashMap中的key不再被外界使用，就可以被垃圾回收器回收。HashMap中的key采用“强引用”的方式，当HashMap中的key没有被外界引用时，只有这个key
从HashMap中删除后，才可以被垃圾回收器回收。

实现HashMap的同步：
HashMap可以通过 Map map = Collectoins.synchronizedMap(new HashMap());来达到同步的效果。

#### 4. Collection和Collections

Collection是一个集合接口，是List、Set等接口的父接口。它提供了对集合对象进行基本操作的通用接口方法。

Collections是一个工具类，它提供一系列静态方法来实现对各种集合的搜索、排序、线程安全化等操作，其中大部分方法都是用来处理线性表。

#### 5. HashMap原理

Hashmap本质是数组加链表。通过key的hashCode来计算hash值的，只要hashCode相同，计算出来的hash值就一样，然后再计算出数组下标，如果多个key对应到同一个下标，就用链表串起来，新插入的在前面。

![新建位图图像.bmp](https://i.loli.net/2018/11/06/5be18c73a4b8a.bmp)

