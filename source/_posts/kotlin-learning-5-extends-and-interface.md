---
title: Kotlin 修炼手册（5）继承与接口
date: 2019-09-03 21:00
tags: ["Kotlin"]
categories: 技术
thumbnail: http://image.wufazhuce.com/Ftysoa87DRo7bDQJ5sYXQqqhvpm9
---

#### 前言

这篇的内容还是和类有关，介绍 Kotlin 中继承和接口。

#### 继承

Kotlin 中所有类都继承自 `Any` 类，是所有类的超类，类似于 Java 中的 `Object`。

Any 默认提供三个函数：

```
equals()
hashCode()
toString()
```

默认的类都是不可被继承的，类似于 Java 中的 `final` 类。

要让类可以被继承，需要加 `open` 关键字修饰。

```
open class Base{}
```

**构造函数**

如果子类有主构造函数，则基类必须在主构造函数中立即初始化。

```kotlin
open class Person(var name: String, var age: Int) {
    var mName = name
    var mAge = age
}

class Student(name: String, age: Int, var no: String, var score: Int) : Person(name, age) {
    var mNo = no
    var mScore = score
}

fun main(args: Array<String>) {
    val s = Student("Owen",23, "12138",100)
    println("学生名字：${s.mName}")
    println("学生年龄：${s.mAge}")
    println("学生学号：${s.mNo}")
    println("学生成绩：${s.mScore}")
}

// 运行结果
学生名字：Owen
学生年龄：23
学生学号：12138
学生成绩：100
```

如果子类没有主构造函数，则必须在每一个次级构造函数中需要使用 `super` 关键字调用基类的构造函数，或者使用 `this` 关键字调用子类另一个构造函数，初始化基类时，可以调用基类不同的构造函数。

```kotlin
open class Person(name: String) {
    var mName = name
    var mAge: Int = 0

    init {
        println("-----这是基类的主构造函数----")
    }

    constructor(name: String, age: Int) : this(name) {
        mAge = age
        println("-----这是基类的次级构造函数----")
    }
}

class Student : Person {
    var mNo: String = ""
    var mScore: Int = 0

    constructor(name: String, age: Int, no: String) : super(name, age) {
        mNo = no
        println("-----这是子类的三个参数的次级构造函数----")
    }

    constructor(name: String, age: Int, no: String, score: Int) : this(name, age, no) {
        mScore = score
        println("-----这是子类的四个参数的次级构造函数----")
    }
}

fun main(args: Array<String>) {
    val s = Student("Owen", 23, "70", 100)
    println("学生名字：${s.mName}")
    println("学生年龄：${s.mAge}")
    println("学生学号：${s.mNo}")
    println("学生成绩：${s.mScore}")
}
//运行结果
-----这是基类的主构造函数----
-----这是基类的次级构造函数----
-----这是子类的三个参数的次级构造函数----
-----这是子类的四个参数的次级构造函数----
学生名字：Owen
学生年龄：23
学生学号：70
学生成绩：100
```

**函数重写**

在基类中，函数默认为 `final` 修饰，不可被重写。如果允许子类重写，需要手动添加 `open` 关键字进行修饰，子类重写函数使用 `override` 关键字。

```kotlin
open class Person {
    open fun study() {
        println("我毕业了")
    }
}
class StudentA : Person() {
    override fun study() {
        println("我在读大学")
    }
}
fun main() {
    val s = Student()
    s.study() 
}
//输出结果
我在读大学
```

子类可以用一个函数重写父类和接口中的多个同名函数。如果要调用父类或接口的函数实现，需要用 `super` 关键字来显式调用。

```kotlin
open class A {
    open fun f() {
        println("A:f")
    }
}

interface B {
    fun f() {
        println("B:f")
    }
}

class C : A(), B {
    override fun f() {
        super<A>.f()  //调用父类A中f（）的实现，也可以选择不调用
        super<B>.f()  //调用接口B中f（）的实现，也可以选择不调用
        println("C:f")
    }
}

fun main() {
    val c = C()
    c.f()
}

//运行结果
A:f
B:f
C:f
```

**属性重写**

Kotlin 中支持对属性进行重写，属性重写用 `override` 关键字。基类中被重写的属性需要用 `open` 关键字修饰，不能为 private。

```kotlin
open class A {
    open var property: String = "a"
}

class B : A() {
    override var property: String = "b"
}

fun main() {
    val b = B()
    println(b.property)
}
//运行结果
b
```

可以使用一个 var 属性重写一个 val，但是反过来不行（可变比不可变的范围更大）。val 属性本身定义了 getter 方法，重写为 var 属性会在子类中额外声明一个 setter 方法。（机制类似于子类不能将 public 的方法重写为 private 的，范围不能缩小，只能变大）

可以在子类的主构造函数中使用 override 关键字作为属性声明的一部分。

```kotlin
interface Foo{
    val count :Int
}

class Bar1(override val count: Int):Foo{

}

class Bar2:Foo{
    override val count: Int = 0
        get() = field
}

fun main(){
    val bar1 = Bar1(4)
    println(bar1.count)
    val bar2 = Bar2()
    println(bar2.count)
}
```

子类继承父类时，不能有跟父类同名的变量，除非父类中该变量为 private，或者父类中该变量为 open 并且子类用 override 关键字重写。

#### Kotlin 接口

Kotlin 接口与 Java8 类似，使用 interface 关键字，允许方法有默认实现。

```kotlin
interface MyInterface {
    fun b()   //未实现
    fun f() { //已实现
        println("MyInterface:f")
    }
}
```

一个类可以实现一个或多个接口。多个接口中有同名方法时，和前面提到的类和接口中又同名方法的处理是一样的。

接口中的属性只能是抽象的，`不允许` 初始化值，接口不会保存属性值，实现接口时，`必须` 重写属性。

```kotlin
interface MyInterface {
    var name :String // 属性，抽象的
    fun b()
    fun f() {
        println("MyInterface:f")
    }
}

class Child : MyInterface {
    override var name: String = "owen"
    override fun b() {
        println("Child:b")
    }
}

fun main() {
    val c = Child()
    c.b()
    c.f()
    println(c.name)
}
```

#### 参考资料

[Kotlin 继承](https://www.runoob.com/kotlin/kotlin-extend.html)
[Kotlin 接口](https://www.runoob.com/kotlin/kotlin-interface.html)
[Kotlin——中级篇（四）：继承类详解](https://juejin.im/post/5a6303fb51882573467d0fbc)