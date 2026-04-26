---
{"tags":["编程","Kotlin"],"date":"2022-02-15","dg-publish":true,"permalink":"/HaiShu/Kotlin/🟪 Kotlin 变量和常量/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-06-08T10:41:22.758+08:00","updated":"2025-06-08T11:12:37.781+08:00"}
---


## 修改记录

| **日期**    | **内容**          |
| --------- | --------------- |
| 2022.2.15 | 完成初稿            |
| 2024.4.17 | 重新组织变量部分，移除部分内容 |

---

这篇文章，我们继续介绍 Kotlin 的基础语法知识，包括 Kotlin 的变量、常量、表达式等内容。

在程序开发中，变量和常量用来储存和传递数据。类型用来描述变量或常量中保存的是什么样的数据。

## 变量
Kotlin 中的变量可以分为两类：`可变变量`和`只读变量（read-only variable）`，分别用 `var` 和 `val` 进行修饰。

> var 是 variable 的缩写  
val 是 value 的缩写
>

Kotlin 的变量名一般是小驼峰命名法，并且需要满足 Kotlin 标识符的命名规范。

### **可变变量 var**
可变变量的值是可以多次修改的。它的声明格式如下：

```java
var <变量名>: <类型> = <初始值>

// 具体示例
var age: Int = 18
age = 20       // OK，可以多次赋值
```

### 只读变量 val
只读变量是只能赋值一次的变量，它等同于 Java 中用 `final` 修饰的变量。

它的声明格式如下：

```kotlin
val <变量名>: <类型> = <初始值>

// 具体示例
val name: String = "Tom"
```

当一个不可变变量已经有了初始值（已经赋过一次值），再次给它赋值，编译器会提示错误 `Val cannot be reassigned`：

```kotlin
val name: String = "Tom"
name = "Sam"      // 报错，不可以重复赋值
```

使用 `val` 来声明变量，可以防止该变量在程序的其他地方被意外修改，这让代码更加安全。所以尽可能使用 `val` 来声明变量。

### 自动类型推断
编译器支持自动类型推断，声明变量时可以不指定类型，编译器根据初始值自动推断类型。

![](https://i.loli.net/2019/08/25/LsJP98qx6NyXdrk.png)

### 顶层变量
在 Kotlin 中，可以不将变量写在类中，而是直接写在 kt 文件中，这样的变量被称为 `顶层变量`（`Top-Level Variable`）。这时候变量的作用范围是 `pakeage` 级别。同一个 package 下的顶层变量不能重名。

```kotlin
//a package 中的 Utils.kt 文件
package cc.lixiaoyu.a

val p = 0
```

```kotlin
// b package 中的 Main.kt 文件
package cc.lixiaoyu.b

import cc.lixiaoyu.a.p

fun main() {
    println("p = $p")
}
```

在 Java 代码中调用顶层变量时，调用格式为 `类名Kt.函数名`。比如：

```java
public static void main(String[] args) {
    System.out.println("p = " + UtilsKt.getP());
}
```

### 变量的初始化
对于顶层变量，必须在声明时指定初始值，或者使用 `lateinit` 关键字，来延迟初始化。

```kotlin
var p1 :String = "" //声明时指定初始值，不报错
var p2 : String     //声明时没有指定初始值，报错
lateinit var p3:String  // 使用lateinit关键字延迟初始化，不报错
```

对于定义在类中的变量，必须在声明时指定初始值，或者声明成 `abstract`（类也要变成 abstract）、`lateinit`。

> 关于 Kotlin 的类将在后续文章中介绍。

```kotlin
abstract class ClassA {
    var p1: String           // 编译不通过，提示 Property must be initialized or be abstract
    abstract var p2: String  // 将变量声明为abstract，可以通过编译，类也要改为 abstract
    lateinit var p3: String  // 使用lateinit关键字延迟初始化
}
```

对于函数中的局部变量，可以在声明时不指定初始值，但是在使用之前必须要有赋值操作，否则也会编译不过。

> 关于 Kotlin 的函数将在后续文章中介绍。

```kotlin
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

### lateinit 关键字
`lateinit` 关键字用于解决在声明时变量，不能第一时间赋初始值的情况（比如 Android 开发中，声明控件变量，必须要在 Activity 的 onCreate 的方法中进行初始化）。它的作用是让编译器不要对这个变量检查初始化和报错，这个变量的初始化完全由开发者决定。`lateinit` 只能用来修饰 `var` 类型的变量，不能用来修饰 `val` 类型的变量。

在使用 lateinit 修饰的变量时，有时需要判断该变量是否初始化过了，此时可以通过 `::<变量名>.isInitialized` 来进行判断。例如：

```kotlin
lateinit var name: String

fun printName() {
    if (::name.isInitialized) {
        println("Hello, $name")
    } else {
        println("name is not initialized")
    }
}
```

## 常量
常量也叫编译时常量，是在编译器期间就将数据的值固定下来，永远不会变。编译时常量只能在函数之外定义，这是因为编译时常量必须要在程序编译时复制，而函数是在程序运行时调用的。编译时常量只支持基本数据类型： `String`、`Int`、`Double`、`Float`、`Long`、`Short`、`Byte`、`Char`、`Boolean`。

使用 `const` 关键字来声明一个常量，并且必须要和 `val` 一期配合使用，常量名的命名规范是字母全部大写，单词之间用下划线分隔。

比如：

```kotlin
const val PI: Double = 3.14159
```

## 参考资料
[Kotlin 的变量、函数和类型](https://kaixue.io/kotlin-basic-1/)  
[Kotlin 基础语法](https://www.runoob.com/kotlin/kotlin-basic-syntax.html)

