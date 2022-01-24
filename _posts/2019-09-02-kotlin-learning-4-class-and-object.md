---
layout: post
title: Kotlin 修炼手册（4）类与对象
date: 2019-09-02 19:00
tags: ["Kotlin"]
categories: 技术
cover: https://s2.loli.net/2022/01/24/v7p8ZrGhoELSMFe.jpg
---

#### 前言

在面向对象编程中，类与对象是非常重要的概念，这篇文章来写一下 Kotlin 中的类与对象。

#### 类的定义与对象声明

Kotlin 中使用 `class` 关键字来定义类。

```kotlin
class Person{}

//如果是空类，可以这样写：
class Person
```

在声明一个对象时，对比 Java，Kotlin 中省略了 new 这个关键字。

```
val p = Person()
```

#### 类的属性和函数

类的属性可以用 var 或 val 来声明，var 可变，val 不可变。要使用一个属性，直接用名称来引用它。

```kotlin
class Person{
	var name: String
	var age: Int

	fun say(){
		println("hello")
	}
}
 
fun main(){
	val p = Person()
	println(p.name + p.age) //使用.来引用
	p.say()  
}
```

Kotlin 中函数的参数不能用 var 和 val 来修饰，但默认是 `val` 的，保证了参数不可被修改。

**getter 和 setter**

Java 中一般将变量定义为 private，搭配 public 的 getter 和 setter 方法，比如这样：

```
class Person{
	private String name;
	public String getName(){
		return name;
	}
	public void setName(String name){
		this.name = name;
	}
}
```

Kotlin 中默认为我们实现了 getter 和 setter 方法，val  声明的变量只有 getter，没有 setter，因为它是只读的。

可以自定义属性的 getter 和 setter 方法，进行一些额外的处理：

```kotlin
class Person {
    var name: String = ""
        get() {
            return field.toUpperCase()
        }
        set  // 直接写set或者省略都使用默认的

    var age: Int = 0
        get() = field   //这里也可以写get、或者省略不谢
        set(value) {   //value的类型一定是和属性一致，所以这里可以省略类型
            if (value < 0) {
                field = 0
            } else {
                field = value
            }
        }
}

fun main() {
    val p = Person()
    p.name = "tom"
    p.age = -1
    println("name = ${p.name}")
    println("age = ${p.age}")
}
```

上面例子中有一个关键字 `field`，这是Kotlin中的后端变量（Backing Fields），可以简单理解为当前这个属性的备用名，用于在 getter 和 setter 方法中指代该属性。

为什么不能用属性的名称而要用一个备用名呢？这是因为在 Kotlin 中，一遇到`属性赋值`就会转化成 setter 函数，一遇到`属性的引用`就会转化成 getter 函数，从而形成递归，最终因为内存溢出而造成程序崩溃。

