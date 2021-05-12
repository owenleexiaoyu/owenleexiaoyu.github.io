---
title: Kotlin 修炼手册（19）反射
date: 2021-04-11 22:00
tags: ["Kotlin"]
categories: 技术
---

前两篇文章介绍了注解和注解处理器的相关内容，我们除了可以自定义注解处理器在编译阶段用生成代码的方式来满足我们的要求，其实还有一种方案是在运行阶段利用反射来获取到注解信息进行处理。比如，ButterKnife 就有反射和 APT 两种方案。这篇文章我们就来了解一下反射。

文章内容分为如下几部分：

* 什么是反射
* Java 中的反射
* Kotlin 中的反射

## 什么是反射

反射（Reflection）是指程序在运行期可以拿到一个对象的所有信息。它是为了解决在运行期间，对某个实例一无所知的情况下，如何调用其方法。

## Java 中的反射

通常我们写好的 `.java` 源码文件，经过 javac 的编译，最终生成 `.class` 字节码文件。这些字节码文件是与平台无关的，使用时通过 Classloader 去加载这些 .class 字节码文件，从而让程序按照我们编写好的业务逻辑运行。Java 的反射主要是从这些 .class 文件中获取我们想要得到的内容，那么 Java 中的反射能够得到哪些内容呢？

### 获取 Class 对象

Java 是面向对象的语言，同样的 .class 字节码文件也不例外，想要获取 .class 文件中的内容，就要先获取 .class 文件对应的 Class 对象。Java 中获取 Class 对象的方式有三种：

1. Class.forName("类名字符串") （注意：类名字符串必须是全称，包名+类名）

```java
Class baseInfo = Class.forName("cc.lixiaoyu.Person"); 
```

2. 类名.class 

```java
Class object = Object.class; 
```

3. 实例对象.getClass() 

```java
Person person = new Person();
Class date = person.getClass(); 
```

### 获取类的构造函数

获取 Class 对象之后，就可以获取其中的构造函数，从而去创建实例对象。类的构造函数对应`java.lang.reflect.Constructor`。获取构造函数有以下方式：

1. 获取参数列表是 parameterTypes，访问控制符是 `public` 的构造函数

```java
public Constructor getConstructor(Class[] parameterTypes) 
```

2. 获取所有访问控制符是 public 的构造函数

```java
public Constructor[] getConstructors() 
```

3. 获取参数列表是 parameterTypes，并且是类自身声明的构造函数，访问控制符包含 public、protected 和 private 的函数。 

```java
public Constructor getDeclaredConstructor(Class[] parameterTypes) 
```

4. 获取类自身声明的全部的构造函数，访问控制符包含 public、protected 和 private 的函数。 

```java
public Constructor[] getDeclaredConstructors() 
```

5. 如果类声明在其它类的构造函数中，返回该类所在的构造函数，如果存在则返回，不存在返回 null

```java
public Constructor getEnclosingConstructor()
```

### 获取类的成员函数

类的成员函数对应的是 `java.lang.reflect.Method`，获取成员函数有以下方式：

1. 获取函数名是 name，参数是 parameterTypes 的 public 的函数（包括从基类继承的、从接口实现的所有 public 函数）

```java
public Method getMethod(String name, Class[] parameterTypes)
```

2. 获取全部的 public 的函数(包括从基类继承的、从接口实现的所有 public 函数)

```java
public Method[] getMethods()
```

3. 获取函数名是 name，参数是 parameterTypes，并且是类自身声明的函数，包含 public、protected 和 private 的方法。

```java
public Method getDeclaredMethod(String name, Class[] parameterTypes)
```

4. 获取全部的类自身声明的函数，包含 public、protected 和 private 方法。

```java
public Method[] getDeclaredMethods()
```

5. 如果这个类是其它类中某个方法的内部类，调用 getEnclosingMethod() 就是这个类所在的方法；若不存在，返回 null。

```java
public Method getEnclosingMethod()
```

### 获取类的注解信息

获取类的注解信息，对应的是 `java.lang.annotation.Annotation` 接口，获取类的注解信息有下面 3 种方法：

1. 获取类型是 annotationClass 的注解 (包括从基类继承的、从接口实现的所有 public 成员变量)

