---
layout: post
title: Kotlin 修炼手册（2）基本数据类型
date: 2019-08-28 23:00
tags: ["Kotlin"]
categories: 技术
cover: http://image.wufazhuce.com/FnqVwfSvG8kIa-xT_Q-_mEqHhVsV
---

#### 前言

学习任何一门编程语言，数据类型都是必学的内容。这一篇主要介绍 Kotlin 中的基本数据类型，对比对象自然是 Java。

#### 数值类型

Kotlin 中的数值类型有：

| 类型    |     名称 |   位数   | 对应Java数据类型(括号中是封装类型)|
| :-----: | :--------:| :------: | :------: |
| Byte    |   字节 |  8  |byte(Byte)|
| Short    |   短整型 |  16  |short（Short）|
| Int    |   整型 |  32  |int(Integer)|
| Long    |   长整型 |  64  | long(Long)|
| Float    |   浮点型 |  32  |float(Float)|
| Double    |   双精度浮点型 |  64  |double(Double)|

**写法注意**

1. Long 类型要以 `L` 结尾
2. Double 类型写法：3.14，1.5e10，1.5E10
3. Float 类型要加 `f` 或 `F` 后缀：3.14f
2. 十进制：123
3. 二进制以 `0b` 开头：0b0001
4. 八进制：`不支持`
5. 十六进制以 `0x`开头：0xFFF
6. 使用`下划线`使数字常亮更易读：1_000_000

```kotlin
val a1: Byte = 1
val a2: Short = 1
val a3: Int = 1
val a4: Long = 1L
val a5: Float = 3.14f
val a6: Double = 3.14

//二进制
val a7 = 0b0001
//十六进制
val a8 = 0xFFF
//使用下划线
val oneMillion = 1_000_000
val phoneNumber = 137_6730_5920L
val argb  = 0xFF_00_EF_35
val bytes = 0b11000011_00100100
```

**数值比较与装箱**

因为数据类型是类，所以存在两种比较方式：

`===`：用来比较两个在内存地址上是否相等
`==`：用来比较两个数值是否相等

例子 1：

```kotlin
val a1 = 2000
val a2 = 2000

fun main() {
   println("a1 == a2:${a1 == a2}")
   println("a1 === a2:${a1 === a2}")
}
//运行结果
a1 == a2:true
a1 === a2:true
```

在例子 1 中 a1 和 a2 都是指向一个相同的数值常量，这个常亮在内存中只有一个，因此 === 的结果也为 true。

例子 2：

```kotlin
val a1 = 2000
val a2 :Int? = a1
val a3 :Int? = a1
fun main() {
   println("a2 == a3:${a2 == a3}")
   println("a2 === a3:${a2 === a3}")
}
//运行结果
a2 == a3:true
a2 === a3:false
```

这里涉及到装箱的内容，我们知道 Java 中从基本数据类型到对应的封装类被称为装箱，从封装类到基本数据类型的过程为拆箱。

而在 Kotlin 中，存在装箱过程，没有拆箱过程，装箱操作出现在有 `Int?` 等`可空数值类型`的情况下，装箱过程不会改变数值。

上面的例子中，对象 a2，a3 是 Int? 类型，在赋值过程中触发装箱，因此 a2，a3 是两个不同的对象，在内存中地址不同，`===` 的结果为 false，但它们的数值是相同的，`==` 的结果为 true。

例子 3：

```kotlin
val a1 = 2000
val a2 :Int = a1
val a3 :Int = a1
fun main() {
   println("a2 == a3:${a2 == a3}")
   println("a2 === a3:${a2 === a3}")
}
//运行结果
a2 == a3:true
a2 === a3:true
```

再来看例子 3，和例子 2 不一样的地方在于 a2，a3 的类型是 Int，是不可为空的，所以不会触发装箱操作，所以 a2，a3 指向同一个内存地址，`===` 的结果为 true。

例子 4：

```
val a1 = 2
val a2 :Int? = a1
val a3 :Int? = a1
fun main() {
   println("a2 == a3:${a2 == a3}")
   println("a2 === a3:${a2 === a3}")
}
//运行结果
a2 == a3:true
a2 === a3:true
```

例子 4 和例子 2 的区别就在于 a1 的值不同，例子 2 中是 2000，例子 4 中是 2。但是就出现了不同的结果，这是因为，在编译成字节码时，`val a2 :Int? = a1` 对应的字节码是 `Integer a2 = Integer.valueOf(a1);`，而在 Integer 类中对 `-128～127` 这个范围内的数字进行了缓存，在这范围内的相同数值的 Integer 类型变量指向同一个对象，所以内存地址也是相同的，`===` 结果为 true。

详细的可以看这两篇文章了解：

