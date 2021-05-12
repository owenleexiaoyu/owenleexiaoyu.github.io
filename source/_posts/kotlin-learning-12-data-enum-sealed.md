---
title: Kotlin 修炼手册（12）数据类、密封类、枚举类
date: 2020-07-15 20:00
tags: ["Kotlin"]
categories: 技术
thumbnail: http://image.wufazhuce.com/Ft4ij5c2wOn2-7Z5duonFg4_ctJI
---

### 前言

之前在介绍类与对象时，介绍了嵌套类和内部类的特性，这篇笔记中介绍一下 Kotlin 中几种常用的特殊类，包括：

- `数据类`
- `枚举类`
- `密封类`

### 数据类

在 Android 开发中，一个非常常见的场景是发送网络请求，从服务端获取 Json 格式的数据，然后解析成实体类。这个类中只包含一些数据，通常没有额外的复杂函数逻辑。在 Kotlin 中，把这样的类叫做`数据类`。使用 `data class` 来定义。

定义格式：

```kotlin
data class User(val name:String, val age: Int)
```

编译器根据数据类主构造函数中的参数列表自动生成了以下函数：

- equals() 与 hashCode()
- toString() 格式如：“User(name=owen, age=23)”
- componentN() 对应属性，按声明顺序排列
- copy()

如果这些函数在类中已经定义了，或者从父类中继承而来，就不会生成。

使用数据类需要注意：

- 主构造函数至少包含一个参数
- 所有的参数必须标识为 var 或者 val
- 参数的默认值可有可无（如果要实例化一个无参数的数据类，需要用到默认值）
- 数据类不可以声明为 abstract、open、sealed 或者 inner
- 数据类不能继承自其他数据类（因为数据类不能声明为open），可以继承自其他普通类（如密封类），可以实现接口

#### 和 Java 的比较

Kotlin 数据类最大的优势在于我们可以不要用像以前在 Java 中那样去给每个变量写 getter、setter 方法，从而减少很多模版代码。

来看一个与 Java 的对比：

```java
// Java version
public class User{
	private String name;
	private int age;
	private int height;
	private int weight;

	public String getName(){
		return name;
	}
	public void setName(String name){
		this.name = name;
	}
	public int getAge(){
		return age;
	}
	public void setAge(int age){
		this.age = age;
	}
	public int getHeight(){
		return height;
	}
	public void setHeight(int height){
		this.height = height;
	}
	public int getWeight(){
		return weight;
	}
	public void setWeight(int weight){
		this.weight = weight;
	}
}
```

```kotlin
// Kotlin version
data class User(
	val name: String,
	val age: Int,
	val height: Int,
	val weight: Int
)
```

可以看到代码明显更加精简。

#### 使用 copy 函数

copy 函数可以用来复制一个新的数据类实例，同时可以对某些属性做修改。数据类中 val 修饰的变量只能通过copy 函数来修改，var 修饰的变量可以通过 setter 函数修改。

```kotlin
data class User(val name: String, val age: Int)

fun main() {
    val user1 = User("owen", 11)
    val user2 = user1.copy(age = 33)
    println(user1)
    println(user2)
}
// 运行结果
User(name=owen, age=11)
User(name=owen, age=33)
```

#### 解构声明

前面提到，数据类会根据参数自动生成 componentN() 函数，主要就是用于解构声明中。

```kotlin
data class User(val name: String, val age: Int)

fun main() {
    val user1 = User("owen", 11)
    println("user1.component1=${user1.component1()}")
    println("user1.component2=${user1.component2()}")
}
// 运行结果
user1.component1=owen
user1.component2=11
```

解构申明是指把一个对象重新拆成很多个变量的过程，它可以一次同时创建多个变量。

```kotlin
data class User(val name: String, val age: Int)

fun main() {
    val user1 = User("owen", 11)
    val (name, age) = user1
    println("user name = $name and user age = $age")
}
// 运行结果
user name = owen and user age = 11
```

如果在解构申明时不需要某个变量，可以使用`下划线_`代替。

```kotlin
data class User(val name: String, val age: Int)

fun main() {
    val user1 = User("owen", 11)
    val (_, age) = user1
    println("user age = $age")
}
// 运行结果
user age = 11
```

### 枚举类

对比于使用数值类型或者字符串类型来定义常量，使用枚举类可以在编译期帮助我们检查一些值的合法性，找到可能的潜在错误。

Kotlin 中的枚举类使用 `enum class` 来定义，最简单的使用是用来定义类型安全的枚举常量：

```kotlin
enum class Color {
    RED, GREEN, BLUE
}
```

其中的每个枚举常量都是枚举类的一个实例。

#### 成员变量解释

Kotlin 中枚举类有如下继承自父类的成员变量：

```kotlin 
name: 就是定义的枚举名称
ordinal: 枚举在枚举类中定义的顺序，按照定义顺序从0开始递增
declaringClass: 所属于的枚举类
```

并且和其他普通类一样，枚举类也可以自己定义成员变量，例如：

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```

```kotlin
fun main() {
    val c1 = Color.RED
    val c2 = Color.BLUE
    println("name=${c1.name} ordinal=${c1.ordinal} declaringClass=${c1.declaringClass} rgb=${c1.rgb}")
    println("name=${c2.name} ordinal=${c2.ordinal} declaringClass=${c2.declaringClass} rgb=${c2.rgb}")
}
// 运行结果
name=RED ordinal=0 declaringClass=class cc.lixiaoyu.enumtest.Color rgb=16711680