```java
public Annotation<A> getAnnotation(Class annotationClass)
```

2. 获取类的全部注解 (包括从基类继承的、从接口实现的所有 public 成员变量)

```java
public Annotation[] getAnnotations()
```

3. 获取类自身声明的全部注解 (包含 public、protected 和 private 成员变量)

```java
public Annotation[] getDeclaredAnnotations()
```

### 获取接口和基类信息

获取类的接口和基类的信息，对应的是 `java.lang.reflect.Type` 接口，获取类的接口和基类信息有下面两个方法：

- 获取实现的全部接口

```java
public Type[] getGenericInterfaces()
```
- 获取基类

```java
public Type getGenericSuperclass()
```

### 获取其它描述信息

- 获取类名

```java
public String getSimpleName()
```

- 获取完整类名

```java
public String getName()
```

- 判断类是不是枚举类

```java
public boolean isEnum()
```

- 判断 obj 是不是类的实例对象

```java
public boolean isInstance(Object obj)
```

- 判断类是不是接口

```java
public boolean isInterface()
```

- 判断类是不是本地类，所谓本地类,就是定义在方法内部的类。

```java
public boolean isLocalClass()
```

- 判断类是不是成员类，所谓成员类，就是常见的内部类，是指不在代码块，构造函数和成员方法中的内部类。

```java
public boolean isMemberClass()
```

- 判断类是不是基本类型。 基本类型，包括 void 和 boolean、byte、char、short、int、long、float 和 double 这几种类型。

```java
public boolean isPrimitive()
```

## Kotlin 中的反射

在 Kotlin 中，字节码对应的类是 `kotlin.reflect.KClass`，因为 Kotlin 百分之百兼容 Java，所以Kotlin 中可以使用 Java 中的反射，但是由于 Kotlin 中字节码 .class 对应的是 KClass 类，所以如果想要使用 Java 中的反射，需要首先获取 Class 的实例，在 Kotlin 中可以通过以下两种方式来获取 Class 实例。

1. 通过 **`实例.javaClass`**

```java
var hello = HelloWorld()
hello.javaClass
```

2. 通过类 KClass 类的 .java 属性

```java
HelloWorld::class.java
```

获取了 Class 实例，就可以调用上面介绍的方法，获取各种在 Java 中定义的类的信息了。


当然 Kotlin 中除了可以使用 Java 中的反射以外，还可以使用 Kotlin 中声明的一些方法，当然同 Java 中反射一样，想要使用这些方法，先要获取 KClass 对象，在 Kotlin 中可以通过以下两种方式获取 KClass 实例。

1. 通过 **`类::class`** 的方式获取 KClass 实例

```java
val clazz1: KClass<*> = HelloWorld::class
```

2. 通过 **`实例.javaClass.kotlin`** 获取 KClass 实例

```java
var hello = HelloWorld()
val clazz2 = hello.javaClass.kotlin
```

获取了 KClass 实例之后，就可以调用 Kotlin 中声明的一些关于反射的方法了。


### 构造函数 Constructor

Kotlin 可以通过下面的方法，获取所有的构造函数。

```java
//返回这个类的所有构造器
public val constructors: Collection<KFunction<T>>
```

### 成员变量和成员函数

Kotlin 中获取成员变量和成员函数的方法有6个。

1. 返回类可访问的所有函数和属性，包括继承自基类的，但是不包括构造器

```java
val members: Collection<KCallable<*>>
```

2. 返回类声明的所有函数

```java
val KClass<*>.declaredFunctions: Collection<KFunction<*>>
```

3. 返回类的扩展函数

```java
val KClass<*>.declaredMemberExtensionFunctions: Collection<KFunction<*>>
```

4. 返回类的扩展属性

```java
val <T : Any> KClass<T>.declaredMemberExtensionProperties: Collection<KProperty2<T, *, *>>
```

5. 返回类自身声明的成员函数

```java
val KClass<*>.declaredMemberFunctions: Collection<KFunction<*>>
```

6. 返回类自身声明的成员变量（属性）

```java
val <T : Any> KClass<T>.declaredMemberProperties: Collection<KProperty1<T, *>>
```

### 类相关信息

可以看到 Kotlin 反射中，可以获取比 Java 反射更多的关于类的信息。

