---
layout: post
title: Kotlin 修炼手册（13）作用域函数
date: 2020-07-24 18:00
tags: ["Kotlin"]
categories: 技术
cover: https://s2.loli.net/2022/01/24/5ry3FnVveMxjCwN.jpg
---

这篇文章来介绍下 Kotlin 标准库中提供的作用域函数。它们的唯一目的是 **在对象的上下文中执行代码块**。当对一个对象调用这样的函数并提供一个 Lambda 表达式时，会形成一个临时作用域。在这个作用域中，可以不用通过对象名来访问该对象。共有以下五种：

- let
- with
- apply
- run
- also

先举个例子：

```kotlin

const val MALE = 0
const val FEMALE = 1

class Person {
    var name: String? = null
    var age: Int = 0
    var sex: Int = MALE
    override fun toString(): String {
        return "[name=$name, age=$age, sex=${if (sex == MALE) "MALE" else "FEMALE"}]"
    }
}

fun main() {
    val p = Person()
    p.name = "owen"
    p.age = 18
    p.sex = MALE
    println(p)

    val p2 = Person().apply { // 调用了 apply 函数
        name = "Tom"
        age = 23
        sex = FEMALE
    }
    println(p2)
}
// 运行结果
[name=owen, age=18, sex=MALE]
[name=Tom, age=23, sex=FEMALE]
```

从这个简单的例子可以看出使用作用域函数的优点：
1. 省略了 `变量名.`，在变量名较长且需要设置很多属性时，可以节省一些代码量。
2. 代码比较清晰，更有语义性，很容易看出 `{}` 中的代码是给这个变量设置的。

官方文档中也提到：

> 作用域函数没有引入任何新的技术，但是它们可以使你的代码更加简洁易读。

这五个作用域函数本质上非常相似，所以了解它们之间的区别很重要，每个作用域函数之间有两个主要区别：

- 引用上下文对象的方式（**it** or **this**）
- 返回值（**上下文对象** or **Lambda 表达式结果**）

先列一张表来有个更直观的感受：


| 作用域函数 | 引用上下文对象方式 | 返回值 | 是否是扩展函数 |
| --- | --- | --- | --- |
| run(拓展函数型) | this | Lambda 表达式结果 | 是 |
| run（非拓展函数型） | - | Lambda 表达式结果| 不是，调用无需上下文对象 |
| with | this | Lambda 表达式结果 | 不是，把上下文对象当作参数 |
| apply | this | 上下文对象 | 是 |
| let | it | Lambda 表达式结果 | 是
| also | it | 上下文对象 | 是 |

### 引用上下文对象方式

引用上下文对象的方式有两种，it 和 this。this 表示 Lambda 表达式的接受者，it 表示 Lambda 表达式的参数。它们的主要区别主要在于 this 在没有歧义的情况下可以省略，it 不能省略。

#### this

run、with 以及 apply 通过关键字 this 引用上下文对象。因此在 Lambda 表达式中可以像在普通的类函数中一样访问上下文对象。在大多数场景下，可以省略 this 来简化代码。因此，对于主要对上下文对象成员进行操作（调用对象的函数或者给对象属性赋值），建议将上下文对象作为接收者，即选用 run、with  或者 apply。

```kotlin
fun main() {
    val p = Person().apply {
        name = "owen"
        age = 18
        city = "上海"
    }
    println(p)

    val nextYearAge = Person().run {
        name = "tom"
        age = 22
        city = "北京"
        println(this)
        age + 1
    }
    println("nextYearAge = $nextYearAge")

    with(Person()) {
        name = "sam"
        age = 30
        city = "深圳"
        println(this)
    }
}
// 运行结果
Person(name=owen, age=18, city=上海)
Person(name=tom, age=22, city=北京)
nextYearAge = 23
Person(name=sam, age=30, city=深圳)
```

#### it

let 及 also 将上下文对象作为 Lambda 表达式参数。如果没有指定参数名，对象可以用隐式默认名称 it 访问。it 比 this 简短，带有 it 的表达式通常更容易阅读。然而，当调用对象函数或属性时，不能像 this 这样直接省略。因此，当上下文对象在 Lambda 中主要用作函数的 **参数** 时，使用 it 作为上下文对象会更好。若在代码块中使用多个变量，则 it 也更好。

```kotlin
const val MALE = 0
const val FEMALE = 1

class Person {
    var name: String? = null
    var age: Int = 0
    var sex: Int = MALE

    override fun toString(): String {
        return "[name=$name, age=$age, sex=${if (sex == MALE) "MALE" else "FEMALE"}]"
    }

    fun sayHi(){
        println("$name says Hi")
    }
}

fun main() {
    val p:Person? = Person()
    p?.let {
        it.name = "Owen"
        it.age = 15
        it.sex = MALE
        println(it)
    }

    Person().also {
        it.name = "Sam"
        println(it)
    }.sayHi()
}
// 运行结果
[name=Owen, age=15, sex=MALE]
[name=Sam, age=0, sex=MALE]
Sam says Hi
```

### 返回值

返回值也有两种，返回上下文对象本身，或者 Lambda 表达式的结果（Lambda 表达式最后一行的值）。

#### 上下文对象

apply 和 also 返回的是上下文对象本身，因此可以作为辅助步骤包含在调用链中：可以继续在同一个对象上进行链式函数调用。

例如：

```kotlin
fun main() {
    val list = mutableListOf<Int>()
    list.also {
        println("填充数据")
    }.apply {
        add(4)
        add(3)
        add(6)
    }.also {
        println("排序")
    }.sort()
    println(list)
}
// 运行结果
填充数据
排序
[3, 4, 6]
```

 #### Lambda 表达式结果
 
