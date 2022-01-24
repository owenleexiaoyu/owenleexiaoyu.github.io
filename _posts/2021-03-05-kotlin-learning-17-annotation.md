---
layout: post
title: Kotlin 修炼手册（17）注解
date: 2021-03-05 12:00
tags: ["Kotlin"]
categories: 技术
---

## 章节大纲

* Java 中的注解
* Kotlin 中的注解

## Java 注解

Java 注解（Annotation）是 JDK5.0 引入的一种注释机制，本质其实是**给特定的代码加标签**，注释可以用在类、接口、方法、变量、参数、包上面。注解可以给特定的代码标注一些额外的信息。这些信息可以选择不同保留时期，比如源码期、编译期、运行期。

### Java 内置注解

Java 内置了 10 个注解，分别来看看有什么功能：

* 作用在代码上
|注解|作用|
|:----|:----|
|**@Override**|检查该方法是否是重写方法。如果发现其父类，或者是引用的接口中并没有该方法时，会报编译错误。|
|**@Deprecated**|标记过时内容。如果使用了这个类或方法，会报编译警告。|
|**@SuppressWarnings**|指示编译器去忽略注解中声明的警告。|
|**@SafeVarargs**|Java 7 开始支持，忽略任何使用参数为泛型变量的方法或构造函数调用产生的警告。|
|**@FunctionalInterface**|Java 8 开始支持，标识一个匿名函数或函数式接口。|

* 作用在注解上（被称为元注解）
|注解|作用|
|:----|:----|
|**@Documented**|标注的注解，可以出现在 Javadoc 中。|
|**@Retention**|标识这个注解怎么保存（生命周期），是只在代码中，还是编入 class 文件中，或者是在运行时可以通过反射访问。|
|**@Target**|标记这个注解应该是哪种 Java 成员。|
|**@Inherited**|标记这个注解是继承于哪个注解类(默认 注解并没有继承于任何子类)|
|**@Repeatable**|Java 8 开始支持，标识某注解可以在同一个声明上使用多次|

### 注解的结构

