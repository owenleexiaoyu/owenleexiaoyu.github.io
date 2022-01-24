---
layout: post
title: Kotlin 修炼手册（10）高阶函数与 Lambda
date: 2020-07-05 20:00
tags: ["Kotlin"]
categories: 技术
cover: https://s2.loli.net/2022/01/24/sAWDn92G6mBHM3i.jpg
---

这篇文章来介绍一下函数的进阶知识。

包括以下内容：
1. 函数类型
2. 高阶函数
2. 局部函数
3. 匿名函数
5. Lambda表达式

### 函数类型

在 Kotlin 中，函数是一等公民，函数也有自己的类型。函数可以用来定义变量，可以作为函数的形参，还可以作为函数的返回值。

Kotlin 中每个函数都有自己特定的类型，函数的类型由`形参列表`，`->`，和`返回值类型`组成。


例如：

```kotlin
fun add(a: Int, b: Int) : Int{
    return a + b
}
```

上面这个函数的类型是：`(Int, Int) -> Int`

```kotlin
fun print(str: String) : Unit{
    println(str)
}
```

上面这个函数的类型是：`(String) -> Unit` 或 `(String)`（返回值为 Unit 时，可以省略）

#### 使用函数定义变量

```kotlin
fun add(a: Int, b: Int): Int {
    return a + b
}

fun time(a: Int, b: Int): Int {
    return a * b
}

fun main() {
    // 定义一个变量，类型是函数类型
    var myFunc: (Int, Int) -> Int
    // 把add函数赋值给myFunc变量
    myFunc = ::add
    println("add():${myFunc(1, 2)}")
    // 把time函数赋值给myFunc变量
    myFunc = ::time
    println("time():${myFunc(1, 2)}")
}
// 运行结果
add():3
time():2
```

上述代码中先后使用了 `::` 将 add 和time 函数赋值给 myFunc 变量，只要函数的类型和变量的类型一致，就可以赋值成功。

什么是 `::` 呢，它被称为函数引用（Function Reference），在函数名前添加 `::`，就不表示这个函数本身，而是变成 **这个函数类型的一个对象**，这个对象和函数拥有同样的功能。

> Kotlin 里「函数可以作为参数」这件事的本质，是函数在 Kotlin 里可以作为对象存在——因为只有对象才能被作为参数传递啊。赋值也是一样道理，只有对象才能被赋值给变量啊。但 Kotlin 的函数本身的性质又决定了它没办法被当做一个对象。那怎么办呢？Kotlin 的选择是，那就创建一个和函数具有相同功能的对象。怎么创建？使用双冒号。(from 扔物线)

#### 函数作为形参

有时定义函数，部分逻辑不确定，希望动态传入这个处理逻辑，这时就可以定义函数类型作为形参。这样就可以在调用这个函数的时候传入不同的函数，执行不同的逻辑。

```kotlin
// 函数第二个参数是(Int) -> Int的函数类型
fun map(data: Array<Int>, fn: (Int) -> Int): Array<Int> {
    var result = Array<Int>(data.size, { 0 })
    for (i in data.indices) {
	    // 将数组中每个元素作为fn的参数，得到对应的返回值
        result[i] = fn(data[i])
    }
    return result
}

// 定义两个具体函数
fun squre(n: Int): Int {
    return n * n
}
fun cube(n: Int): Int {
    return n * n * n
}

fun main() {
    println("原数组：")
    val a = arrayOf(1, 2, 3, 4)
    println(a.contentToString())
    println("对元素调用squre()")
    println(map(a, ::squre).contentToString())
    println("对元素调用cube()")
    println(map(a, ::cube).contentToString())
}
// 运行结果
原数组：
[1, 2, 3, 4]
对元素调用squre()
[1, 4, 9, 16]
对元素调用cube()
[1, 8, 27, 64]
```

#### 函数作为返回值

Kotlin 中可以将其他函数作为函数的返回值。

```kotlin
// 定义三个函数
fun squre(n: Int): Int {
    return n * n
}
fun cube(n: Int): Int {
    return n * n * n
}
fun add(n: Int): Int {
    return n + 1
}

// 根据不同的 type 返回不同的函数
fun getFunc(type: String): (Int) -> Int {
    return when (type) {
        "squre" -> ::squre
        "cube" -> ::cube
        else -> ::add
    }
}

fun main() {
    var myFunc = getFunc("cube")
    println(myFunc(3))
}
// 运行结果
27
```