let、run 及 with 返回 lambda 表达式的结果。所以，在需要使用其结果给一个变量赋值，或者在需要对其结果进行链式操作等情况下，可以使用它们。

```kotlin
fun main() {
    val nums = mutableListOf("One", "Two", "Three")
    val count = nums.run {
        add("Four")
        add("Five")
        count {
            it.endsWith("e")
        }
    }
    println("以 e 结尾的单词数量是：$count")
}
```

下面来看下这几个函数典型用法：

### 典型使用场景

#### let

let 经常用来替代重复的 `?.`，对于一个可空变量，我们需要使用 ?. 来调用对应的函数，但每次安全调用就显得多余，也增加了不必要的非空判断，这时候就可以使用 `?.let` 在 Lambda 表达式中执行操作，在 Lambda 表达式中，变量就肯定不为空了。

如这个例子，p2 为空时，Lambda 表达式中的代码不会执行：

```kotlin
fun main() {
    val p:Person? = Person()
    p?.let {
        it.name = "Owen"
        it.age = 15
        it.sex = MALE
        println(it)
    }
    val p2: Person? = null
    p2?.let {
        it.name = "Tom"
        it.age = 22
        it.sex = FEMALE
        println(it)
    }
}
// 运行结果
[name=Owen, age=15, sex=MALE]
```


let 函数源码：

```kotlin
public inline fun <T, R> T.let(block: (T) -> R): R {
    return block(this)
}
```

#### with

with 不是一个拓展函数，它接收两个参数，第一个参数是上下文对象，第二个参数是 Lambda 表达式。可以理解为： 对于这个对象，执行以下操作。

with 函数源码：

```kotlin
public inline fun <T, R> with(receiver: T, block: T.() -> R): R {
    return receiver.block()
}
```

#### run

run 有两种用法，一种是作为拓展函数，常用在当 Lambda 表达式中同时包含对象初始化和返回值计算的场景。

拓展函数型 run 函数源码：

```kotlin
public inline fun <T, R> T.run(block: T.() -> R): R {
    return block()
}
```

另一种是类似于 with，用作非拓展函数，可以在需要表达式的地方执行一个由多个语句组成的代码块。

非拓展函数型 run 函数源码：

```kotlin
public inline fun <R> run(block: () -> R): R {
    return block()
}
```

#### apply

对于不返回值且主要在接收者（this）对象的成员上运行的代码块使用 apply。apply 的常见情况是对象配置。这样的调用可以理解为：将以下赋值操作应用于该对象。

apply 函数源码：

```kotlin
public inline fun <T> T.apply(block: T.() -> Unit): T {
    block()
    return this
}
```

#### also

also 对于执行一些将上下文对象作为参数的操作很有用。对于需要引用对象而不是其属性与函数的操作，请使用 also。可以理解为：并且用该对象执行以下操作（附加效果）。

also 函数源码：

```kotlin
public inline fun <T> T.also(block: (T) -> Unit): T {
    block(this)
    return this
}
```

### 其他标准函数

标准库中还提供了两个函数：takeIf 和 takeUnless，这两个函数可以**将对象的状态检查嵌入到调用链中**。

#### takeIf

takeIf 作用的对象如果满足 Lambda 表达式的结果，则返回这个对象，否则返回 null。

takeIf 函数源码：

```kotlin
public inline fun <T> T.takeIf(predicate: (T) -> Boolean): T? {
    return if (predicate(this)) this else null
}
```

#### takeUnless

takeUnless 和 takeIf 正好相反，当不满足条件时，返回对象，满足条件时，返回 null。

takeUnless 源码：

```kotlin
public inline fun <T> T.takeUnless(predicate: (T) -> Boolean): T? {
    return if (!predicate(this)) this else null
}
```

当在 takeIf 和 takeUnless 之后调用其他函数，需要进行空检查或者使用 `?.`，因为它们的返回值是可空的。

takeIf 及 takeUnless 与作用域函数一起特别好用，比如 在takeIf 或者 takeUnless 后接 let。

看如下例子对比：

```Kotlin
// 不使用 takeIf 和 let
fun displaySubstringPosition(input: String, sub: String) {
    val index = input.indexOf(sub)
    if (index >= 0) {
        println("在【$input】中找到了【$sub】")
        println("子串开始位置为：$index")
    }
}
fun main() {
    displaySubstringPosition("HelloWorld", "ll")
    displaySubstringPosition("HelloWorld", "lf")
}
// 运行结果
在【HelloWorld】中找到了【ll】
子串开始位置为：2
```

```kotlin
// 使用 takeIf 和 let
fun displaySubstringPosition2(input: String, sub: String) {
    input.indexOf(sub).takeIf { it >= 0 }?.let {
        println("在【$input】中找到了【$sub】")
        println("子串开始位置为：$it")
    }
}
fun main() {
    displaySubstringPosition2("HelloWorld", "ld")
    displaySubstringPosition2("HelloWorld", "lf")
}
// 运行结果
在【HelloWorld】中找到了【ld】
子串开始位置为：8
```

### 参考资料

[作用域函数](https://www.kotlincn.net/docs/reference/scope-functions.html)

[玩转kotlin的作用域函数](https://juejin.im/post/5d71d1ddf265da03a53a5a0f)

[《Android 第一行代码（第三版）》](https://www.ituring.com.cn/book/2744)

[疯狂 Kotlin 讲义](https://www.phei.com.cn/module/goods/wssd_content.jsp?bookid=51362)