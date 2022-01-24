---
layout: post
title: Kotlin 修炼手册（9）集合
date: 2020-1-7 12:00
tags: ["Kotlin"]
categories: 技术
cover: https://s2.loli.net/2022/01/24/T2jDz5Oim1SIwKZ.jpg
---

## 概述

Kotlin 中没有真正实现任何集合类，是使用类型别名为原来 Java 的集合类指定了一个 kotlin 包下的别名。Kotlin 的集合也是派生自 Collection 和 Map 两个接口。

Kotlin 中的集合分为可变集合（Mutable）和不可变集合两大类。只有可变集合才能添加、删除、修改元素，不可变集合只能读取元素。

## Kotlin 集合继承树结构

Collection 集合体系的简单的继承树如下图：

![image1](https://i.loli.net/2020/01/07/QYEi4ZLzP8gls2m.png)

Map 集合体系的继承树如下：

![image2](https://i.loli.net/2020/01/07/oIHk7ELpMGsFxPN.png)

## Set 的使用

**创建**

可以用以下函数来创建 Set 集合：

```
setOf() // 返回不可变的Set集合，元素顺序按添加顺序排列
mutableSetOf() // 返回可变的Set集合，元素顺序按添加顺序排列
hashSetOf() // 返回可变的HashSet集合, 不保证元素顺序
linkedSetOf() // 返回可变的LinkedHashSet集合，元素顺序按添加顺序排列
sortedSetOf() // 返回可变的TreeSet集合，元素按从小到达排列
```

setOf()、mutableSetOf()、linkedSetOf() 创建的 Set 集合都能维护元素的顺序，只有 hashSetOf() 创建的 Set 集合是无序的。

**处理（操作）**

有一些通用的处理函数放在最后一个部分单独来讲，这里写一下 Set 特有的处理：

```
set1 intersect set2  // 取交集
set1 union set2 // 取并集
set1 + set2 // 集合相加，相当于取并集
set1 - set2 // 集合相减，在set1中减去set1和set2公共的元素
```

示例：

```
fun main() {
    val set1 = setOf("Kotlin", "Java", "Go", "Python")
    val set2 = setOf("Kotlin", "C", "NodeJs", "Java")

    println(set1 intersect set2)
    println(set1 union  set2)
    println(set1 + set2)
    println(set1 - set2)
}
// 运行结果
[Kotlin, Java]
[Kotlin, Java, Go, Python, C, NodeJs]
[Kotlin, Java, Go, Python, C, NodeJs]
[Go, Python]
```

**遍历**

- for-in 循环遍历
- forEach() 函数遍历
- 使用索引遍历

示例：

```
fun main() {
    val set1 = hashSetOf("Kotlin", "Java", "Go", "Python")

    // ---- for-in遍历 ----
    for (e in set1) {
        print("$e ")
    }

    println("\n==================")

    // ---- forEach()遍历 ----
    set1.forEach({ print("$it ") })

    println("\n==================")

    // ---- 使用索引遍历 ----
    for (i in set1.indices) {
        print("${set1.elementAt(i)} ")
    }
}
// 运行结果
Go Java Kotlin Python 
==================
Go Java Kotlin Python 
==================
Go Java Kotlin Python
```

**增删（MutableSet）**

```
// 增加单个元素
add(element: E)
// 添加批量元素
addAll(elements: Collection<E>)

// 删除单个元素
remove(element: E)
// 删除批量元素
removeAll(elements: Collection<E>) 
// 只保留set集合与elements中的共有元素
retainAll(elements: Collection<E>)
// 清空集合
clear()
```

Set 和 MutableSet 都包含一个 `iterator()` 方法，不可变 Set 返回的是 Iterator 对象，该对象只有 `hasNext()` 和 `next()` 两个方法，可变 Set 返回的是 MutableIterator 对象，除了 hasNext() 和 next() 外，还有一个 `remove()` 方法，可用于在遍历时删除元素。

示例：

```
fun main() {
    val set = hashSetOf("Kotlin", "Java", "Go", "Python")
    val itr = set.iterator()
    while (itr.hasNext()) {
        val e = itr.next()
        if (e.length < 3) {
            itr.remove()
        }
    }
    println(set)
}
// 运行结果
[Java, Kotlin, Python]
```

## List 的使用

比较简单，就随便写一下：

```
// 创建不可变的List
listOf()
// 创建不可变的元素不为null的List（自动过滤到传入的null）
listOfNotNull()
// 创建可变的List
mutableListOf()
// 创建可变的ArrayList
arrayListOf()
```

```
// 获取index索引的元素，带operator修饰符，可以使用[]
get(index: Int)
// 返回元素所在的索引，不存在返回-1
indexOf(element: E)
// 返回元素在List中最后一次出现位置的索引
lastIndexOf(element: E)
// 返回子集
subList(start: Int, end: Int)
```

## Map的使用

Map 集合用于存储键值对。

```
// 创建不可变的Map集合
mapOf()
// 创建可变的Map集合
mutableMapOf()
// 创建可变的HashMap集合
hashMapOf()
// 创建可变的LinkedHashMap集合
linkedMapOf()
// 创建可变的TreeMap集合
sortedMapOf()
```

示例：

```
fun main() {
	// 使用 to 建立 key 和 value 的关系
    val map = mapOf("Java" to 4, "Kotlin" to 5, "G0" to 2)
    val map2 = mutableMapOf("Java" to 4, "Kotlin" to 5, "G0" to 2)
    map2["Python"] = 6
    println(map2)
}
```

**遍历**

- 使用 entries 属性
- 先遍历 map 的 key，再通过 key 取 value
- 使用解构
- 使用 forEach + Lambda 表达式

示例：

```
fun main() {
    var map = mapOf("Kotlin" to 32, "Java" to 55, "Python" to 41)

    // 方法一：使用entries属性
    for (en in map.entries) {
        println("key=${en.key}, value=${en.value}")
    }

    // 方法二：先遍历map的key，通过key取value
    for (key in map.keys) {
        println("key=${key}, value=${map[key]}")
    }

    // 方法三：使用解构
    for ((key, value) in map) {
        println("key=$key, value=$value")
    }

    // 方法四：使用forEach+Lambda表达式
    map.forEach { println("key=${it.key}, value=${it.value}") }
}
```

**增删（Mutable）**

```
// 清空所有的键值对
clear()
// 删除键值对
remove(key: K)
// 放入键值对，如果已有该key，会覆盖原来的value
put(key: K, value: V)
// 批量放入
putAll(from: Map<out K, V>)
```

另外，MutableMap 还提供了一个 set(key, value) 方法来放入键值对，用 operator 修饰，可以通过 `[]` 来放入键值对。

## 常见的数组、集合处理函数

- all(predicate: (T) -> Boolean)

所有元素都满足该表达式，返回 true，否则返回 false。

- any(predicate: (T) -> Boolean)

任一元素满足该表达式，就返回 true，都不满足，返回 false。

- cantains(element: T)

是否包含元素 element

- first | last(predicate: (T) -> Boolean)

获取第一个或最后一个满足条件的元素

- indexOfFirst | indexOfLast(predicate: (T) -> Boolean)

获取第一个或最后一个满足条件的元素的索引

- max | min() 

按照自然排序规则（要求元素必须实现 Comparable 接口）找出最大值或最小值

还有很多，这里不一一列举。