---
title: Kotlin 修炼手册（1）函数和变量
date: 2019-08-26 16:51
tags: ["Kotlin"]
categories: 技术
thumbnail: http://image.wufazhuce.com/FiuNI4y--xwM2DGhJFArH7ajxwCe
---

#### 前言

从这篇文章开始，将会整理我在学习 Kotlin 中的一些笔记，进行知识的系统整理。主要受众是 Android 开发者，文中可能涉及一些和 Java 的语法对比，以及 Android 应用的一些例子。

#### 函数

**基本语法**

在 Kotlin 中声明函数的方式和 Java 中有些不同，我们对比来看看。

```java
//Java
public int add(int a, int b) {
	return a + b;
}
```

```java
//Kotlin
fun add(a: Int, b: Int): Int {
	return a + b
}
```

这是一个比较简单的例子，总结一下：

1. Kotlin 中使用 `fun` 关键字来声明函数
2. 变量（参数）的写法是 `<变量名>: <变量类型>`
3. 返回类型放在参数列表之后 使用 `: <返回值类型>` 表示
4. Kotlin 代码不需要加 `;`

Kotlin 函数的其他语法特性：

当函数体只有一行时，可以使用 `=` 代替 `return 和{}`，简化代码。

```
//表达式作为函数体，返回类型自动推断
fun add(a: Int, b: Int) = a + b
```

当没有返回值时，Java 返回 `void`，Kotlin 返回 `Unit`，可以省略。

```
//Java
void print(){}

//Kotlin
fun print(): Unit{}
//省略Unit
fun print(){}
```

一个完整的 Kotlin 函数声明格式如下：

```
<修饰符> fun <函数名>(<参数名>: <参数类型>, ...): <返回值类型> ｛
// 函数实现
｝

public fun add(a: Int, b: Int): Int {
	return a + b
}
```

Kotlin 中不加任何修饰符，默认权限是 `public`，在类中的函数等同于 Java 中的 `public final`，不可被子类覆盖。


**默认参数**

Kotlin 中的参数可以加上默认值，调用时省略这个变量时，使用默认值，可以`减少函数重载`。

```
// 以Android中弹toast为例
public fun showToast(text: String, time: Long = Toast.LENGTH_SHORT){
    Toast.makeText(getApplicationContext(), text, time).show()
}

//相当于Java中两个重载函数
public void showToast(String text){
    showToast(text, Toast.LENGTH_SHORT);
}
public void showToast(String text, Long time){
    Toast.makeText(getApplicationContext(), text, time).show();
}
```

有默认值的参数必须写明参数类型。

