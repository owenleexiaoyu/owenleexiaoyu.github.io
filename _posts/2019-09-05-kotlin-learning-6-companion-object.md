---
layout: post
title: Kotlin 修炼手册（6）伴生对象
date: 2019-09-05 21:00
tags: ["Kotlin"]
categories: 技术
cover: http://image.wufazhuce.com/FhlqOmGFxCVM6gMHrKIK4vswcEJ2
---

#### 前言

这篇文章来写一下 Kotlin 中的伴生对象。

#### 从静态说起

之前的文章中，提到在 Java 中，使用 `static` 这个关键字来表示在类层面的变量和方法，比如：

```java
class HttpUtils{
	public static final String URL = "http://www.baidu.com";
	public static String getHttpResponse(){
		//实现
	}
}
```
在 Kotlin 中没有 `static` 这个关键字，也去掉了直接的静态变量和静态方法的概念，而是使用`伴生对象（companion object）`来实现静态，比如：

```kotlin
class HttpUtils{
	companion object{
		const val url = "http://www.baidu.com""
		fun getHttpResponse():String{
			//实现
		}
	}
}
```

这里有一些关键字：companion、object、const，分别来看看，先来介绍下 `object`。

#### object 关键字

在 Kotlin 中没有大写的 Object 类，代替它的是 `Any` 这个类，意思都是所有类的父类。小写的 object 是一个关键字，代表的意思是：创建一个类，同时生成一个这个类的对象。

```
object Test{
	val name = "owen"
	fun printName(){
		println(name)
	}
}

fun main(){
	Test.printName()
	println(Test.name)
}
```
调用的时候就直接使用 `类名.函数/属性` 即可。

> 注意在 Java 代码中调用这个函数的写法：

```java
Test.INSTANCE.printName();
```

需要加一个 `INSTANCE` 来进行调用，这其实就是 Kotlin 中单例模式的一种实现。（饿汉式单例，且线程安全）

如果想要实现在 Java 中像 Kotlin 一样直接使用类名调用的话，需要在函数上方加一个 `@JvmStatic` 注解。

```
object Test{
    val name = "owen"
    @JvmStatic
    fun printName(){
        println(name)
    }
}
```

Java 代码中调用：

```java
Test.printName();
```

**继承其他类和实现接口**

用 object 创建的类同样可以继承其他类，实现接口，和 class 是一样的。

```kotlin
open class PersonA{
    open fun say(){
        println("Person:say")
    }
}
interface MyInterface{
    fun foo()
}
object Test: PersonA(),MyInterface{
    override fun foo() {
        println("Test:foo")
    }
    override fun say() {
        println("Test:say")
    }
}
```

object 可以理解为在用 class 关键字来定义类的基础上，额外实现了单例。

**object 实现匿名内部类**

在之前《类与对象》一章中也提到 object 关键字可以用来实现匿名内部类。

```
class Button{
    var text = "文字"
    fun setOnClickListener(listener: OnClickListener){
        listener.onClick()
    }
}

/**
 * 定义接口
 */
interface OnClickListener {
    fun onClick()
}

fun main(){
	var button = Button()
    button.setOnClickListener(object : OnClickListener{
        override fun onClick() {
            println("点击了button")
        }
    })
}
```

#### 伴生对象（companion object）

object 中的属性和函数都可以看作静态的（事实上函数并不是静态的，只是可以通过单例进行调用，除非加 @JvmStatic 注解）。为了实现类中部分属性和方法是静态，Kotlin 中允许在类中增加一个伴生对象，用来专门存放静态属性和函数。这个伴生对象是和外部类绑定的，并且最多只能有一个（嵌套类可以有多个）。

完整的写法应该是这样：

```kotlin
class A{
	companion object B{
		val p = 0
		val foo(){}
	}
}
//要用属性和函数时，这样写：
A.B.p
A.B.foo()
//或者直接省略ojbect的类名
A.p
A.foo()
```

在写伴生对象时，类名也可以直接省略。

```
class A{
	companion object{  //类名B省略
		const val p = 0
		val foo(){}
	}
}
```

在 Kotlin 中，使用 `const` 来表示常量，只能用来修饰 val，不能修饰 var。

#### 结语

下一篇是关于 Kotlin 的扩展的相关内容。

#### 参考资料

[Kotlin 里那些「不是那么写的」](https://kaixue.io/kotlin-basic-2/)