### 高阶函数

类似于上面示例中的 map、getFunc 这种函数，它接受一个函数类型作为参数，或者返回值的类型是一个函数类型，就被称为高阶函数。高阶函数和普通函数其实没有任何区别，它的特点在于允许让函数类型的参数来决定函数的执行逻辑。

### 局部函数

除了在 top-level（kotlin 文件中）、类中定义函数，Kotlin 还可以在函数内部定义函数，这种函数被称为局部函数（类似局部变量）。

默认情况下，局部函数对外部是隐藏的，局部函数只能在其封闭（enclosing）函数内被调用。这个封闭函数也可以返回局部函数，以便在其他作用域中调用。

示例：

```kotlin
fun getFunc(type: String): (Int) -> Int {
	// 在函数内定义三个函数
	fun squre(n: Int): Int {
	    return n * n
	}
	fun cube(n: Int): Int {
	    return n * n * n
	}
	fun add(n: Int): Int {
	    return n + 1
	}
	// 根据不同的type返回不同的函数
    return when (type) {
        "squre" -> ::squre
        "cube" -> ::cube
        else -> ::add
    }
}

fun main() {
    var myFunc = getFunc("cube")
    println(myFunc(3))
}
// 运行结果
27
```

#### 匿名函数

传一个函数类型的参数、或者把一个函数类型的对象赋值给变量，除了使用 `::`，还可以直接写这个函数，上面getFunc可以改写成：

```kotlin
fun getFunc(type: String): (Int) -> Int {
    // 根据不同的type返回不同的函数
    return when (type) {
        "squre" -> fun squre(n: Int): Int {
            return n * n
        }
        "cube" -> fun cube(n: Int): Int {
            return n * n * n
        }
        else -> fun add(n: Int): Int {
            return n + 1
        }
    }
}

fun main() {
    var myFunc = getFunc("squre")
    println(myFunc(3))
}
// 运行结果
9
```

这样写的话，函数名就没有用了，所以可以将函数名省略：

```kotlin
fun getFunc(type: String): (Int) -> Int {
    // 根据不同的 type 返回不同的函数
    return when (type) {
        "squre" -> fun(n: Int): Int {
            return n * n
        }
        "cube" -> fun(n: Int): Int {
            return n * n * n
        }
        else -> fun(n: Int): Int {
            return n + 1
        }
    }
}

fun main() {
    var myFunc = getFunc("squre")
    println(myFunc(3))
}
// 运行结果
9
```
Kotlin 的匿名函数本质上不是函数，而是个**对象**，一个**函数类型的对象**。它和双冒号加函数名是一类东西，和函数不是。


### Lambda 表达式

除了使用匿名函数，也可以使用 Lambda 表达式来代替。

Lambda 表达式，是函数式编程思想的代表，我们先来了解下函数式编程的相关概念，再来看 Kotlin 中 Lambda 表达式的语法。

#### 函数式编程

函数式编程是一种编程典范，和数学中函数的概念一致，避免使用程序状态和易变对象。函数式编程的特点有：

1. 函数是“第一等公民”

是指函数和其他数据类型处于平等地位，不仅有传统函数的使用方式，还可以将作为变量赋值，作为函数的形参，作为函数的返回值。函数可以作为参数进行传递，意味着可以把处理逻辑参数化，从外界传入，让程序更灵活。

2. 没有副作用

副作用是指函数内部和外部的互动（引用外界变量的值，修改外界变量的值）。函数式编程要求函数保持独立，尤其不能修改外部变量的值。

3. 引用透明

函数的运行不依赖于外部变量或"状态"，只依赖于输入的参数，任何时候只要参数相同，引用函数所得到的返回值总是相同的。这里强调了一点：`输入不变则输出也不变`，就像数学函数里面的 y=f(x),只要输入的 x 一样，那 y 肯定也是一样的。

#### Kotlin 中的 Lambda 表达式

Kotlin 中 Lambda 表达式的语法结构如下：

```
{ (形参列表) ->
	// 零条到多条表达式语句
}
```

Lambda 表达式，表现上是一种有输入输出的代码块，本质上和匿名函数一样，是一个**函数类型的对象**。Lambda 表达式有以下几点特性：

1. Lambda 表达式总是被大括号包裹着，由形参列表（可以为空），->，执行体组成。
2. 定义 Lambda 表达式不需要 fun 关键字，也不要指定函数名（因为它不是函数）

