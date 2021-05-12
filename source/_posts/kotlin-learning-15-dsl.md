---
title: Kotlin 修炼手册（15）DSL
date: 2020-08-30 14:00
tags: ["Kotlin"]
categories: 技术
thumbnail: http://image.wufazhuce.com/FrAXDUDuxkcmKWiX3Fc8w0PZYeVg
---

这篇文章来学习一下 Kotlin 中 DSL 的用法，包含以下几部分的内容：

- 什么是 DSL
- Kotlin 中如何写 DSL
- DSL 示例

### DSL 简介

DSL 是 Domain Specific Language（领域特定语言）的缩写。它是为了解决系统构建初期，使用者和构建者的语言模型不一致导致的需求收集困难的问题。

比如在证券交易中有许多专业金融术语和过程，现在要为这个交易过程创建一个软件系统，开发者就必须了解证券交易活动，其中涉及到哪些对象、它们之间的规则以及约束条件是怎么样的。那么就让领域专家（这里就是证券交易专家）来描述证券交易活动中涉及的活动。但是领域专家习惯使用他们熟练使用的行业术语来表达，软件的开发者无法理解。所以领域专家需要用双方都能理解的自然语言来解释。这种解释的过程中，开发者就理解了领域知识。这个过程中双方使用的自然语言就被称为“共同语言”。共同语言是构建领域系统的基础，但是它不能够保证在收集过程中得到的信息完整的描述了领域活动中所有的业务规则和活动。如果能够让领域专家通过简单的编程方式描述领域中的所有活动和规则，那么就能在一定程度上保证描述的完整性。DSL 就是为了解决这个问题而提出的。

#### 常见的 DSL

其实 DSL 在开发过程中是很常见的，比如 HTML、XML、json、Gradle 都是DSL。

#### DSL 的特点

- 用于专门的领域，不能用在其他地方
- 表现力有限
- 不描述解答域，仅描述问题域

#### DSL 与通用编程语言的区别

DSL 和 C 语言、Java 等通用编程语言的区别有：

- DSL 供非程序员使用，供领域专家使用（这点好像比较狭义）
- DSL 有更高级的抽象，不涉及类似数据结构的细节
- DSL 表现力有限，其只能描述该领域的模型，而通用编程语言能够描述任意的模型

#### DSL 的分类

**外部 DSL**：从零开始构建的语言，需要实现语法分析器等，不依赖某一门通用的编程语言

比如：XML、JSON、HTML、CSS、MakeFile

**内部 DSL**：需要依赖某一门通用的编程语言，这个语言被称为宿主语言

比如：

- Anko：基于 Kotlin 的通过 DSL 的形式用代码写 Android 的布局，代替原来的 XML 布局
- Kolley：基于 Kotlin 的通过 DSL 来发送网络请求，在 Volley 基础上封装
- build.gradle：基于 Groovy（或者 Kotlin）的 DSL 形式 Android 构建脚本

#### DSL 优点

- 提升开发效率
- 减少沟通成本

#### DSL 缺点

- 好的 DSL 很难设计，需要求专不求全

### Kotlin 中 DSL 的写法

Kotlin 也是支持构建 DSL 的，最常见的实现方式是使用高阶函数+Lambda 表达式。有时也会用到拓展函数、运算符重载、中缀表达式等语法特性。

如果我们想在项目中使用一些第三方库，就会在build.gradle中添加这样的内容：

```kotlin
dependencies {
    implementation 'com.squareup.retrofit2:retrofit:2.6.1'
    implementation 'com.squareup.retrofit2:converter-gson:2.6.1'
}
```

下面来用 Kotlin 实现类似的语法结构（示例来自郭霖《Android 第一行代码（第三版）》）：

首先定义一个Dependency类，包含一个依赖第三方库的列表：

```kotlin
class Dependency {
    val libraries = mutableListOf<String>()

    fun implementation(lib: String) {
        libraries.add(lib)
    }
}
```

然后定义 dependencies 函数：

```kotlin
fun dependencies(block: Dependency.()->Unit): List<String> {
    return Dependency().apply {
        block()
    }.libraries
}
```

dependencies 函数接收一个函数类型的参数，并且这个参数是定义到 Dependency 这个类上的，所以调用它的时候需要创建一个 Dependency 的实例，然后通过这个实例来调用函数类型的参数，这样传入的 Lambda 表达式就可以执行了。最后将实例的 libraries 列表返回。

测试一下效果：

```kotlin
fun main() {
    val libs = dependencies {
        implementation("com.squareup.retrofit2:retrofit:2.6.1")
        implementation("com.squareup.retrofit2:converter-gson:2.6.1")
    }
    for(lib in libs) {
        println(lib)
    }
}
// 运行结果
com.squareup.retrofit2:retrofit:2.6.1
com.squareup.retrofit2:converter-gson:2.6.1
```

这样就实现了一个超简单的 DSL。

下面再来写一个更复杂一点的 HTML 的 DSL 例子，写法和上面的 dependencies 函数的写法是类似的。

```kotlin
// 定义一个接口 IHTML，有个 html 方法，返回一个标签中的所有内容（外加换行和缩进）
interface IHTML {
    fun html(): String
}

// 对应<td>标签，content是标签中的内容
class Td : IHTML {

    var content = ""

    override fun html() = "\n\t\t<td>$content</td>"
}

// 对应<tr>标签，包裹<td>标签，用一个Td类型的列表表示
class Tr : IHTML {

    private val children = ArrayList<Td>()

    fun td(block: Td.() -> String) {
        val td = Td()
        td.content = td.block()
        children.add(td)
    }

    override fun html(): String {
        val builder = StringBuilder()
        builder.append("\n\t<tr>")
        for (childTag in children) {
            builder.append(childTag.html())
        }
        builder.append("\n\t</tr>")
        return builder.toString()
    }
}

// 对应<table>标签，包裹<tr>标签，用一个Tr类型的列表表示
class Table : IHTML {

    private val children = ArrayList<Tr>()

    fun tr(block: Tr.() -> Unit) {
        val tr = Tr()
        tr.block()
        children.add(tr)
    }
    
    // 首尾加上<table>标签的字符串，中间遍历children，调用html方法填充子标签内容
    override fun html(): String {
        val builder = StringBuilder()
        builder.append("<table>")
        for (childTag in children) {
            builder.append(childTag.html())
        }
        builder.append("\n</table>")
        return builder.toString()
    }
}

// 
fun table(block: Table.() -> Unit): String {
    val table = Table()
    table.block()
    return table.html()
}

fun main() {
    val html = table {
        repeat(2) {
            tr {
                td { "Apple" }
                td { "Banana" }
                td { "Orange" }
            }
        }
    }
    val f = File("test.html")
    f.writeText(html)
}
```

运行后，会生成一个 test.html 文件，用浏览器打开后是这样的：

![image](https://i.loli.net/2020/08/20/NcyBEaGlm5Mq187.png)

到此我们就用 Kotlin 的高阶函数和 Lambda 的相关知识，构建了更加便于书写和理解的 DSL 语法结构，用于解决特定的问题。

### 参考资料

[DSL 简介](https://blog.csdn.net/u010278882/article/details/50554299)

[《Android 第一行代码（第3版）》郭霖](https://www.ituring.com.cn/book/2744)