详细可以查看这篇文章的评论部分，有非常详尽的解释：[Kotlin 类和对象](https://www.runoob.com/kotlin/kotlin-class-object.html)

#### 构造器

我们先来看看 Java 中的构造函数。

```java
public class ClassA {
    private String name;
    private int age;

    public ClassA(){
        this("",0);
    }

    public ClassA(String name){
        this(name,0);
    }

    public ClassA(String name, int age){
        this.name = name;
        this.age = age;
    }
}
```

可以看到，Java 中的构造函数是一种特殊的成员函数，没有返回值，一般为 public，在不写构造函数的时候编译器会自动生成一个无参空实现的构造函数，可以重载。

在 Kotlin 中，有主构造器和次级构造器之分，使用 `constructor` 关键字表示。不用 public 修饰符，默认是公开的。

**主构造器**

主构造器写在类的声明中，如果主构造器没有任何注解和修饰符，可以不加 constructor 关键字。主构造器中的参数可以在 `init` 代码块中被访问。还可以加上 var 或 val 来直接将参数声明成类的属性。

```kotlin
class Person constructor(name: String) {  //constructor可省略
    val name: String
    init {
        this.name = name
        println("constructor")
    }
}
fun main() {
    val p = Person("tt")
    println("name = ${p.name}")
}
//运行结果
name = tt
```

在 init 代码块中，可以进行属性的赋值和执行初始化代码。

也可以写成下面这样，意思是一样的。

```kotlin
class Person(val name: String) {}
fun main() {
    val p = Person("tt")
    println("name = ${p.name}")
}
//运行结果
name = tt
```

可以看到和 Java 的对比，Kotlin 是将一个构造函数拆开了，参数部分写在类头，函数体部分写在了 init 代码块中。

**次级构造器**

主构造器和次级构造器之间并没有什么本质区别，只是主构造器中的参数列表是最常用的。

次级构造器必须加上 constructor 关键字，而且必须使用 `this` 关键字显式调用主构造器。看下面这个例子：

```kotlin
class Person constructor(name: String) {
    val name: String
    init {
        this.name = name
        println("主构造器调用")
    }

    constructor():this("owen"){
        println("次级构造器调用")
    }
}
fun main() {
    val p = Person()
    println("name = ${p.name}")
}
//运行结果
主构造器调用
次级构造器调用
name = owen
```

如果没有调用主构造器，编译器会直接报错：

![img1](https://i.loli.net/2019/09/02/i2nwvzSx3RFXEVm.png)

#### 其他类

**抽象类**

抽象类的概念和 Java 中一致。如果一个类中有一个或多个抽象方法，那这个类就要被定义成抽象的，使用 `abstract` 关键字进行修饰。

```kotlin
abstract class A{
    abstract fun foo()

    fun foo2(){
        println("hello")
    }
}
```

**嵌套类**

可以把一个类定义在另一个类中，通常这两个类之间有一定业务上的联系。

```kotlin
class Outter{
    val age = 0
    class Nested{
        val name = "tom"
    }
}

fun main() {
    val n = Outter.Nested()
    println(n.name)
}
```

**内部类**

Kotlin 中内部类使用 `inner` 关键字表示，内部类持有一个外部类对象，所以可以访问外部类的属性和函数（即使是 private 的）。

```
class Outter{
    val age = 0
    inner class Inner{
        val name = "tom"

        fun say(){
            println("外部类age=$age")
        }
    }
}

fun main() {
    val n = Outter().Inner()
    println(n.name)
    n.say()
}
```

总结一下嵌套类和内部类的几点区别：

1. 嵌套类没有关键字修饰，内部类使用 inner关键字
2. 嵌套类的声明方式是 `Outter.Nested()`，内部类是 `Outter().Inner()`，嵌套类中外部类后面没有括号，因为没有实例化外部类的对象。
3. 嵌套类不能访问外部类的属性和函数，内部类可以。

**匿名内部类**

使用对象表达式来创建匿名内部类，`必须`要使用 `object` 关键字作为假设的变量名。

以 Android 中 Button 的点击事件为例：

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


####  修饰符

Kotlin 中类的修饰符分为两种，一种是类属性修饰符（classModifier），用于标识类本身属性，一种是访问权限修饰符（accessModifier）。

类属性修饰符有：

```
abstruct    -> 抽象类（或者修饰抽象方法）
final       -> 类不可被继承，默认为final
enum        -> 枚举类
open        -> 可以被继承
annotation  -> 注解类
```

权限访问修饰符有：

```
private    -> 在同一个文件中可见
protected  -> 同一个文件中或子类可见
public     -> 所有调用的地方都可见
internal   -> 同一个模块中可见
```

#### 静态变量和方法

在 Java 中，可以使用 static 关键字定义类层面的变量和方法；在 Kotlin 中，使用伴生对象来实现类的静态属性和函数。这个在之后进行介绍。

#### 结语

下一篇是关于继承和接口的内容。

#### 参考资料

[Kotlin 类和对象](https://www.runoob.com/kotlin/kotlin-class-object.html)
[Kotlin 里那些「不是那么写的」](https://kaixue.io/kotlin-basic-2/)