下面以 Android 中大家都比较熟悉的点击事件 setOnClickListener 为例来一步步介绍 Lambda 表达式的更多特性：

首先在 Kotlin 中我们不用使用接口了，而是可以直接使用函数类型来定义点击事件：

```kotlin
class View {
    lateinit var onClick: (View)-> Unit
    // 接收一个(View) -> Unit类型的参数
    fun setOnClickListener(onClick: (View) -> Unit) {
        this.onClick = onClick
    }
}
fun main(){
    val v = View()
    v.setOnClickListener({view: View ->
        println("click view")
        view.setVisibility(GONE)
    })
    v.onClick(v)
}
// 执行结果
click view
```

其中使用Lambda部分是这样的：

```kotlin
v.setOnClickListener({ view: View ->
    println("click view")
    view.setVisibility(GONE)
})
```

如果 Lambda 是函数的最后一个参数，可以把 Lambda 写在括号外面（括号后面）：

```kotlin
v.setOnClickListener(){ view: View ->
    println("click view")
    view.setVisibility(GONE)
}
```

如果 Lambda 是函数唯一的参数，可以将括号去掉：

```kotlin
v.setOnClickListener { view: View ->
    println("click view")
    view.setVisibility(GONE)
}
```

如果 Lambda 只有一个参数时，Kotlin 允许省略形参名，直接用 `it` 代替，此时 -> 也不需要了：

```kotlin
v.setOnClickListener {
    println("click view")
    it.setVisibility(GONE)
}
```
如果 Lambda 参数的类型可以通过上下文推断出来，则可以省略参数类型；如果 Lambda 有多个参数，其中某个参数没有使用，可以使用 `_` 代替：

```kotlin
fun myfunc(block: (a: String, b: Int) -> Unit) {
    block("owen", 1)
}
fun main() {
    myfunc { a, _ ->
        println(a)
    }
}
```

当一个函数既有有可变长参数和函数参数时，应该将函数参数放在最后一个，这样 Lambda 表达式移到括号外面，就可以不用使用命名参数了。

Lambda 执行体中最后一行代码的值会自动作为 Lambda 表达式的返回值，不需要使用 return 关键字。所以通常的高阶函数（非内联）中的lambda是不允许有return。使用 inline 关键字修饰的高阶函数在 Lambda 表达式中可以使用 return，但是它不是返回 Lambda 表达式，而是返回它所在的函数，这样的 return 语句被称为 **非局部返回**。而匿名函数的 return 用于返回该函数本身。

```kotlin
// Lambda
fun main(){
    val list = listOf<Int>(1, 3, 5, 7, 9)
    list.forEach { 
        println("item is: $it")
        return
    }
}
// 执行结果
item is : 1
```

```kotlin
// 匿名函数
fun main(){
    val list = listOf<Int>(1, 3, 5, 7, 9)
    list.forEach(fun(i): Unit {
        println("item is : $i")
        return
    })
}
// 执行结果
item is : 1
item is : 3
item is : 5
item is : 7
item is : 9
```

上述例子可以看出，Lambda 中的 return 用来返回了它所在的函数（main），所以程序直接结束，只能打印出第一个 item。（forEach函数是内联函数）

如果想要在 Lambda 表达式中使用 return 并达到和匿名函数一样的效果，可以使用限定返回的语法：

```kotlin
// Lambda
fun main(){
    val list = listOf<Int>(1, 3, 5, 7, 9)
    list.forEach { 
        println("item is: $it")
        // 限定返回，此时 return 只是返回传给 forEach 函数的 Lambda 表达式
        return@forEach
    }
}
// 执行结果
item is : 1
item is : 3
item is : 5
item is : 7
item is : 9
```

关于 Kotlin 中的函数类型、高阶函数、Lambda 表达式，就简单写到这里，还有一部分关于内联函数的内容和 Lambda 联系也比较紧密，会在下篇文章进行介绍。

### 参考资料

[Kotlin 的 Lambda 表达式，大多数人学得连皮毛都不算](https://kaixue.io/kotlin-lambda/)

[聊聊 Java 8 Lambda 表达式](https://www.cnblogs.com/linlinismine/p/9283532.html)

[《Android 第一行代码（第三版）》](https://www.ituring.com.cn/book/2744)

[疯狂 Kotlin 讲义](https://www.phei.com.cn/module/goods/wssd_content.jsp?bookid=51362)
