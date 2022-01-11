---
layout: post
title: Kotlin 修炼手册（8）杂项知识点
date: 2019-12-28 13:00
tags: ["Kotlin"]
categories: 技术
cover: http://image.wufazhuce.com/FokvnqEvbX3c-NSWxKwLIMgDG93G
---

最近在看《疯狂 Kotlin 讲义》，想把 Kotlin 的知识再过一遍，巩固已经学过的，啃还没掌握的，这篇文章中就来记录下之前没注意到的几个小知识点。

主要包括：

1. 类型别名
2. 位运算
3. 运算符重载

#### 类型别名

类型别名使用关键字 `typealias` 表示，可以给一个类型指定一个可读性更好的别名。比如给一个名称很长的类指定一个更简短的名字。比如用于缩短泛型集合、内部类等等。

```
// 缩短集合类型
typealias NodeSet = Set<Network.Node>
typealias FileTable<T> = MutableMap<T, MutableList<File>>

// 缩短内部类
class A{
	inner class Inner
}
typealias AInner = A.Inner
```

Kotlin 中也支持对 Lambda 表达式的类型指定别名：

```
typealias Predicate<T> = (T) -> Boolean

val p: Predicate<String> = {it.length > 4}
println(arrayOf("Kotlin","Java","Go","Python").filter(p))

// 运行结果
["Kotlin", "Python"]
```

#### 位运算

之前在学习 Java 或者其他语言时，这块其实没仔细看，学的半懂不懂的，疯狂讲义中这部分写的很详细，总算是看明白了。

位运算主要包括以下几种：

按位与、按位或、按位非、按位异或、左移、右移、无符号右移。

下面是一个 Kotlin 中支持位运算的 infix 函数和解释。

| 运算      |    函数 |  解释   |
| :--------: | :--------:| :------: |
| 按位与    |   and（bits） | 两个操作数在某一位上同时为 1 时返回 1  |
| 按位或    |   or（bits） | 两个操作数在某一位上只要有一个为 1 时返回 1  |
| 按位非    |   inv（bits） | 单目运算符，将操作数的每个位（包括符号位）都取反  |
| 按位异或    |   xor（bits） | 两个操作数在某一位上相同时返回 0，不同时返回 1  |
| 左移运算符    |   shl（bits） | 将操作数的二进制码整体左移指定位数，右边空出来的位以 0 填充  |
| 右移运算符    |  shr（bits）| 将操作数整体右移指定位数，如果操作数原来是正数，左边空出来的位填 0，如果操作数原来是负数，左边空出来的位填 1|
| 无符号右移运算符    |  ushr（bits）| 将操作数整体右移指定位数，左边空出来的位始终填 0|

下面看一些示例：

1. 按位与、按位或、按位异或
```
println(5 and 9) // 输出1
println(5 or 9)  // 输出13
println(5 xor 9) // 输出12
```

![image1](https://i.loli.net/2019/12/28/oJlpuNcHzIQnFq4.png)

2. 按位非

```
println(5.inv())    // 输出-6
println((-5).inv()) // 输出4
```

![image2](https://i.loli.net/2019/12/28/KejUEz86akLm5Q9.png)


![image3](https://i.loli.net/2019/12/28/D5yGZtrqP4uV7bS.png)

3. 左移运算符

```
println(5 shl 2)    // 输出20
println(-5 shl 2)   // 输出-20
```

![image4](https://i.loli.net/2019/12/28/3Uowtvn4P9LRmWG.png)

4. 右移运算符、无符号右移运算符

```
println(-5 shr 2)    // 输出-2
println(-5 ushr 2)   // 输出1073741822
```

![image5](https://i.loli.net/2019/12/28/lZFChDorkPbjK69.png)


#### 运算符重载

在 Kotlin 中，运算符都是依靠特定名称的函数来进行实现的，因此只需要重载这些函数，就可以为任意类添加这些运算符。重载运算符的函数要用 `operator` 关键字。

以下是常用的运算符及其对应函数：

**单目前缀运算符**

| 运算符      |     对应的函数 |
| :--------: | :--------:|
| +a    |   a.unaryPlus() |
| -a    |   a.unaryMinus() |
| !a    |   a.not() |

**自加自减算符**

| 运算符      |     对应的函数 |
| :--------: | :--------:|
| a++    |   a.inc() |
| a--    |   a.dec() |


**双目算术运算符**

| 运算符      |     对应的函数 |
| :--------: | :--------:|
| a + b    |   a.plus(b) |
| a - b    |   a.minus(b) |
| a * b    |   a.times(b) |
| a / b    |   a.dev(b) |
| a % b    |   a.rem(b) |
| a .. b    |   a.rangeTo(b) |

**in 和 !in 运算符**

| 运算符      |     对应的函数 |
| :--------: | :--------:|
| a in b    |   b.contains(a) |
| a !in b    |   !b.contains(a) |

**索引访问运算符**

| 运算符      |     对应的函数 |
| :--------: | :--------:|
| a[i]    |   a.get(i) |
| a[i,j]    |   a.get(i,j) |
| a[i1,..,im]    |   a.get(i1,..,im) |
| a[i] = b    |   a.set(i,b) |
| a[i,j] = b   |   a.get(i,j,b) |
| a[i1,..,im] = b    |   a.get(i1,..,im,b) |

**调用运算符**

| 运算符      |     对应的函数 |
| :--------: | :--------:|
| a()    |   a.invoke() |
| a(b)    |   a.invoke(b) |
| a(b1, b2)    |   a.invoke(b1, b2) |

**广义赋值运算符**

| 运算符      |     对应的函数 |
| :--------: | :--------:|
| a += b    |   a.plusAssign(b) |
| a -= b    |   a.minusAssign(b) |
| a *= b    |   a.timesAssign(b) |
| a /= b    |   a.devAssign(b) |
| a %= b    |   a.remAssign(b) |

**相等和不相等运算符**

| 运算符      |     对应的方法 |
| :--------: | :--------:|
| a == b    |   a?.equals(b) ?: (b===null) |
| a != b    |   !(a?.equals(b) ?: (b===null)) |

**比较运算符**

| 运算符      |     对应的方法 |
| :--------: | :--------:|
| a > b    |   a.compareTo(b) > 0 |
| a >= b    |   a.compareTo(b) >= 0 |
| a < b    |   a.compareTo(b) < 0 |
| a <= b    |   a.compareTo(b) <= 0 |

然后以重载双目算术运算符为例，来看看具体如果进行运算符重载。

> 假设有一个类 Point(x , y) 表示坐标系中一组坐标值，我们想用 p1 - p2 来表示两个坐标的距离，p1 * p2 表示两个坐标围起来的矩形的面积。

代码实现如下：

```
data class Point(val x: Int, val y: Int) {
    // 重载 minus 函数，就可以使用 p1 - p2
    operator fun minus(target: Point): Double {
        return Math.hypot((x - target.x).toDouble(), (y - target.y).toDouble())
    }

    // 重载 times 函数，就可以使用 p1 * p2
    operator fun times(target: Point): Int {
        return Math.abs(x - target.x) * Math.abs(y - target.y)
    }
}

fun main() {
    val p1 = Point(0,0)
    val p2 = Point(3,4)
    println("两个点的距离：${p1 - p2}")
    println("两个点围成的举行面积：${p1 * p2}")
}

// 运行结果
两个点的距离：5.0
两个点围成的举行面积：12
```
