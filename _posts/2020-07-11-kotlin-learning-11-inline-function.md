---
layout: post
title: Kotlin 修炼手册（11）内联函数
date: 2020-07-11 12:00
tags: ["Kotlin"]
categories: 技术
cover: http://image.wufazhuce.com/FtUNGXSiH-QMJI67gApJTELQOxZa
---

想理解内联函数这个概念，需要先了解下 Kotlin 高阶函数的实现原理。

Lambda 表达式在底层被转换成了匿名内部类的实现方式，每调用一次 Lambda 表达式，都会创建一个新的匿名类实例，就会造成额外的内存和性能开销。

为了解决这个问题，Kotlin 引入了内联函数，它可以消除使用 Lambda 表达式带来的运行时开销。

### inline

在定义高阶函数时，加上 `inline` 关键字，这个函数就是一个内联函数。Kotlin 编译器会将内联函数中的代码在编译时自动替换到调用它的地方，不会在运行时创建匿名类，也就不存在运行时的开销了。

看如下例子：

```kotlin
inline fun myFunc(a: Int, b: Int, operation: (Int, Int) -> Int): Int {
    val result = operation(a, b)
    return result
}

fun main(){
    val num1 = 1
    val num2 = 2
    val result = myFunc(num1, num2) {a, b ->
        a + b
    }
    println("result= $result")
}
// 执行结果
result= 3
```

首先，Kotlin 编译器会将 Lambda 表达式中代码替换到函数类型调用的地方，这一步替换后类似这样：

```kotlin
inline fun myFunc(a: Int, b: Int, operation: (Int, Int) -> Int): Int {
    val result = a + b  // Lambda表达式中内容替换到这
    return result
}

fun main(){
    val num1 = 1
    val num2 = 2
    val result = myFunc(num1, num2)
    println("result= $result")
}
```

然后将内联函数中的代码替换到函数调用的地方，替换后类似这样：

```kotlin
fun main(){
    val num1 = 1
    val num2 = 2
    val result = num1 + num2 // 替换到这里
    println("result= $result")
}
```

inline 函数的原理是将 Lambda 表达式中代码替换到被调用处，每调一次，该代码就会被复制一次，如果 Lambda 表达式中的代码量很大的话，会造成程序代码量的增加，是以目标代码的增加为代价来节省运行时开销的。

所以在 Lambda 表达式包含大量执行代码时，不应该使用内联函数，当 Lambda 表达式只包含非常简单的代码（特别是单表达式）时，应该使用内联函数。另外，inline 关键字只适合用来修饰高阶函数，普通函数使用 inline 关键字对性能的提升微乎其微，如果使用了 inline 关键字，编译还会提示将其移除。

比如下面这个 add 函数，使用 inline 关键字修饰：

```kotlin
inline fun add(a: Int, b: Int): Int {
    return a + b
}
```

编译器会给出这样的提示：

![image1](https://i.loli.net/2020/07/10/oSH3yt5s1BTUdPQ.png)

使用内联函数时，不能持有传入的函数类型参数对象的引用，也不能将传入的函数类型参数对象传递给另一个函数。如果这样做了，会提示非法使用内联参数。如果需要将函数参数传递，一种方法是这个高阶函数不要用 inline 修饰；另一种方式是使用 noinline 关键字修饰要传递的这个函数参数，使其不要内联。下面就来看看 noinline 的用法。

### noinline

如果一个高阶函数中有多个 Lambda，这个函数添加 inline 后，所有的 Lambda 表达式中的代码都会被替换到调用处。前面又提到如果 Lambda 表达式中代码很多的话不应该被替换，那么如何让多个 Lambda 中代码很多的 Lambda 不要被内联呢，就是使用 `noinline` 关键字。参考下面这个例子：

```kotlin
inline fun testInline(block1: ()-> Unit, noinline block2: () -> Unit) {
}
```

testInline 用 inline 修饰，block2 这个 Lambda 添加了noinline 修饰，就只有 block1 会被内联了，block2 不会。

### crossinline

上一篇函数进阶中，提到非内联函数的 Lambda 中不能使用 return，而 内联函数的 Lambda 表达式中可以使用 return，不过不用于返回 Lambda，而是返回 Lambda 所在的调用函数，这是因为内联函数的 Lambda 表达式中的代码会被替换到函数调用处。这样的 return 语句被称为 `非局部返回`。

内联和非局部返回其实是有冲突的，因为如果调用者在 Lambda 中使用了return，就会造成高阶函数Lambda表达式之后的代码无法执行，改变了函数的执行流程，所以需要一个方法在内联函数中禁用非局部返回。这个方法就是用 `crossinline` 来修饰函数类型的参数，这样 Lambda 表达式中如果使用了 return 来非局部返回，编译无法通过，但是可以使用 `return@高阶函数名` 进行局部返回。比如下面这个例子：

![image2](https://i.loli.net/2020/07/11/zjfdTh3NtHRCLPn.png)

用 crosssinline 修饰了 action 参数后，在 Lambda 表示式中使用 return 编译器报错，提示我们修改为 return@runAction 局部返回的方式。

### 小结

关于内联函数的知识，简单做个总结：

1. inline 关键字是用来优化 Lambda 表达式所带来的运行时开销的，只适合用来修饰高阶函数，不适合用来修饰普通函数。
2. 不要内联大型函数，适合 Lambda 表达式中代码简单的场景。
3. 使用 noinline 来局部内联，在多个函数参数情况下让其中某些不要内联。
4. 使用 crossinline 来禁止非局部返回，避免内联函数调用方的 Lambda 表达式中使用 return 改变代码执行流程。

### 参考资料

[Kotlin Vocabulary | 内联函数的原理与应用](https://mp.weixin.qq.com/s?__biz=MzAwODY4OTk2Mg==&mid=2652057080&idx=1&sn=37b9e577b3a06a6e02d0519aa9772898&chksm=808c8dbdb7fb04ab2f8f75db2ff688c296c766f93547513fc89b5fcbdadd156754ccda8deeec&scene=158#rd)

[Kotlin：你必须要知道的 inline-noinline-crossinline](https://mp.weixin.qq.com/s/HD_hqi8QCb6co7IaIh6KMg)

[重学 Kotlin —— inline，包治百病的性能良药？](https://juejin.im/post/5ef76248e51d4534780ae5ab)