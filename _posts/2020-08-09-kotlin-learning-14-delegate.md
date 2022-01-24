---
layout: post
title: Kotlin 修练手册（14）委托
date: 2020-08-09 10:00
tags: ["Kotlin"]
categories: 技术
cover: https://s2.loli.net/2022/01/24/E7hpQ89KdLOHawW.jpg
---

### 前言

这篇文章来记录下学习 Kotlin 中委托这部分知识的笔记。内容主要包含：

- 类委托
- 属性委托
- 标准委托函数

#### 什么是委托（Delegate）

先来谈谈什么是委托。委托，指的是委托模式，是软件设计模式中的一项基本技巧，是替代继承的一种很好的方式。委托模式中，有两个对象参与处理同一个请求，接受请求的对象将请求委托给另一个对象来处理。特点是接受请求的对象持有了真正处理请求的对象的引用。委托模式和 [代理模式](https://lixiaoyu.cc/2018/11/07/learn-design-pattern-12-proxy/) 结构很像。代理模式更注重过程，而委托模式更注重结果。

委托模式中有三种角色：

- 约束：形式是接口或抽象类，定义了需要被代理的业务，满足面向接口编程；
- 被委托者：真正的业务逻辑执行者；
- 委托者：负责对请求的接收，将约束定义的业务委托给具体的被委托者。

![image1](https://i.loli.net/2020/08/09/gky5JVu7OM1XEUY.png)

Kotlin 直接通过 **`by`** 关键字来支持委托模式，优雅简洁。

### 类委托

类委托就是说 **一个类中定义的方法实际是调用另一个类的对象的方法来实现的**。

下面以一个具体的例子来介绍下 Kotlin 中类委托的写法（该例子来自参考资料 2，清晰易懂）：

很多年轻人喜欢打英雄联盟，这个游戏是有等级划分的，对多数玩家来说想要上到钻石段位比较难，就随之诞生了游戏代练一职，帮玩家上分，这其中就体现了委托模式的思想，玩家委托代练打排位，玩家不关心代练打排位的过程，只关注最后是否成功晋级的结果。

首先我们定义一个约束，包含了需要委托的业务，这里的就是打排位和晋级。

```kotlin
// 接口：约束，定义了需要代理的逻辑
interface IGamePlayer {
    // 打排位赛
    fun rank()
    // 晋级
    fun update()
}
```

然后我们定义被委托者，也就是游戏代练。

```kotlin
// 被委托者（游戏代练）
class RealGamePlayer(val name: String) : IGamePlayer {

    override fun rank() {
        println("$name 打排位赛")
    }

    override fun update() {
        println("$name 晋级")
    }

}
```
上面代码中定义了 RealGamePlayer，有个属性是 name，同时实现了约束接口 IGamePlayer，并实现了接口中定义的业务方法。

接下来是委托者：

```kotlin
// 委托者
class DelegateGamePlayer(private val player: IGamePlayer) : IGamePlayer by player
```

可以看到，我们定义了一个 DelegateGamePlayer，同样实现了 IGamePlayer，并且通过构造函数传入了一个被委托对象 player。Kotlin 委托用 by 修饰，by 后面就是被委托的对象，可以是一个表达式，所以上例通过 `by player` 把 DelegateGamePlayer 的所有方法委托给了 player。

最后写一些测试代码：

```kotlin
fun main() {
    val realGamePlayer = RealGamePlayer("张三")
    val delegateGamePlayer = DelegateGamePlayer(realGamePlayer)
    delegateGamePlayer.rank()
    delegateGamePlayer.update()
}
// 运行结果
张三 打排位
张三 晋级
```

以上就是类委托的使用，两个对象参与处理一个请求，这个请求是约束中的定义的业务方法。委托类（DelegateGamePlayer）和被委托类（RealGamePlayer）都要实现约束接口（IGamePlayer）。

如果委托者中重写了约束中的方法实现，那么这个方法不会委托给被委托者。

我们修改一下 DelegateGamePlayer：

```kotlin
class DelegateGamePlayer(private val player: IGamePlayer) : IGamePlayer by player {
    override fun update() {
        println("玩家升级了")
    }
}

fun main() {
    val realGamePlayer = RealGamePlayer("张三")
    val delegateGamePlayer = DelegateGamePlayer(realGamePlayer)
    delegateGamePlayer.rank()
    delegateGamePlayer.update()
}

// 运行结果
张三 打排位赛
玩家升级了
```

### 属性委托

属性委托指的是一个类的某个属性值不是在类中直接进行定义，而是将其托付给一个代理类，从而实现对该类的属性统一管理。

属性委托的格式是：

```kotlin
val / var <属性名>: <类型> by <表达式>
```

- val / var：属性是可变还是只读
- 属性名：属性的名称
- 类型：属性的数据类型
- 表达式：委托代理类

前面提到，委托中有个角色是约束，里面定义了代理的业务。类委托中通常是个接口，那属性委托呢？其实也是有约束的，被代理的逻辑就是这个属性的 `getter / setter ` 方法，因此被委托类需要提供 `setValue/getValue` 的方法。如果是 val 属性，则只需要提供 `getValue`。

我们看一个示例：

```kotlin
class Test {
    // 属性委托
    var prop: String by Delegate()
}


class Delegate {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
        return "对象为：$thisRef，委托的属性为：$property"
    }

    operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {
        println("$value 被赋值给对象 $thisRef 的 $property 属性")
    }
}

fun main() {
    println(Test().prop)
    Test().prop = "Hello World"
}

// 运行结果
对象为：cc.lixiaoyu.hellokotlin.Test@1a93a7ca，委托的属性为：var cc.lixiaoyu.hellokotlin.Test.prop: kotlin.String

Hello World 被赋值给对象 cc.lixiaoyu.hellokotlin.Test@693fe6c9 的 var cc.lixiaoyu.hellokotlin.Test.prop: kotlin.String 属性
```

从上面的代码中可以看出一个属性委托的被委托类是怎么写的，下面来解释下 getValue 和 setValue 中出现的参数：

- **thisRef**：指的是这个属性所在的对象，必须和这个属性所在类的类型相同或者是它的父类。
- **property**：指的是这个属性，它的类型必须是 `KProperty<*>` 或者 `KProperty<*> 的父类`。

- **value**：指的是给属性赋的值，必须和属性的类型相同或者是属性类型的子类。

这样固定的写法，如果每次都要手写还是比较麻烦的，我们很自然能想到写一个接口，被代理类只需要实现这个接口就可以了。Kotlin 标注库中也确实提供了这样的接口：`ReadOnlyProperty` 和 `ReadWriteProperty`。

```kotlin
interface ReadOnlyProperty<in R, out T> {
    operator fun getValue(thisRef: R, property: KProperty<*>): T
}

interface ReadWriteProperty<in R, T> {
    operator fun getValue(thisRef: R, property: KProperty<*>): T
    operator fun setValue(thisRef: R, property: KProperty<*>, value: T)
}
```

被委托类实现其中一个接口就可以了，val 属性实现ReadOnlyProperty，var属性实现ReadWriteProperty。

上面的 Delegate 类可以改写成这样：

```kotlin
class Delegate : ReadWriteProperty<Any, String> {
    override fun getValue(thisRef: Any, property: KProperty<*>): String {
        return "对象为：$thisRef，委托的属性为：$property"
    }
    override fun setValue(thisRef: Any, property: KProperty<*>, value: String) {
        println("$value 被赋值给对象 $thisRef 的 $property 属性")
    }
}
```

### Kotlin 标准库中的委托

Kotlin 标准库中提供了几种委托，比如：

- 延迟属性（lazy properties）：属性的值只在首次访问时计算；
- 可观察属性（observable properties）：监听器会收到这个属性值变化的通知；
- 把属性存储在映射（map）中
- Not Null：用于无法在初始化时就确定属性值的情况

下面分别来看看：

#### 延迟属性 lazy

`lazy()` 接受一个 Lambda 并返回一个 `Lazy<T>` 实例的函数，返回的实例可以作为实现延迟属性的委托：第一次调用 get() 会执行已传递给 lazy() 的 Lambda 并记录结果， 后续调用 get() 只是返回记录的结果。

```kotlin
val lazyValue:String by lazy {
    println("computed") // 第一次调用执行，第二次调用不执行
    "Hello"
}

fun main() {
    println(lazyValue) // 第一次执行
    println(lazyValue) // 第二次执行
}

// 运行结果
computed
Hello
Hello
```

lazy 延迟初始化也可以接受参数，标准库中提供了下面三种：

```kotlin
public enum class LazyThreadSafetyMode {

    /**
     * 添加同步锁，使 lazy 延迟初始化线程安全
     */
    SYNCHRONIZED,

    /**
     * 初始化的 Lambda 表达式可以在同一时间被多次调用，但是只有第一个返回的值作为初始化的值
     */
    PUBLICATION,

    /**
     * 没有同步锁，多线程访问时候，初始化的值是未知的，非线程安全。
     * 一般情况下，不推荐使用这种方式，除非你能保证初始化和属性始终在同一个线程
     */
    NONE,
}
```

lazy 函数默认的模式是 LazyThreadSafetyMode.SYNCHRONIZED。

#### 可观察属性 observable

observable 可以用于实现观察者模式。`Delegates.observable()` 函数接受两个参数：第一个是 `初始值`，第二个是属性值变化事件的 `响应器（监听器）`。在属性赋值后会执行事件的响应器，它有三个参数：`被赋值的属性`、`旧值` 和 `新值`：

```kotlin
class User {
    var name : String by Delegates.observable("初始值") {
        property, oldValue, newValue ->
        println("属性是：$property，旧值是：$oldValue，新值是：$newValue")
    }
}

fun main() {
    val user = User()
    user.name = "第一次赋值"
    user.name = "第二次赋值"
}
// 运行结果
属性是：var cc.lixiaoyu.hellokotlin.User.name: kotlin.String，旧值是：初始值，新值是：第一次赋值
属性是：var cc.lixiaoyu.hellokotlin.User.name: kotlin.String，旧值是：第一次赋值，新值是：第二次赋值
```

#### vetoable

`vetoable` 和 observable 一样，可以观察属性值的变化，并且 vetoable 可以通过处理器函数来决定属性值是否生效。

我们声明一个 Int 类型的属性 vetoableValue，如果新值比旧值大，则赋值给属性，否则不赋值。

```kotlin
var vetoableValue: Int by Delegates.vetoable(0) { _, oldValue, newValue ->
    println("$oldValue -> $newValue")
    newValue > oldValue
}

fun main() {
    println("vetoableValue=$vetoableValue")
    vetoableValue = 10
    println("vetoableValue=$vetoableValue")
    vetoableValue = 5
    println("vetoableValue=$vetoableValue")
    vetoableValue = 20
    println("vetoableValue=$vetoableValue")
}

// 运行结果
vetoableValue=0
0 -> 10
vetoableValue=10
10 -> 5
vetoableValue=10 // 10 -> 5 的赋值没有生效
10 -> 20
vetoableValue=20
```

#### 属性存储在映射中

一个常见的用例是在一个映射（map）里存储属性的值。 这经常出现在像解析 JSON 或者做其他"动态"事情的应用中。 在这种情况下，你可以使用映射实例自身作为委托来实现委托属性。

比如下面这个例子：

```kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int by map
}
fun main() {
    val user = User(mapOf(
        "name" to "Owen",
        "age" to 18
    ))
    println("name=${user.name}, age=${user.age}")
}
// 运行结果
name=Owen, age=18
```

如果是 var 属性，需要把 Map 换成 MutableMap。

#### Not Null

`Delegates.notNull` 适用于那些无法在初始化阶段就确定属性值的场合。如果属性在赋值前被访问会抛出异常。

```kotlin
var notNullValue: String by Delegates.notNull()

fun main() {
    notNullValue = "hello"
    println(notNullValue)
}

// 运行结果
hello
```

### 参考资料

[kotlin 委托【菜鸟教程】](https://www.runoob.com/kotlin/kotlin-delegated.html)

[一文彻底搞懂 Kotlin 中的委托](https://juejin.im/post/5e1288d86fb9a048217a19d9)

[委托【Kotlin 中文站】](https://www.kotlincn.net/docs/reference/delegation.html)

[如何正确地使用 Kotlin 的属性代理](https://zhuanlan.zhihu.com/p/45040290)

