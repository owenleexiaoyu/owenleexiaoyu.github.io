---
title: Java 笔试面试（5）字符串与数组
tags: ["Java"]
categories: 笔试面试
date: 2018-06-12 19:28:00
thumbnail: http://image.wufazhuce.com/FiLQswZdFss6oWiwwOVCOAMFG_d_
---

### Java 笔试面试（5）字符串与数组

#### 1. 字符串创建及存储机制

String类型初始化有两种方式：
1. String s = new String("abc"); 会在堆中创建一个字符串对象。
2. String s = "abc"; JVM中存在一个字符串池，其中保存着很多String对象，可以被共享使用。当使用这种方式创建一个字符串时，会首先在字符串常量池中查找是否已经有相同的字符串对象，判断依据是String.equals() 方法的返回值，如果有，则直接获取其引用，如果没有，则先创建这个字符串对象，再把它加入到字符串池中，再将它的引用返回。

```
String s1 = "abc";
String s2 = "abc";
String s3 = new String("abc");
String s4 = new String("abc");
```
用图来表示：

![68842064.jpg](https://i.loli.net/2018/11/06/5be18b4e3311c.jpg)

#### 2. ==、equals（）、hashCode（）

**==**
==运算符用于比较两个变量的值是否相等，即用于比较变量对应的内存中所存储的数值是否相同。

对于基本数据类型，==直接比较它们的值是否相同。

对于引用类型，==比较两个引用是否指向同一个对象（是否指向同一块存储空间）。

==不能够比较两个对象的内容是否相同。

**equals()**
equals() 是Object类提供的方法之一，每个Java类都继承自Object，所以每个类都有equals() 方法。Object类中的equals() 方法是直接使用**==**运算符来比较两个对象的，所以在没有覆盖euqals()的情况下，equals() 和"等等"运算符一样，比较的是引用。
```
Object类中的equals()方法
boolean equals(Object o){
	return this == o;
}
```
equals() 方法的特殊之处在于它可以被覆盖，可以通过覆盖的方法让他比较数据内容。例如String类的equals() 是比较堆里的内容是否相同。
```
我们创建Student类，学生用Id唯一标识一个学生，如果两个学生对象的Id一样，即就是同一个学生对象
class Student{
	int id;
	String name;
	@Override
	boolean equals(Object o){
		if(o == this){
			return true;
		}
		if(o instanceof Student){
			Student s = (Student)o;
			return this.id == s.id;
		}
		return false;
	}
}
```

**hashCode()**

以下内容来源于：[Java中hashCode的作用](https://github.com/helen-x/AndroidInterview/blob/master/java/%5BJava%5D%20Hashcode%E7%9A%84%E4%BD%9C%E7%94%A8.md)

1. hashCode的存在主要是用于查找的快捷性，如Hashtable，HashMap等，hashCode是用来在散列存储结构中确定对象的存储地址的；

2. 如果两个对象相同，就是适用于equals(Object) 方法，那么这两个对象的hashCode一定要相同；

3. 如果对象的equals方法被重写，那么对象的hashCode也尽量重写，并且产生hashCode使用的对象，一定要和equals方法中使用的一致，否则就会违反上面提到的第2点；

4. 两个对象的hashCode相同，并不一定表示两个对象就相同，也就是不一定适用于equals(Object) 方法，只能够说明这两个对象在散列存储结构中，如Hashtable，他们“存放在同一个篮子里”。

再归纳一下就是hashCode是用于查找使用的，而equals是用于比较两个对象的是否相等的。

总的来说，Java中的集合（Collection）有两类，一类 是List，再有一类是Set。前者集合内的元素是有序的，元素可以重复；后者元素无序，但元素不可重复。要想保证元素不重复，可两个元素是否重复应该依据什么来判断呢？这就是Object.equals方法了。但是，如果每增加一个元素就检查一 次，那么当元素很多时，后添加到集合中的元素比较的次数就非常多了。也就是说，如果集合中现在已经有1000个元素，那么第1001个元素加入集合时，它 就要调用1000次equals方法。这显然会大大降低效率。 于是，Java采用了哈希表的原理。哈希算法也称为散列算法，是 将数据依特定算法直接指定到一个地址上。这样一来，当集合要添加新的元素时，先调用这个元素的hashCode方法，就一下子能定位到它应该放置的物理位置上。如果这个位置上没有元素，它就可以 直接存储在这个位置上，不用再进行任何比较了；如果这个位置上已经有元素了，就调用它的equals方法与新元素进行比较，相同的话就不存了，不相同就散 列其它的地址。所以这里存在一个冲突解决的问题。这样一来实际调用equals方法的次数就大大降低了，几乎只需要一两次。 所以，Java对于eqauls方法和hashCode方法是这样规定的：

**1、如果两个对象相同，那么它们的hashCode值一定要相同； **　　
**2、如果两个对象的hashCode相同，它们并不一定相同**

#### 3. String，StringBuffer，StringBuilder和StringTokenizer

String是不可变类，String对象一旦被创建，其值就不能被修改。

StringBuffer是可变类，当一个字符串经常需要被修改时最好使用StringBuffer。如果使用String来保存一个经常被修改的字符串时，会比StringBuffer多很多附加操作，同时生成很多无用的对象，这些无用对象会被垃圾回收器回收，会影响程序的性能。

StringBuilder与StringBuffer类似，都是字符串缓冲区，但StringBuilder不是线程安全的，如果在单线程中使用字符串缓冲区，StringBuilder的效率更高；当有多个线程时，最好使用线程安全的StringBuffer。

StringTokenizer是用来分割字符串的工具类。默认的分隔符是“空格”、“制表符（\t）”、“换行符(\n)”、“回车符（\r）”。

#### 4. 数组

数组是对象，每个数组对象都有其对应的类型，可以同instanceof来判断数据的类型。

一维数组的申明方法：
- type[] arrayName  
- type arrayName[]

二维数组的申明方法：
- type[][] arrayName
- type arrayName[][]
- type[] arrayName[]

#### 5. Object类中的方法

| 方法     |     作用|
| :--------:| :------: |
| protected Object	clone()    |   创建并返回此对象的一个副本。 | 
| boolean	equals(Object obj) | 指示其他某个对象是否与此对象“相等”。|
|protected void	finalize()| 当垃圾回收器确定不存在对该对象的更多引用时，由对象的垃圾回收器调用此方法。|
|Class getClass()| 返回此 Object 的运行时类。|
| int	hashCode() | 返回该对象的哈希码值。|
|void	notify() | 唤醒在此对象监视器上等待的单个线程。|
|void	notifyAll() | 唤醒在此对象监视器上等待的所有线程。|
|String	toString() | 返回该对象的字符串表示。|
| void	wait() | 在其他线程调用此对象的 notify() 方法或 notifyAll() 方法前，导致当前线程等待。|
| void	wait(long timeout) | 在其他线程调用此对象的 notify() 方法或 notifyAll() 方法，或者超过指定的时间量前，导致当前线程等待。|
|void	wait(long timeout, int nanos) | 在其他线程调用此对象的 notify() 方法或 notifyAll() 方法，或者其他某个线程中断当前线程，或者已超过某个实际时间量前，导致当前线程等待。|