![IMG1](https://i.loli.net/2019/08/25/MFOU6QYodhvV4eb.png)

如果一个有默认值的参数在一个无默认值的参数之前，则不能省略有默认值的参数，或者使用命名参数。

![img2](https://i.loli.net/2019/08/25/VhTxU5RS8pAcab1.png)

**命名参数**

1. 当函数有大量参数时，传入参数时使用命名参数可以提升代码可读性。格式为：`<变量名> = <变量值>`。

2. 使用命名参数时，位置可以不用一一对应。

3. 命名参数可以省略中间的有默认值的参数。

4. 在传参时，如果有命名参数，后面的参数必须都是命名参数，否则编译不通过。

![img3](https://i.loli.net/2019/08/25/KZtuoRPkLqVxyBi.png)

**可变长参数**

在 Kotlin 中可以使用 `vararg` 关键字来表示函数的可变长参数。

```
fun test(vararg list:String) {
    for (str in list){
        println(str)
    }
}
fun main() {
    test("one","two","three")
}

// 运行结果
one
two
three
```

**Lambda表达式（匿名函数）**

先举一个小例子，之后的文章中再具体介绍。

```
fun main(){
 val sumLambda: (Int, Int) -> Int = {x, y -> x + y}
 println(sumLambda(2, 3))
}
```

#### 变量

Kotlin 中的变量可以分为`可变变量`和`不可变变量`，分别用 `var` 和 `val` 进行修饰。

> var 是 variable 的缩写
> val 是 value 的缩写


**可变变量**

var <变量名>: <类型> = <初始值>

**不可变变量**

只能赋值一次的变量，类似于Java中用final修饰的变量。

val <变量名>: <类型> = <初始值>

编译器支持自动类型推断，声明时可以不指定类型，编译器根据初始值自动推断类型。

![img4](https://i.loli.net/2019/08/25/LsJP98qx6NyXdrk.png)

**Kotlin的空安全**

在Kotlin中，变量默认均是不可为空的，例如在IDE中输入以下代码时：

```
var str: String = null
```

 编译器会提示报错，编译不通过。
 
![img5](https://i.loli.net/2019/08/25/61uBJDREzQbFIxy.png)

Kotlin的空安全设计简单来说就是通过IDE的提示来避免调用null对象，从而避免NullPointerException。这样的空安全限制可以避免很多运行时的异常。

有的时候我们确实需要空值，这时候我们可以使用`可空类型`。在类型之后加一个`？`，如`String？`，`View？`。

如上面的代码，应该修改为：

```
var str: String? = null
```

不可空类型和可空类型是两个不同的类型。比如 String 和 String? 是不同的。

类型为 String? 的变量不可以直接赋值给类型为 String 的变量，因为 String？可以为 null，而 String 不可以，相当于缩小了范围，如果非要转换，需要在后面加 `!!`，表示确定该变量一定不为 null。

反过来，类型为 String 的变量可以直接赋值给类型为 String? 的变量。

![img6](https://i.loli.net/2019/08/25/PS62ViKy9Au537H.png)

可空类型在调用时，不能直接使用 `.`来调用变量的函数，而要使用 `?.` 这样的 `safe call` 来调用，它其实也是先确认变量是否为空，在其非空的情况下才去调用函数，因为是语言级别的规则，它可以做到线程安全。普通的加上一个 if 判断，做不到线程安全，所以也不能编译通过。还可以使用 `!!` 来告诉编译器确认变量一定不为空，不用检查，这种调用称为 `non-null asserted call`，其实就和 Java 中一样了，如果变量为 null，则会出现 NullPointerException。

```
var name: String = null

name.length() // 编译不通过

if(name != null){
	name.length() // 编译不通过，无法保证多线程安全，可能存在其他线程将值改为null
}

name?.length() // safe call，编译通过，运行时这条语句不执行

name!!.length() //non-null asserted call，当前情况下，name为null，编译通过，但运行时会出现NullPointerException
```

**变量的初始化**

对于 `Top-Level` 的变量（直接定义在 kt 文件中的变量），必须在声明时指定初始值，或者使用 `lateinit` 关键字，来延迟初始化。

```
var p1 :String = "" //声明时指定初始值，不报错
var p2 : String     //声明时没有指定初始值，报错
lateinit var p3:String  // 使用lateinit关键字延迟初始化，不报错
```

对于定义在类中的变量，必须在声明时指定初始值，或者声明成 `abstract`（类也要变成abstract）、`lateinit`。

```
abstract class ClassA {
    var p1: String // 编译不通过，提示Property must be initialized or be abstract
    abstract var p2: String  //将变量声明为abstract，可以通过编译，类也要改为 abstract
    lateinit var p3: String  //使用lateinit关键字延迟初始化
}
```

对于函数中的局部变量，可以在声明时不指定初始值，但是在使用之前必须要有赋值操作，否则也会编译不过。

```
fun main() {
    var str: String  //这里没有指定初始值，不报错
    println(str)     //在使用时没有初始化，编译不通过
}

//在使用前进行赋值操作
fun main() {
    var str: String  //这里没有指定初始值，不报错
    str = "hello"
    println(str)     //编译通过
}
```

**lateinit**

lateinit 关键字用于解决在声明时变量，不能第一时间赋初始值的情况。（比如 Android 开发中，声明控件变量，必须要在 Activity 的 onCreate 的方法中进行初始化）它的作用是让 IDE 不要对这个变量检查初始化和报错，这个变量的初始化完全由开发者决定。lateinit 只能用来修饰 var，不能用来修饰 val。

#### 顶层属性与函数（Top-Level）

在 Kotlin 中，可以不将属性和函数写在类中，而是直接写在 kt 文件中，这样的属性和函数被称为 `顶层属性/函数（Top-Level）`。这时候属性和函数的作用范围是 pakeage。

```
//a package中的Utils类
package cc.lixiaoyu.a

val p = 0
fun printHello(){
    println("hello")
}
```

```
//b package中的Main类
package cc.lixiaoyu.b

import cc.lixiaoyu.a.p
import cc.lixiaoyu.a.printHello

fun main() {
    printHello()
    println("p = $p")
}
```

同一个 package 下的顶层属性和函数不能重名。

在Java代码中调用顶层函数和属性时，调用格式为 `类名Kt.函数名`。比如：

```
public static void main(String[] args) {
    UtilsKt.printHello();
    System.out.println("p = " + UtilsKt.getP());
}
```

#### 结语

关于 Kotlin 最基本的两个概念，函数和变量，就先介绍到这里，下一篇将会介绍 Kotlin 中的基本数据类型。

#### 参考资料

[Kotlin 的变量、函数和类型](https://kaixue.io/kotlin-basic-1/)
[Kotlin 基础语法](https://www.runoob.com/kotlin/kotlin-basic-syntax.html)