1. 返回类的名字

```java
public val simpleName: String?
```

2. 返回类的全包名

```java
public val qualifiedName: String?
```

3. 如果这个类声明为 object，则返回其实例，否则返回 null

```java
public val objectInstance: T?
```

4. 返回类的可见性

```java
@SinceKotlin("1.1")
public val visibility: KVisibility?
```

5. 判断类是否为 final 类（在 Kotlin 中，类默认是 final 的，除非这个类声明为 open 或者 abstract)

```java
@SinceKotlin("1.1")
public val isFinal: Boolean
```

6. 判断类是否是 open 的( abstract 类也是 open 的），表示这个类可以被继承

```java
@SinceKotlin("1.1")
public val isOpen: Boolean
```

7. 判断类是否为抽象类

```java
@SinceKotlin("1.1")
public val isAbstract: Boolean
```

8. 判断类是否为密封类，密封类:用sealed修饰，其子类只能在其内部定义

```java
@SinceKotlin("1.1")
public val isSealed: Boolean
```

9. 判断类是否为 data 类

```java
@SinceKotlin("1.1")
public val isData: Boolean
```

10. 判断类是否为成员类

```java
@SinceKotlin("1.1")
public val isInner: Boolean
```

11. 判断类是否为 companion object

```java
@SinceKotlin("1.1")
public val isCompanion: Boolean    
```

12. 返回类中定义的其他类，包括内部类(inner class 声明的)和嵌套类(class 声明的)

```java
public val nestedClasses: Collection<KClass<*>>
```

13. 判断一个对象是否为此类的实例

```java
@SinceKotlin("1.1")
public fun isInstance(value: Any?): Boolean
```

14. 返回这个类的泛型列表

```java
@SinceKotlin("1.1")
public val typeParameters: List<KTypeParameter>
```

15. 类其直接基类的列表

```java
@SinceKotlin("1.1")
public val supertypes: List<KType>
```

16. 返回类所有的基类

```java
val KClass<*>.allSuperclasses: Collection<KClass<*>>
```

17. 返回类的伴生对象 companionObject

```java
val KClass<*>.companionObject: KClass<*>?
```

### 可调用引用

函数、属性以及构造函数的引用，可以用于调用或者用作函数类型的实例。通过 **`::`** 来获取。

所有可调用引用的公共超类型是 `KCallable`， 其中  `R`  是返回值类型，对于属性是属性类型，对于构造函数是所构造类型。

#### 函数引用

比如我们有一个函数为：

```java
fun isOdd(x: Int) = x % 2 != 0
```

我们可以很容易地直接调用它（`isOdd(5)`），但是我们也可以将其作为一个函数类型的值，例如将其传给另一个函数。为此，我们使用 `::` 操作符：

```java
val numbers = listOf(1, 2, 3)
println(numbers.filter(::isOdd))
```

这里的 `::isOdd` 是函数类型 `(Int) -> Boolean` 的一个实例。

函数引用属于 `KFunction` 的子类型之一，取决于参数个数，例如 `KFunction3<T1, T2, T3, R>`。

当上下文中已知函数期望的类型时，`::` 可以用于重载函数。 例如：

```java
fun isOdd(x: Int) = x % 2 != 0
fun isOdd(s: String) = s == "brillig" || s == "slithy" || s == "tove"

val numbers = listOf(1, 2, 3)
println(numbers.filter(::isOdd)) // 引用到 isOdd(x: Int)
```

或者你也可以给方法引用显式指定类型来提供必要的上下文：

```java
val predicate: (String) -> Boolean = ::isOdd   // 引用到 isOdd(x: String)
```

如果我们需要使用类的成员函数或扩展函数，它需要是限定的，例如 `String::toCharArray`。

请注意，即使以扩展函数的引用初始化一个变量，其推断出的函数类型也会没有接收者（它会有一个接受接收者对象的额外参数）。如需改为带有接收者的函数类型，请明确指定其类型：

```java
val isEmptyStringList: List<String>.() -> Boolean = List<String>::isEmpty
```

**示例：函数组合**

考虑以下函数：

```java
fun <A, B, C> compose(f: (B) -> C, g: (A) -> B): (A) -> C {
    return { x -> f(g(x)) }
}
```

它返回一个传给它的两个函数的组合：`compose(f, g) = f(g(*))`。 现在，你可以将其应用于可调用引用：

```java
fun length(s: String) = s.length

val oddLength = compose(::isOdd, ::length)
val strings = listOf("a", "ab", "abc")

println(strings.filter(oddLength))
```

#### 属性引用

要把属性作为 Kotlin中 的一等对象来访问，我们也可以使用 `::` 运算符：

```java
val x = 1

fun main() {
    println(::x.get())
    println(::x.name) 
}
```

表达式 `::x` 求值为 `KProperty<Int>` 类型的属性对象，它允许我们使用 `get()` 读取它的值，或者使用 `name` 属性来获取属性名。更多信息请参见 [关于 `KProperty` 类的文档](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html)。

对于可变属性，例如 `var y = 1`，`::y` 返回 `KMutableProperty` 类型的一个值， 该类型有一个 `set()` 方法。

```java
var y = 1

fun main() {
    ::y.set(2)
    println(y)
}
```

属性引用可以用在预期具有单个泛型参数的函数的地方：

```java
val strs = listOf("a", "bc", "def")
println(strs.map(String::length))
```

要访问属于类的成员的属性，我们这样限定它：

```java
class A(val p: Int)
val prop = A::p
println(prop.get(A(1)))
```

对于扩展属性，用法和类的成员属性一样：

```java
val String.lastChar: Char
    get() = this[length - 1]

fun main() {
    println(String::lastChar.get("abc"))
}
```

#### 与 Java 反射的互操作性

在 JVM 平台上，标准库包含反射类的扩展，它提供了与 Java 反射对象之间映射（参见 `kotlin.reflect.jvm` 包）。 例如，要查找一个用作 Kotlin 属性 getter 的 幕后字段或 Java 方法，可以这样写：

```java
import kotlin.reflect.jvm.*

class A(val p: Int)

fun main() {
    println(A::p.javaGetter) // 输出 "public final int A.getP()"
    println(A::p.javaField)  // 输出 "private final int A.p"
}
```

要获得对应于 Java 类的 Kotlin 类，请使用 `.kotlin` 扩展属性：

```java
fun getKClass(o: Any): KClass<Any> = o.javaClass.kotlin
```

#### 构造函数引用

构造函数可以像方法和属性那样引用。他们可以用于期待这样的函数类型对象的任何地方：它与该构造函数接受相同参数并且返回相应类型的对象。 通过使用 `::` 操作符并添加类名来引用构造函数。考虑下面的函数， 它期待一个无参并返回 `Foo` 类型的函数参数：

```java
class Foo

fun function(factory: () -> Foo) {
    val x: Foo = factory()
}
```

使用 `::Foo`，类 Foo 的零参数构造函数，我们可以这样简单地调用它：

```java
function(::Foo)
```

构造函数的可调用引用的类型也是 `KFunction` 的子类型之一 ，取决于其参数个数。

#### 使用 Kotin 反射注意的问题

在 Kotlin1.1 中如果反射 String，Map，List 等类型时，会抛出一个 built-in Kotlin Types 的异常，这是因为在 Kotlin1.1 版本中还没有对这些类型添加支持，在 Kotlin1.2 版本中，这个问题已经解决。

Kotlin 关于反射的内容都放在 `kotlin-reflect.jar` 中，这个 jar 包有 2.6 M，对于移动端开发，会增加包大小。

最后就是关于 Kotlin 反射的效率问题，在 Java 中反射大概需要几十微秒，在 Kotlin 需要几百甚至上千微秒，如果是通过反射访问对象或构造属性，甚至需要上万微秒，对此，官方给出的解释是，现在还没有精力进行优化，相信后续的版本中，效率问题会有所改善。

## 参考资料

[反射-Kotlin 中文网](https://www.kotlincn.net/docs/reference/reflection.html?fileGuid=TXpkxRRKd8DtHwvG)

[Kotlin中的反射](https://juejin.cn/post/6844903710976376846?fileGuid=TXpkxRRKd8DtHwvG)

[【转载】大白话说Java反射：入门、使用、原理](https://lixiaoyu.cc/2021/04/06/java-reflect/?fileGuid=TXpkxRRKd8DtHwvG)