name=BLUE ordinal=2 declaringClass=class cc.lixiaoyu.enumtest.Color rgb=255
```

#### 枚举类抽象方法

枚举类中可以定义抽象方法，每个枚举常量都会重写该方法。可以通过枚举常量直接调用该方法。在枚举类中定义抽象的时候，最后一个枚举常量定义后面需要加 `;` 作为分隔符，这也是 Kotlin 中为数不多的使用分号的场景。

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000) {
        override fun printColorInfo() {
            println("I am RED")
        }
    },
    GREEN(0x00FF00) {
        override fun printColorInfo() {
            println("I am GREEN")
        }
    },
    BLUE(0x0000FF) {
        override fun printColorInfo() {
            println("I am BLUE")
        }
    };

    abstract fun printColorInfo()
}

fun main() {
    Color.RED.printColorInfo()
}
// 运行结果
I am RED
```

#### 枚举常量使用

不需要实例化枚举类就能使用枚举常量，使用：`枚举类名.枚举常量.属性（成员变量）`，例如：

```kotlin
Color.RED.name
Color.GREEN.ordinal
Color.BLUE.rgb
```

Kotlin 中可以通过 `values()` 方法以数组的形式，返回所有定义的枚举常量。

```kotlin
fun main(){
    Color.values().forEach {
        println("item name: ${it.name}")
    }
}
// 运行结果
item name: RED
item name: GREEN
item name: BLUE
```

可以通过 `valueOf()` 方法传入一个枚举常量名称，返回一个 name 匹配的枚举常量，如果没有匹配的，则会抛出一个 `IllegalArgumentException` 异常。

![image](https://i.loli.net/2020/07/14/NJ8kodWpvyVHjOu.png)

从 Kotlin 1.1 起，还可以使用 enumValues<T>() 和 enumValueOf<T>() 函数以泛型的方式访问枚举类中的枚举常量：

```kotlin
fun main() {
    println(enumValues<Color>().joinToString { it.name })
    println(enumValueOf<Color>("RED"))
}
// 运行结果 
RED, GREEN, BLUE
RED
```

### 密封类

Kotlin 中的密封类用来表示受限的类继承结构。受限的类继承结构是指一个类中的一个值只能是有限的几种类型，而不能是其他的类型。这种受限的类继承结构相当于是枚举类的拓展。不过，枚举类中的每个枚举变量都只能存在一个实例，而密封类的一个子类可以有包含状态的多个实例。

或者可以说，密封类包含了一组受限的类集合，因为里面的类都是继承自这个密封类的。但是其和其他继承类（open）的区别在于密封类是不可以在这个文件以外被继承的。但是密封类的子类的扩展不受限制，可以在代码中任何位置定义。

密封类使用 `sealed class` 来定义。密封类本身是不能被实例化的，编译器会直接报错。

密封类的子类必须在密封类内部或者同一文件内定义。

```kotlin
sealed class Expr {
    data class Const(val num: Int): Expr()
    data class Sum(val e1: Expr, val e2: Expr) : Expr()
}
object NotNum: Expr()

fun eval(expr: Expr): Int = when(expr) {
    is Expr.Const -> expr.num
    is Expr.Sum -> eval(expr.e1) + eval(expr.e2)
    NotNum -> 0
    // 不再需要 else 分支，因为已经覆盖了所有的情况
}
fun main() {
    println("${eval(Expr.Sum(Expr.Const(4), NotNum))}")
}
```
在使用 when 语句时我们需要一个 else 分支，但有时候我们自己已经穷举了所有的情况，这时这个 else 分支是没有实际意义的，但是因为 when 语句的语法规则而必须添加。从上述实例也可以看出密封类的一个关键好处是可以让我们去掉这个多余的 else 分支。

并且，如果我们增加了一个密封类的子类，而忘记在 when 中增加这个子类的分支，编译器会自动检查出来报错。

![ima](https://i.loli.net/2020/07/15/29lzprBkdHvEgey.png)


如上图，我们增加了一个 TestNum 的密封类子类，when语句没有增加 TestNum 的分支，编译器就给出了一个 `Kotlin: 'when' expression must be exhaustive, add necessary 'TestNum' branch or 'else' branch instead` 的提示，让我们添加 TestNum 或者 else 分支。在编译期及时发现错误，让代码在运行时出错的概率变低。

[菜鸟教程 Kotlin 密封类](https://www.runoob.com/kotlin/kotlin-data-sealed-classes.html) 评论区的一个例子非常好，可以帮助理解和枚举类在用法上的区别。

### 小结

1. data class 通常用来充当 JavaBean 的角色，可以简化很多模板代码。
2. enum class 可以用来定义一系列枚举常量，和使用 Int、String 类型的常亮相比，枚举常量是类型安全的。
3. sealed class 开发中用的较少，在枚举类不满足需求时可能会用到，和 when 语句搭配使用更佳。

### 参考资料

[枚举类（Java-廖雪峰）](https://www.liaoxuefeng.com/wiki/1252599548343744/1260473188087424)

[Kotlin 枚举类](https://www.runoob.com/kotlin/kotlin-enum-classes.html)

[Kotlin——中级篇（五）：枚举类（Enum）、接口类（Interface）详解](https://juejin.im/post/5a34c551518825552b3f9c91)

[Kotlin——中级篇（六）：数据类（data）、密封类\(sealed\)详解](https://juejin.im/post/5a37e4b45188253aea1f7219)