[Kotlin基本类型自动装箱的一点问题](https://blog.csdn.net/zxm317122667/article/details/78223282)

[Java 笔试面试（4）基本数据类型与运算](https://lixiaoyu.cc/2018/06/12/java-interview-4-basic-data-types/)

**类型转换**

因为数据类型都是类，一个类型不是另一个类型的子类型，因此小范围的类型不能直接隐式转换成大范围的类型。需要使用提供的函数进行显式转换。

> toByte()  - 转换成字节型
> toShort() - 转换成短整型
> toInt() - 转换成整型
> toLong() - 转换成长整型
> toFloat() - 转换成浮点型
> toDouble() - 转换成双精度浮点型
> toChar() - 转换成字符类型
> toString() - 转换成字符串类型

在某些情况下也有自动隐式转换，前提是可以推测出正确的类型并且进行了运算符重载。

```
val a = 1L + 3  
// Long + Int => Long
```

**位运算**

对 Int 和 Long 类型，可以使用位运算符：

> shl(bits) – 左移位 (等价于Java里的 <<)
> shr(bits) – 右移位 (等价于Java里的 >>)
> ushr(bits) – 无符号右移位 (等价于Java里的 >>>)
> and(bits) – 与 
> or(bits) – 或
> xor(bits) – 异或
> inv() – 反向

详细了解可以看这篇文章：[Kotlin 位运算基础](https://www.jianshu.com/p/8d1bc648a4a0)

#### 布尔类型

布尔类型用 `Boolean` 表示，值为 true 或 false。如果需要可空布尔类型（Boolean?）会被装箱。

Kotlin 中逻辑操作符和 Java 中是一样的。

> && ：短路逻辑与
> || ：短路逻辑或
> !：取非

#### 字符类型

Kotlin字符类型用 `Char` （大写），要注意的是：

在 Java 中 char 是 int 的一部分，可以直接隐式转换成 int，在 Kotlin 中 Char 不再是 Int 的一部分了，而是一个单独的数据类型，不可以直接转换。

![img1](https://i.loli.net/2019/08/28/vsTSc2fD8LC3OV1.png)

可以通过 `toInt()` 方法转化成 Int。

```kotlin
fun main() {
    val char = 'B'
    if(char.toInt() == 65){
        println("char is A")
    }
}
```

#### 字符串类型

Kotlin 中 `String` 表示字符串，和 Java 一样是不可变的。在 Kotlin 中，可以通过数组下标的方式（`string[index]`）来取字符，也可以使用 `in` 关键字来遍历整个字符串。

例子 5:

```kotlin
fun main() {
    val str: String = "hello"
    println("内容：$str")
    println("第一个字符是：${str[0]}")
    println("第二个字符是：${str.get(1)}")
    for (s in str){
        println(s)
    }
}
//运行结果
内容：hello
第一个字符是：h
第二个字符是：e
h
e
l
l
o
```

Kotlin 支持多行字符串，用 `"""    """` 表示。

```kotlin
fun main() {
    val str: String = """
        one
        two
        three
    """
    println("内容：$str")
}
//运行结果
内容：
        one
        two
        three
```

**字符串模板**

例子 5 的代码中已经有了字符串模板的使用，直接看即可。Kotlin 中可以在字符串使用 `$变量名` 或者 `${表达式}` 的形式格式化字符串，有效代替 Java 中用 `+` 来拼接字符串。 

#### 数组类型

数组类型用 `Array<T>` 表示，T 是类型。同样可以用 `[index]` 下标的方式来读写数组相应位置的值。

**创建方式**

数组有三种创建方式：

1. arrayOf() 方法，参数是可变长的泛型对象

```kotlin
val a = arrayOf(1, 2, 3)
val b = arrayOf("one", "two", "three")
```

2. arrayOfNulls，可以创建一个指定类型的初始值全为空的数组，参数是数组长度。

```
fun main() {
    val arr = arrayOfNulls<String>(3)
    for(a in arr){
        print("$a ")
    }
    arr[0] = "one"
    arr[1] = "two"
    arr[2] = "three"
    println()
    for(a in arr){
        print("$a ")
    }
}
//运行结果
null null null 
one two three 
```

3. 工厂函数：Array(size, {i -> (包含 i 的表达式)})

工厂函数是创建一个长度为 size 的数组，这个数组下标从 0 开始，下标所对应的值是表达式的值。

举一个比较简单的例子，便于理解。

```kotlin
fun main() {
    val arr = Array(3, {i -> i * 2 })
    for(a in arr){
        print("$a ")
    }
}
//运行结果
0 2 4 
```

Kotlin 中还有 ByteArray、ShortArray、IntArray 等类用来表示各个类型的数组，这些类省去了装箱操作，效率更高，使用方式和 Array 一样。

> ByteArray - 表示字节型数组
> ShortArray - 表示短整型数组
> IntArray - 表示整型数组
> LongArray - 表示长整型数组
> BooleanArray - 表示布尔型数组
> CharArray - 表示字符型数组
> FloatArray - 表示浮点型数组
> DoubleArray - 表示双精度浮点型数组

#### 结语

关于 Kotlin 中的数据类型就写到这里，下一篇是 Kotlin 的分支和循环，以及一些常用关键字的介绍。

#### 参考资料

[Kotlin 基本数据类型](https://www.runoob.com/kotlin/kotlin-basic-types.html)
[Kotlin——初级篇（三）：数据类型详解](https://juejin.im/post/5a36020b6fb9a0451543f5c8)
[Kotlin基本类型自动装箱的一点问题](https://blog.csdn.net/zxm317122667/article/details/78223282)
[Java 笔试面试（4）基本数据类型与运算](https://lixiaoyu.cc/2018/06/12/java-interview-4-basic-data-types/)
[Kotlin位运算基础](https://www.jianshu.com/p/8d1bc648a4a0)