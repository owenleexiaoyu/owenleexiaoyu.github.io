---
layout: post
title: Kotlin 修炼手册（3）分支、循环、关键字
date: 2019-08-30 16:00
tags: ["Kotlin"]
categories: 技术
cover: http://image.wufazhuce.com/Fihwff2hBN2dbFs52li2KFIojrwz
---

#### 前言

这篇主要记一下 Kotlin 中的分支（条件判断）、循环以及常用的一些关键字。

#### 分支

**if-else**

if-else 结构的用法大体上和 Java 一致，比如：

```kotlin
fun main() {
    val score = 50
    if (score < 0) {
        println("分数不符合，应该为非负数")
    } else if (score < 60) {
        println("不及格")
    } else if (score < 80) {
        println("及格")
    } else if (score < 90) {
        println("良好")
    } else if (score < 101) {
        println("优秀")
    } else {
        println("分数不符合，最大为100")
    }
}
```

同时 `if-else` 结构可以作为表达式，作用类似于  Java 中的 `?:`。

```kotlin
// 当满足if中的条件时c的值是a，否则c的值是b
val c = if(condition) a else b
```

**when**

Kotlin 中用 `when` 关键字代替了 Java 中的 `switch`，但用法类似。when 中，`else` 类比于 switch 中的 `default`，当其他分支不匹配时走 else。如果很多分支需要用相同的方式处理，则可以把多个分支条件放在一起，用 `,` 分隔。

```kotlin
fun main() {
    val x = 'd'
    when(x){
        'a' -> println("x = a")
        'b' -> println("x = b")
        'C','c' -> println("x = C or c")
        else -> println("x is others")
    }
}
// 运行结果
x is others
```

Kotlin 中相当于默认加上 break，由上往下依次对照case，如果符合条件，则执行对应的语句，之后的分支不会继续走。

```kotlin
fun main() {
    val x = 5
    when (x) {
        in 1..10 -> print("x is in 1 to 10")
        !in 10..20 -> print("x is not in 10 to 20")
        else -> print("none of the above")
    }
}
// 运行结果
x is in 1 to 10
```

可以看到，x 虽然同时满足 `in 1..10` 和 `!in 10..20` 两个条件，但是只会走第一条分支。

同时，和 if-else 结构一样，when 也可以作为表达式，如果作为表达式，`最先` 符合条件的分支的值就是整个表达式的值。

```kotlin
fun main() {
    val x = 5
    val c = when (x) {
        0 -> "x = 0"
        1 -> "x = 1"
        else -> "x = else"
    }
    println(c)
}
//运行结果
x = else
```

when 可以用来取代 `if-else if` 链，如果不提供参数，所有的分支条件都是简单的布尔表达式，而当一个分支的条件为真时则执行该分支：

之前 if-else 结构的例子可以用 when 来改写：

```kotlin
fun main() {
    val score = 50
    when{
        score < 0 -> println("分数不符合，应该为非负数")
        score < 60 -> println("不及格")
        score < 80 -> println("及格")
        score < 90 -> println("良好")
        score < 101 -> println("优秀")
        else -> println("分数不符合，最大为100")
    }
}
//运行结果
不及格
```

#### 循环

Kotlin 中，`for` 循环可以对任何提供迭代器的对象进行遍历。通常使用 `in` 关键字表示在某一个区间或某一集合中。

```kotlin
fun main() {
    val arr = arrayOf("one", "two", "three")
    for (a in arr){
        println(a)
    }
}
// 运行结果
one
two
three
```

> 可以看到，表示当前元素的变量 a，不用显式申明类型

如果想通过索引（下标）遍历一个数组或 list 时，可以使用 `indices` 变量来获得索引：

```kotlin
fun main() {
    val array = arrayOf("one", "two", "three")
    for (i in array.indices){
        println(array[i])
    }
}
```

或者使用 `withIndex()` 方法，同时获得下标和值。

```
fun main(){
    val array = arrayOf("apple", "banana", "orange")
    for ((index, value) in array.withIndex()) {
        println("the element at $index is $value")
    }
}
//输出结果
the element at 0 is apple
the element at 1 is banana
the element at 2 is orange
```

Kotlin 中的 `while` 和 `do-while` 的用法和 Java 中一样，看两个例子理解一下。

```
fun main() {
    var i = 0
    while(i < 5){
        print("$i ")
        i++
    }
}
//运行结果
0 1 2 3 4 

fun main() {
    var i = 0
    do {
        print("$i ")
        i++
    }while (i < 5)
}
//运行结果
0 1 2 3 4 
```

#### 常用关键字

在分支和循环部分，提到了一些关键字或符号，但没有专门解释过。这部分就来讲讲一些常用的关键字。

`in`：表示在一个区间或集合内（数组、list、set 等）
`!in`：和 in 正好相反，表示不在该范围中
`a..b`：表示闭区间 [a,b]，其中 a <= b
`until`：a until b 表示左闭右开区间 [a,b)，其中 a <= b

```kotlin
fun main() {
    for (i in 1..10) {
        print("$i ")
    }
}
//运行结果
1 2 3 4 5 6 7 8 9 10 
```

```kotlin
fun main() {
    for (i in 1 until 10){
        print("$i ")
    }
}
//运行结果
1 2 3 4 5 6 7 8 9 
```

`step`：步长，循环时的间隔

```kotlin
fun main() {
    for (i in 1 until 10 step 2){
        print("$i ")
    }
}
//运行结果
1 3 5 7 9 
```

downTo：a downTo b 表示从大到小递减的闭区间 [a, b]，a >= b

```kotlin
fun main() {
    for (i in 10 downTo 2 step 2){
        print("$i ")
    }
}
//运行结果
10 8 6 4 2 
```

`is`：是否是某一个类型，类似于 Java 中的 `instanceof` 关键字

并且 Kotlin 中会进行智能类型转换，如果是某一个类型，就会自动转换成该类型，不用显式类型转换。

举个例子：

实现一个将字符串转化为大写，但是参数是Object（Kotlin 中为 Any）类型，不能直接调用方法，需要先进行类型判断。Java 中的实现：

```java
public class TestJava {
    public static void stringToUpperCase(Object o){
        if(o instanceof String){
            System.out.println(((String) o).toUpperCase());
        } else {
            System.out.println("不是String类型");
        }
    }
    public static void main(String[] args) {
        stringToUpperCase("hello");
        stringToUpperCase(1);
    }
}
//运行结果
HELLO
不是String类型
```

Kotin 的实现：

```kotlin
fun stringToUpperCase(o : Any){
    if(o is String){
        println(o.toUpperCase())
    }else{
        println("不是String类型")
    }
}
fun main() {
    stringToUpperCase("hello")
    stringToUpperCase(1)
}
//运行结果
HELLO
不是String类型
```

两者的不同的在于 Java 在是 String 类型时，要使用 `((String) o)` 进行强制类型转换，而 Kotlin 已经直接帮我们转换了，写起来更加简洁。

#### 结语

关于 Kotlin 中分支、循环、常用关键字就先写到这里，下一篇将介绍 Kotlin 中的类与对象。

#### 参考资料

[Kotlin 条件控制](https://www.runoob.com/kotlin/kotlin-condition-control.html)
[Kotlin 循环控制](https://www.runoob.com/kotlin/kotlin-loop-control.html)