---
title: Kotlin 修炼手册（7）Kotlin的扩展
date: 2019-10-08 21:00
tags: ["Kotlin"]
categories: 技术
thumbnail: http://image.wufazhuce.com/FuvZooY9ju4EBqPEzS0q7SCq0JPt
---


在 Java 中，想要扩展类的功能，但是又不想直接改原来的类时，一般会采用继承、组合（装饰者模式）等方式来实现。而 Kotlin 中支持对类的属性和函数进行扩展，在类外增加原来类的属性和函数，可以方便地实现在原来的类上添加新功能。

#### 函数扩展

函数扩展的格式为：

```
fun <类名>.<扩展函数名>([参数列表])<:返回类型>{
}
```

在 Android 开发中，我们经常需要在 Activity 中弹出 Toast，每次要写：`Toast.makeText(this,  "text", Toast.LENGTH_SHORT).show();` 这么一长串很累，通常都会封装一个工具类来简化一下调用： `ToastUtils.makeToast("text");` 。

在 Kotlin 中，有了扩展函数，我们可以更加方便优雅地弹 Toast，

在一个扩展文件中，对 Context 类加一个扩展函数，因为 Activity 是 Context 的子类，也可以直接调用。

```
fun Context.showToast(content: String) {
    Toast.makeText(this, content, Toast.LENGTH_SHORT).show()
}
```

这样在 Activity 中我们就可以这样来弹 Toast：

```
button.setOnClickListener{
	showToast("text")
}
```

是不是非常方便简洁？

在扩展函数中，可以使用 `this` 关键字指代调用这个函数的对象。

**扩展函数是静态解析的**

扩展函数时静态解析的，具体调用哪一个类的函数，由调用函数的表达式类型决定，而不是由表达式运行时的动态类型决定。

```
open class Shape

class Rectangle: Shape()

fun Shape.getName() = "Shape"

fun Rectangle.getName() = "Rectangle"

fun printClassName(s: Shape) {  //类型是Shape
    println(s.getName())
}    

printClassName(Rectangle())

//运行结果
Shape
```

**和成员函数重名**

如果扩展函数和类的成员函数一致时，优先调用成员函数。

```
class C {
    fun foo() { println("成员函数") }
}

fun C.foo() { println("扩展函数") }

fun main(){
    var c = C()
    c.foo()
}

//运行结果
成员函数
```

**空对象的扩展**

在扩展函数内， 可以通过 `this == null` 来判断接收者是否为 null。这样，即使接收者为 null，也可以调用扩展函数。

```
fun Any?.toString(): String {
    if (this == null) return "null"
    // 空检测之后，“this”会自动转换为非空类型，所以下面的 toString()
    // 解析为 Any 类的成员函数
    return toString()
}

fun main(){
	var t = null
	println(t.toString())
}
//运行结果
null
```

**Java 中调用扩展函数**

通过`文件名+Kt.函数名(扩展类的对象，完整的其他参数)`来在 Java 中调用扩展函数（相当于调用工具类的静态方法）。

例如之前的 Toast 示例，该扩展函数写在 Utils.kt 文件下，则在 Java 代码中应该这样调用这个函数。

```
UtilsKt.showToast(MainActivity.this, "Hello");
```

#### 属性扩展

Kotlin 也支持对属性进行扩展。

```
val <T> List<T>. lastIndex: Int
	get() = size - 1
```

由于扩展没有实际的将成员插入类中，因此对扩展属性来说`后端变量`是无效的。这就是为什么扩展属性不能有初始化器。他们的行为只能由显式提供的 getters/setters 定义。

扩展函数只能被声明为 `val`。

#### 伴生对象的扩展

可以给类的伴生对象定义扩展函数和属性。

伴生对象通过`类名.` 的形式调用伴生对象，伴生对象声明的扩展函数，通过用类名限定符来调用：

```
class MyClass {
    companion object { }  // 将被称为 "Companion"
}

fun MyClass.Companion.foo() {
    println("伴随对象的扩展函数")
}

val MyClass.Companion.no: Int
    get() = 10

fun main(args: Array<String>) {
    println("no:${MyClass.no}")
    MyClass.foo()
}
//运行结果
no:10
伴随对象的扩展函数
```