![图片](https://uploader.shimo.im/f/sm8QHwbDkBWE8UVl.png!thumbnail?fileGuid=xrXyjTH6QXP6RpKp)

如上图所示，可以看出：

* 所有的注解都实现了 `Annotation` 接口
* 一个注解会对应一个 `RetentionPolicy`（每个注解都有唯一一个 RetentionPolicy 属性），对应的是 `@Retention` 这个注解的含义，表示一个注解如何保存（生命周期）。
* 一个注解可以对应 1～n 个 `ElementType`（每个注解可以有多个 ElementType 属性），对应的是 `@Target` 这个注解的含义，表示一个注解可以作用在哪些 Java 元素上。

下面看看注解相关的关键类：

#### Annotation

所有的注解都是实现 Annotation 接口。

```java
public interface Annotation {
    boolean equals(Object obj);
    int hashCode();
    String toString();
    Class<? extends Annotation> annotationType();
}
```
#### RetentionPolicy

一个枚举类，其中定义的枚举是 @Retention 注解的值：

```java
public enum RetentionPolicy {
    /* Annotation信息仅存在于编译器处理期间，编译器处理完之后就没有该Annotation信息了  */
    SOURCE,
    /* 编译器将Annotation存储于类对应的.class文件中。默认行为  */
    CLASS,
    /* 编译器将Annotation存储于class文件中，并且可由JVM读入，可以反射访问 */
    RUNTIME
}
```
#### ElementType

一个枚举类，其中定义的枚举是 @Target 注解的值

```java
public enum ElementType {
    TYPE,               /* 类、接口（包括注释类型）或枚举声明  */
    FIELD,              /* 字段声明（包括枚举常量）  */
    METHOD,             /* 方法声明  */
    PARAMETER,          /* 参数声明  */
    CONSTRUCTOR,        /* 构造方法声明  */
    LOCAL_VARIABLE,     /* 局部变量声明  */
    ANNOTATION_TYPE,    /* 注释类型声明  */
    PACKAGE,            /* 包声明  */
    TYPE_PARAMETER,     /* 类型参数声明（1.8新加入） */
    TYPE_USE,           /* 类型使用声明（1.8新加入)  */
}
```
举个内置注解的例子：
```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.CONSTRUCTOR, ElementType.METHOD})
public @interface SafeVarargs {}
```
* `@interface` 是 Java 中定义注解的方式（之后再说）
* @Terget 注解中有 ElementType.CONSTRUCTOR 和 ElementType.METHOD，表示 SafeVarargs 注解是作用在构造函数和方法上的。
* @Retention 注解的值是 RetentionPolicy.RUNTIME，表示 SafeVarargs 注解信息会被编译器存储到 class 中，运行期间可以被反射访问到。

### 自定义一个 Java 注解

我们可以自定义实现特定功能的注解，只需要

* 实现 Annotation 接口：使用`@interface`来修饰
* 给注解设置 Retention 和 Target 信息
* 给注解添加属性（可选，根据实际情况来加）

看一个例子：

```java
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface MyAnnotation {  // 定义了一个 @MyAnnotation 注解
    String value() default "unkonwn";  
}
```
在一个类中使用这个注解：
```java
public class Dog {
    public String name;
    public Dog(String name) {
        this.name = name;
    }
    //    👇
    @MyAnnotation("Dog")  // 👈 注解只有一个value方法的话，value可以不写，如果不写 value 的值，则会使用默认值 unknown
    public void showName() {
        System.out.println(name);
    }
}
```
在代码中通过反射拿到这个注解中的信息：
```java
public class TestMain {
    public static void main(String[] args) {
        Dog dog = new Dog("keji");
        Class<Dog> c = Dog.class;
        try {
            Method method = c.getMethod("showName");
            method.invoke(dog);
            iteratorAnnotations(method);
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
    }
    private static void iteratorAnnotations(Method method) {
        if (method.isAnnotationPresent(MyAnnotation.class)) {  // 👈 MyAnnotation注解的Retention必须要是RUNTIME，不然注解信息不能在运行期被访问
            System.out.println("方法被MyAnnotation注解修饰");
            MyAnnotation myAnnotation = method.getAnnotation(MyAnnotation.class);  // 👈 这里通过method获取了MyAnnotation注解
            String value = myAnnotation.value();
            System.out.println("注解的value 是:"+ value);
        } else {
            System.out.println("方法没有被MyAnnotation注解修饰");
        }
    }
}
// 运行结果
keji
注解的value是：Dog
```
## Kotlin 注解

Kotlin 中的注解和 Java 也是大同小异的。

### 定义一个 Kotlin 注解

Java 中使用 @interface 来定义一个注解，Kotlin 中使用 `annotation class` 关键字来定义一个注解。

```java
// Java 版本
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
//        👇  
public @interface MyAnnotation {  // 定义了一个 @MyAnnotation 注解
    String value() default "unkonwn";  
}
// Kotlin 版本
@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
//      👇  
annotation class MyAnnotation(val value: String = "unknown")
```
上面两个注解完全是等价的。代码上的差别在于，Kotlin 中 @Target 的值是定义在 `AnnotationTarget` 中， @Retention 的值是定义在 `AnnotationRetention` 中，来分别看看这两个类。
#### AnnotationTarget

枚举类，和 Java 中的 ElementType 对应，枚举值的名字和作用位置和 Java 中稍有不同

```java
public enum class AnnotationTarget {
    CLASS, /* 用在类、接口、单例类、注解类上 Class, interface or object, annotation class is also included */
    ANNOTATION_CLASS, /* 只用在注解上 Annotation class only */
    TYPE_PARAMETER, /* Generic type parameter (unsupported yet) */
    PROPERTY, /* 用在属性上 Property */
    FIELD, /* 用在字段上，包括变量的幕后字段 Field, including property's backing field */
    LOCAL_VARIABLE, /* 用在局部变量 Local variable */
    VALUE_PARAMETER, /* 用在函数或构造器的参数上 Value parameter of a function or a constructor */
    CONSTRUCTOR, /* 只用在构造器上 Constructor only (primary or secondary) */
    FUNCTION, /* 只用在函数上，不包含构造器 Function (constructors are not included) */
    PROPERTY_GETTER, /* 只用在属性的 getter 方法上 Property getter only */
    PROPERTY_SETTER, /* 只用在属性的 setter 方法上 Property setter only */
    TYPE,  /* 作用对象是一个类型，比如类、接口、枚举 Type usage */
    EXPRESSION, /* 作用在表达式 Any expression */
    FILE,  /* 用在文件上 File */
    @SinceKotlin("1.1")
    TYPEALIAS  /* 作用在类型别名 Type alias */
}
```
#### AnnotationRetention

枚举类，对应 Java 中的 RetentionPolicy，枚举值的名字不同，含义是一致的。

```java
public enum class AnnotationRetention {
    SOURCE, /* 只存在于源代码中，不会存储到 class 文件中 Annotation isn't stored in binary output */
    BINARY, /* 注解信息存储到 class 文件中，但不能用反射读取 Annotation is stored in binary output, but invisible for reflection */
    RUNTIME /* 注解信息存储到 class 文件中，运行期可以用反射读取 Annotation is stored in binary output and visible for reflection (default retention) */
}
```
对应关系如下：
* [Kotlin]AnnotationRetention.SOURCE = [Java]RetentionPolicy.SOURCE
* [Kotlin]AnnotationRetention.BINARY = [Java]RetentionPolicy.CLASS
* [Kotlin]AnnotationRetention.RUNTIME = [Java]RetentionPolicy.RUNTIME
### Kotlin 元注解

和 Java 中一样，Kotlin 同样有元注解，分别来看看：

|注解|作用|
|:----|:----|
|**@Target**|表示标签作用于哪些代码中的目标对象，可以同时指定多个作用的目标对象。|
|**@Retention**|Retention 意思是保留期，表示该注解保留存活时间，不管是 Java 还是Kotlin 都有三种时期: 源代码时期(SOURCE)、编译时期(CLASS/BINARY)、运行时期(RUNTIME)。|
|**@MustBeDocumented**|表示一个注解类作为公共 API 的一部分，并且让该注解在生成的 API 文档中存在。|
|**@Repeatable**|表示一个注解在一个代码元素上可以应用多次。|

Kotlin 去掉了 @Inherited 元注解

### Kotlin 预置注解

在 Kotlin 中内置了很多个 @Jvm 开头的注解来解决 Java 中调用 Kotlin API 的一些调用习惯问题和控制 API 的调用。

#### @JvmDefault

Kotlin 中接口可以增加非抽象成员，@JvmDefault 注解就是为非抽象的接口成员生成默认的方法。使用这个注解需要指定一个显式的编译参数：`-Xjvm-default=enable` 或者 `-Xjvm-default=compatibility`

#### @JvmField

这个注解用在字段上，把这个属性暴露成一个没有访问器的公有 Java 字段；或者用在 Companion object 对象的属性中。

场景一：普通类

Kotlin 中默认情况下，Kotlin 类不会公开字段而是会公开属性，Kotlin 会为属性提供幕后字段。

```java
// kotlin 类
class Person {
    var age = 18 // 👈 Person类中定义一个age属性，age属性默认是public的，但是反编译成Java代码，就会看到它的幕后字段了。  
        set(value) {
            if (value > 20) {
                field = value
            }
        }
}
```
编译成 class 文件后反编译成 Java 代码：
```java
public final class Person {
   private int age = 18;  //👈 这个就是Person类中age属性的幕后字段，可以看到age字段是private私有的
  //外部访问通过setter和getter访问器来操作。由于Kotlin自动生成setter、getter访问器，所以外部可以直接类似公开属性操作，
  //实际上内部还是通过setter、getter访问器来实现
   public final int getAge() {
      return this.age;
   }
   public final void setAge(int value) {
      if (value > 20) {
         this.age = value;
      }
   }
}
```
@JvmField 注解会将该字段的 setter、getter 访问器消除掉，并且把这个字段修改为 public。
```java
class Person {
    @JvmField
    var age = 18
}
```
反编译成 Java 代码：
```java
public final class Person {
   @JvmField
   public int age = 18;//消除了setter、getter访问器，并且 age 字段为public
}
```
场景二：Companion object 伴生对象
未使用 @JvmField 注解：

```plain
class Person {
    companion object {
        val MAX_AGE = 120
    }
}
```
反编译的 Java 代码：
```java
public final class Person {
   private static final int MAX_AGE = 120;//注意: 这里默认是private私有的MAX_AGE，所以在Java中调用无法直接通过Person类名.变量名访问
   public static final Person.Companion Companion = new Person.Companion((DefaultConstructorMarker)null);
   public static final class Companion {
   //在Java中调用无法直接通过Person类名.变量名访问, 
   //而是通过静态内部类Companion的getMAX_AGE间接访问，类似这样Person.Companion.getMAX_AGE();
      public final int getMAX_AGE() {
         return Person.MAX_AGE;
      }
      private Companion() {
      }
      // $FF: synthetic method
      public Companion(DefaultConstructorMarker $constructor_marker) {
         this();
      }
   }
}
```
#### @JvmName

这个注解可以改变由 Kotlin 默认生成的 Java 方法、字段、类名（改变类名是通过作用在 kt 文件上）。

```java
class Cat {
    @set:JvmName("setCatName")  // 修改属性 setter 方法的名字 
    @get:JvmName("getCatName")  // 修改属性 getter 方法的名字
    var name: String = "ketty"
    @JvmName("getCatAge")  // 修改普通方法的名字
    fun getAge(): Int {
        return 5
    }
}
```
反编译成 Java 代码：
```java
public final class Cat {
   @NotNull
   private String name = "ketty";
   @JvmName(name = "getCatName")
   @NotNull
   public final String getCatName() {  // 👈 已经从getName改成了getCatName
      return this.name;
   }
   @JvmName(name = "setCatName")
   public final void setCatName(@NotNull String var1) {  // 👈 已经从setName改成了setCatName
      Intrinsics.checkParameterIsNotNull(var1, "<set-?>");
      this.name = var1;
   }
   @JvmName(name = "getCatAge")
   public final int getCatAge() {  // 👈 已经从getAge改成了getCatAge
      return 5;
   }
}
```
#### @JvmMultifileClass

这个注解可以将定义在多个文件中的顶层方法合并到同一个类中，和`@JvmName`配合使用。

```java
// UtilsA.kt 文件
@file:JvmName("Utils") //注意：这两个必须放在 package 申明前
@file:JvmMultifileClass
package cc.lixiaoyu.fanxing
fun funcA(){
    println("funcA")
}
// UtilsB.kt 文件
@file:JvmName("Utils")
@file:JvmMultifileClass  //注意：这两个必须放在 package 申明前
package cc.lixiaoyu.fanxing
fun funcB() {
    println("funcB")
}
```
上面有两个 Kotlin 文件，UtilsA 和 UtilsB，各自定义了一个顶层方法 funcA 和 funcB，如果不加 @file:JvmName 和 @file:JvmMultifileClass 注解，则会生成 UtilsAKt.class 和 UtilsBKt.class 两个class文件。我们先看下加了注解后如何调用这个两个方法。
```java
public static void main(String[] args) {
    Utils.funcA();  // UtilsAKt 已经变成了 Utils，这里是 @file:JvmName 的作用
    Utils.funcB();  // 并且定义在两个不同文件的方法，被合并到同一个类中了，这里是 @file:JvmMultifileClass 的作用
}
```
反编译成Java 看看：
```java
// UtilsA.kt 反编译成 Java
public final class Utils {
   public static final void funcA() {
      Utils__UtilsAKt.funcA();
   }
}
// Utils__UtilsAKt.java
package cc.lixiaoyu.fanxing;
final class Utils__UtilsAKt {
   public static final void funcA() {
      String var0 = "funcA";
      System.out.println(var0);
   }
}
// UtilsB.kt 反编译成 Java
final class Utils__UtilsBKt {
   public static final void funcB() {
      String var0 = "funcB";
      System.out.println(var0);
   }
}
// Utils.java
package cc.lixiaoyu.fanxing;
public final class Utils {
   public static final void funcB() {
      Utils__UtilsBKt.funcB();
   }
}
```
可以看到是新创建了一个 Utils 类及相同签名的方法，然后去调用 Utils _ _UtilsAKt 或 Utils _ _UtilsBKt 中的对应方法来实现的。
#### @JvmOverloads

这个注解让 Kotlin 编译器为带默认参数值的函数(包括构造函数)生成多个重载函数。

```java
// UtilsA.kt
fun funcA(foo: Int = 5) {
    println("funcA: $foo")
}
// 在 Kotlin 中调用
fun main() {
    funcA()   // 不传参数，使用参数默认值
    funcA(10) // 传入参数
}
// 在 Java 中调用
public static void main(String[] args) {
    UtilsAKt.funcA(6);   // 必须传入参数，不能使用参数默认值
}
```
给 funcA 加上 @JvmOverloads 注解：
```java
// UtilsA.kt
@JvmOverloads
fun funcA(foo: Int = 5) {
    println("funcA: $foo")
}
// 在Java中调用
public static void main(String[] args) {
    UtilsAKt.funcA();  // 可以不传参数，使用默认值
    UtilsAKt.funcA(6);
}
```
反编译成 Java：
```java
public final class UtilsAKt {
   @JvmOverloads
   public static final void funcA(int foo) {
      String var1 = "funcA: " + foo;
      System.out.println(var1);
   }
   // $FF: synthetic method
   @JvmOverloads
   public static void funcA$default(int var0, int var1, Object var2) {
      if ((var1 & 1) != 0) {
         var0 = 5;
      }
      funcA(var0);
   }
   @JvmOverloads
   public static final void funcA() {  // 👈 新增了一个无参的重载方法
      funcA$default(0, 1, (Object)null);
   }
}
```
#### @JvmPackageName

使用这个注解的文件，会改变生成的 .class 文件的完全限定名称（包名）。 这不会影响 Kotlin 代码查看这个文件的申明方式，但 Java 和其他 JVM 语言看到这个文件就是在注解指定的包中。 使用这个注解的文件，只能包含函数，属性和类的别名声明，但不能包含类。

#### @JvmStatic

这个注解能用在对象声明（object）或者普通类的 Companion object 伴生对象的方法上，把它们暴露成一个 Java 的静态方法。这个注解经常用于伴生对象的方法上，供给 Java 代码调用。

```java
class Cat {
    companion object {
        fun getCatName(): String {
            return "Cat"
        }
    }
}
// 在Java 中调用
public static void main(String[] args) {
    // 只能是Cat.Companion.XXX 的调用方式
    System.out.println(Cat.Companion.getCatName());
}
```
反编译后 Java 代码：
```java
public final class Cat {
   public static final Cat.Companion Companion = new Cat.Companion((DefaultConstructorMarker)null);
   public static final class Companion {
      @NotNull
      public final String getCatName() {
         return "Cat";
      }
      private Companion() {
      }
      // $FF: synthetic method
      public Companion(DefaultConstructorMarker $constructor_marker) {
         this();
      }
   }
}
```
使用 @JvmStatic 注解后：
```java
class Cat {
    companion object {
        @JvmStatic
        fun getCatName(): String {
            return "Cat"
        }
    }
}
// 在java中调用
public static void main(String[] args) {
    // 可以直接这样调用 Cat.XXX 的调用方式
    System.out.println(Cat.getCatName());
}
```
反编译成 Java 代码：
```java
public final class Cat {
   public static final Cat.Companion Companion = new Cat.Companion((DefaultConstructorMarker)null);
   @JvmStatic
   @NotNull
   public static final String getCatName() {  // 👈 在Cat类中生成了一个同名方法，去调用Companion的对应方法。
      return Companion.getCatName();
   }
   public static final class Companion {
      @JvmStatic
      @NotNull
      public final String getCatName() {
         return "Cat";
      }
      private Companion() {
      }
      // $FF: synthetic method
      public Companion(DefaultConstructorMarker $constructor_marker) {
         this();
      }
   }
}
```
从反编译的代码中就可以知道这个注解的原理就是在 Cat 类中生成具有相同签名的方法，去调用 Companion 对象的对应方法。
#### @JvmSuppressWildcards 和 @JvmWildcard

用于指示编译器生成或省略类型参数的通配符，JvmSuppressWildcards 用于参数的泛型是否生成或省略通配符，而 JvmWildcard 用于返回值的类型是否生成或省略通配符。JvmSuppressWildcards 注解有个 suppress 属性，表示是否生成通配符，suppress 为 true 不生成，false 生成，默认是 true。

例如：

```java
// kotlin 代码
interface ICovert {
    fun covertData(datas: List<@JvmSuppressWildcards(suppress = false) String>) // @JvmSuppressWildcardsd用于参数类型
    fun getData(): List<@JvmWildcard String> // @JvmWildcard用于返回值类型
}
```
用 Java 写一个接口的实现类：
```java
// java 代码
class CovertImpl implements ICovert {
    @Override
    public void covertData(List<? extends String> datas) { //参数类型生成通配符
    }
    @Override
    public List<? extends String> getData() { //返回值类型生成通配符
        return null;
    }
}
```
如果 JvmSuppressWildcards 注解的 suppress 为 true 时：
```java
// kotlin 代码
interface ICovert {
    //                                                           👇
    fun covertData(datas: List<@JvmSuppressWildcards(suppress = true) String>) // @JvmSuppressWildcardsd用于参数类型
    fun getData(): List<@JvmWildcard String> // @JvmWildcard用于返回值类型
}
```
用 Java 写一个接口的实现类：
```java
// java 代码
class CovertImpl implements ICovert {
    @Override
    //                            👇 这里就没有通配符了
    public void covertData(List<String> datas) {//参数类型生成通配符
    }
    @Override
    public List<? extends String> getData() {//返回值类型生成通配符
        return null;
    }
}
```
#### @JvmSynthetic

这个注解在生成的类文件中将适当的元素标记为合成（Synthetic），编译器标记为合成的任何元素都将无法从 Java 语言中访问。

合成属性：JVM 字节码标识的 ACC_SYNTHETIC 属性用于标识该元素实际上不存在于原始源代码中，而是由编译器生成。

合成属性的用途：一般用于支持代码生成，允许编译器生成不应向其他开发人员公开但需要支持实际公开接口所需的字段和方法。

#### @Throws

这个注解用于 Kotlin 中的函数、属性的 setter 或 getter 函数、构造器函数，用来抛出异常。

```java
@Throws(IOException::class) // 👈 注解参数是要抛出异常的 class
fun closeQuietly(output: Writer?) {
    output?.close()
}
```
#### @Transient

这个注解等价于 Java 中的 transient 关键字

#### @Strictfp

这个注解等价于Java中的 strictfp 关键字

#### @Synchronized

这个注解等价于 Java 中的 synchronized关键字

#### @Volatile

这个注解等价于 Java 中的 volatile 关键字

## 注解的应用

1. 提供信息给编译器: 编译器可以利用注解来处理一些，比如一些警告信息，错误等
2. 编译阶段时处理: 利用注解信息来生成一些代码，比如注解处理器、kapt，Kotlin 中生成代码非常常见，一些内置的注解为了与 Java API 的互操作性，往往借助注解在编译阶段生成一些额外的代码。
3. 运行时处理: 某些注解可以在程序运行时，通过反射机制获取注解信息来处理一些程序逻辑。

## 参考资料

[Java 注解（Annotation）](https://www.runoob.com/w3cnote/java-annotation.html)

[教你如何完全解析Kotlin中的注解](https://juejin.cn/post/6844903829868134407#heading-2)

