---
layout: post
title: Kotlin 修炼手册（16）泛型
tags: ["Kotlin"]
categories: 技术
date: 2021-03-02 10:00
cover:
---

这篇文章来写一下 Kotlin 中的泛型。

## 章节大纲

* 泛型是什么
* Java 中的泛型
* Kotlin 中的泛型

## 泛型是什么

我们知道在 ArrayList 集合中，是用了一个 Object 数组来存储数据，这样就可以存储所有的类型。这样的设计在使用时会出现一个问题，就是我们不能保证里面每个 item 都是同一种数据类型。

```java
public class ArrayList {
    private Object[] array;
    private int size;
    public void add(Object e) {...}
    public void remove(int index) {...}
    public Object get(int index) {...}
}
```
比如我们有这样的代码：
```plain
ArrayList list = new ArrayList();
list.add("abc");
list.add(123);
item1 = (String)list.get(0)
item2 = (String)list.get(1)
```
在获取下标为 1 的 item 并强转成 String 类型时，就会出现数据类型转化错误。
为了解决这个问题，我们可以给存储 String 类型定义一个专门的 ArrayList：

```java
public class StringArrayList {
    private String[] array;
    private int size;
    public void add(String e) {...}
    public void remove(int index) {...}
    public String get(int index) {...}
}
```
这样在编译时，list.add(123) 就会直接报错，可以保证 ArrayList 中都是同一种类型。
同样地，想要一个只存储 Integer、Float、Person（自定义的类）类型的数据时，就需要再定义一个 IntegerArrayList、FloatArrayList、PersonArrayList，而这显然是不切实际的。

在这种情况下，泛型就出现了。

**那什么是泛型呢？**

泛型是指`参数化类型`，把具体的类型泛化，定义时用符号来指代类型，实际使用时再传入确定的类型。泛型其实就是定义了一种**模板**来适应任意类型，它的好处就是在使用时不必做类型强制转换，它通过编译器对类型进行检查保证。泛型可以用在类、接口、方法中，分别被称为泛型类，泛型接口、泛型方法。

再来看前面的例子，我们给 ArrayList 加上泛型 E：

```java
public class ArrayList<E> {
    private Object[] array;
    private int size;
    public void add(E e) {...}
    public void remove(int index) {...}
    public E get(int index) {...}
}
```
在使用时，存储 String 和 Integer 类型的数据：
```java
// 只存储 String 类型
ArrayList<String> stringList = new ArrayList<>();
stringList.add("abc");  // OK 
stringList.add(123);    // 编译器会报错
item1 = stringList.get(0) // 这里不需要强制类型转换
// 只存储 Integer 类型
ArrayList<Integer> intList = new ArrayList<>();
intList.add("abc");  // 编译器会报错
intList.add(123);    // OK
item2 = intList.get(0) // 这里不需要强制类型转换
```
## Java 中的泛型

### 泛型的使用

#### 泛型类

泛型用于类的定义中，被称为泛型类。通过泛型可以完成对一组类的操作对外开放相同的接口。最典型的就是各种容器类，如：List、Set、Map。

例如下面这个简单的泛型类：

```java
//此处T可以随便写为任意标识，常见的如T、E、K、V等形式的参数常用于表示泛型
//在实例化泛型类时，必须指定T的具体类型
public class Generic<T> { 
    // key这个成员变量的类型为T,T的类型由外部指定  
    private T key;
    public Generic(T key) { //泛型构造方法形参key的类型也为T，T的类型由外部指定
        this.key = key;
    }
    public T getKey(){ //泛型方法getKey的返回值类型为T，T的类型由外部指定
        return key;
    }
}
```
定义的泛型类，**并不一定要传入泛型类型实参**。在使用泛型的时候如果传入泛型实参，则会根据传入的泛型实参做相应的限制，这时泛型才会起到本应起到的限制作用。如果不传入泛型类型实参的话，在泛型类中使用泛型的方法或成员变量定义的类型可以为任何的类型。比如：
```java
Generic generic = new Generic("111111");
Generic generic1 = new Generic(4444);
Generic generic2 = new Generic(55.55);
Generic generic3 = new Generic(false);
System.out.println("key is " + generic.getKey());
System.out.println("key is " + generic1.getKey());
System.out.println("key is " + generic2.getKey());
System.out.println("key is " + generic3.getKey());
// 运行结果为
key is 111111
key is 4444
key is 55.55
key is false
```
>注意：泛型的类型参数只能是类类型，不能是基本数据类型，如果是 int、float，需要变成相应的装箱类。
#### 泛型接口

泛型还可以用在接口上，称为泛型接口，定义及使用和泛型类基本相同。

例如，`Arrays.sort(Object[])`可以对任意数组进行排序，但待排序的元素必须实现`Comparable<T>`这个泛型接口：

```java
public interface Comparable<T> {
    /**
     * 返回负数: 当前实例比参数o小
     * 返回 0: 当前实例与参数o相等
     * 返回正数: 当前实例比参数o大
     */
    int compareTo(T o);
}
```
#### 泛型方法

泛型方法是在调用方法的时候指明泛型的具体类型。

看下面这个例子：

```java
/**
 * 泛型方法的基本介绍
 * @param tClass 传入的泛型实参
 * @return T 返回值为T类型
 * 说明：
 *     1）public 与 返回值中间的 <T> 非常重要，可以理解为声明此方法为泛型方法。
 *     2）只有声明了<T>的方法才是泛型方法，泛型类中的使用了泛型的成员方法并不是泛型方法。
 *     3）<T>表明该方法将使用泛型类型T，此时才可以在方法中使用泛型类型T。
 *     4）与泛型类的定义一样，此处T可以随便写为任意标识，常见的如T、E、K、V等形式的参数常用于表示泛型。
 */
public <T> T genericMethod(Class<T> tClass)throws InstantiationException, IllegalAccessException {
    T instance = tClass.newInstance();
    return instance;
}
```
再来看一个更全的例子：

```java
public class GenericTest {
   //这个类是个泛型类，在上面已经介绍过
   public class Generic<T>{     
        private T key;
        public Generic(T key) {
            this.key = key;
        }
        // 虽然在方法中使用了泛型，但是这并不是一个泛型方法。
        // 这只是类中一个普通的成员方法，只不过他的返回值是在声明泛型类已经声明过的泛型
        // 所以在这个方法中才可以继续使用 T 这个泛型。
        public T getKey(){
            return key;
        }
        /**
         * 这个方法是有问题的，编译器会给我们提示这样的错误信息"cannot reslove symbol E"
         * 因为在类的声明中并未声明泛型E，所以在使用E做形参和返回值类型时，编译器会无法识别。
        public E setKey(E key){
             this.key = key
        }
        */
    }
    /** 
     * 这才是一个真正的泛型方法。
     * 首先在public与返回值之间的<E>必不可少，这表明这是一个泛型方法，并且声明了一个泛型E
     * 这个E可以出现在这个泛型方法的任意位置.
     * 泛型的数量也可以为任意多个 
     *    如：public <T,K> K showKeyName(Generic<T> container){
     *        ...
     *        }
     */
    public <E> E show(E e){
        System.out.println(e.toString());
        return e;
    }
    //这也不是一个泛型方法，这就是一个普通的方法，只是使用了Generic<Number>这个泛型类做形参而已。
    public void showKeyValue1(Generic<Number> obj){
        Log.d("泛型测试","key value is " + obj.getKey());
    }
    //这也不是一个泛型方法，这也是一个普通的方法，只不过使用了泛型通配符?
    //同时这也印证了泛型通配符章节所描述的，?是一种类型实参，可以看做为Number等所有类的父类
    public void showKeyValue2(Generic<?> obj){
        Log.d("泛型测试","key value is " + obj.getKey());
    }
     /**
     * 这个方法是有问题的，编译器会为我们提示错误信息："UnKnown class 'E' "
     * 虽然我们声明了<T>,表明了这是一个可以处理泛型的泛型方法。
     * 但是只声明了泛型类型T，并未声明泛型类型E，因此编译器并不知道该如何处理E这个类型。
    public <T> T showKeyName(Generic<E> container){
        ...
    }  
    */
    /**
     * 这个方法也是有问题的，编译器会为我们提示错误信息："UnKnown class 'T' "
     * 对于编译器来说T这个类型并未项目中声明过，因此编译也不知道该如何编译这个类。
     * 所以这也不是一个正确的泛型方法声明。
    public void showkey(T genericObj){
    }
    */
}
```
### 泛型的特性

**泛型只在编译阶段有效**

```java
List<String> stringArrayList = new ArrayList<String>();
List<Integer> integerArrayList = new ArrayList<Integer>();
Class classStringArrayList = stringArrayList.getClass();
Class classIntegerArrayList = integerArrayList.getClass();
if(classStringArrayList.equals(classIntegerArrayList)){
    System.out.println("类型相同");
}
// 运行结果
类型相同 
```
Java 中的泛型，只在编译阶段有效。在编译过程中，正确检验泛型结果后，会将泛型的相关信息擦除，并且在对象进入和离开方法的边界处添加类型检查和类型转换的方法。泛型信息不会进入到运行时阶段。
**Java 中的泛型具有「不可变性 Invariance」**。来看这样一个例子：

```plain
List<View> viewList = new List<TextView>(); // 这里的赋值操作会失败
```
Java 里面认为 `List<TextView>` 和 `List<View>` 类型并不一致，也就是说，子类的泛型（List< Button>）不属于泛型（List< TextView>）的子类。
正是因为有编译期类型擦除，所以为了保证类型安全，不允许这样赋值。

### 泛型上下界和通配符

前面提到，Java 的泛型具有不可变性，子类的泛型不属于泛型的子类。

使用泛型时，可以为传入的泛型类型实参进行上下边界的限制，这样就可以突破上述不可变性的限制，但同时在使用上也会有新的限制。

#### 上边界

为泛型添加上边界，即传入的类型实参必须是指定类型或指定类型的子类型：用 **<? extends 指定类型>** 表示，可以使泛型具有 **「协变性 Covariance」**

例如上面的例子：

```java
List<? extends View> viewList = new List<TextView>(); // 这样的赋值是可以的
```
>1. 这里的 ? 是通配符，表示是个不确定的类型
>2. 这里的 extends 限制了类型的上界，但和类继承的 extends 有些区别：
>   - 包含定义上界类型本身
>   - 上界类型可以是接口

有协变性的泛型只能作为生产者，也就是只能读，不能写。

看下面的例子：

```java
List<? extends View> viewList = new List<TextView>(); // 这样的赋值是可以的
View v = viewList.get(0); // 可以读取
viewList.add(new TextView()); // 报错，不可以写入
```
因为有上界限制，viewList 里的元素一定是 View 或 View 的子类型，根据多态的特性，是可以赋值给父类的引用的，所以读取操作没有问题。
在 add 时，因为 List<? extends View> 代表一个不确定的类型，有可能是 List<View> 也可能是 List<TextView>，所以在添加时，编译器无法确定是否满足类型安全，所以直接报错。

#### 下边界

为泛型添加下边界，即传入的类型实参必须是指定类型或指定类型的父类型：用**<? super 指定类型>**表示，可以使泛型具有**「逆变性 Contravariance」。**

例如：

```java
List<? super TextView> tvList = new ArrayList<TextView>(); // 本身
List<? super TextView> tvList = new ArrayList<View>();  // 直接父类
List<? super TextView> tvList = new ArrayList<Object>();  // 间接父类
```
有逆变性的泛型一般用来作为消费者，只能写，不能读。（这里的不能读是指`不能类型安全地读取出来`，拿到的都是 Object 对象，要类型强转也是可以的）
```java
List<? super TextView> tvList = new ArrayList<View>(); // 这样的赋值是可以的
Object o = viewList.get(0); // get() 获取到的是Object类型的对象
viewList.add(new View());   // add操作可以
```
#### 泛型通配符

类型通配符一般是使用 `?` 代替具体的类型参数。例如 List<?> 在逻辑上是 List< String>, List< Integer> 等所有 List<具体类型实参> 的父类。`?` 的含义其实是 `? extends Object`。

> 注意：这里的 ? 是类型实参，而不是类型形参，也就是说，这里的 ? 和 String、Integer、Person 等是一样的，是一种真实的类型。

```java
public class GenericTest {
    public static void main(String[] args) {
        List<String> name = new ArrayList<String>();
        List<Integer> age = new ArrayList<Integer>();
        List<Number> number = new ArrayList<Number>();
        
        name.add("icon");
        age.add(18);
        number.add(314);
 
        getData(name);
        getData(age);
        getData(number);
       
   }
 
   public static void getData(List<?> data) {
      System.out.println("data :" + data.get(0));
   }
}
// 运行结果
data :icon
data :18
data :314
```
## Kotlin 中的泛型

Kotlin 中的泛型用法和 Java 基本是一样的。

#### 泛型类

```java
class Box<T>(t: T) {
    var value: T = t
}
```
#### 泛型方法

类型参数 **<T >** 要放在函数名的前面

```java
fun <T> boxIn(value: T) = Box(value)
// 以下都是合法语句
val box4 = boxIn<Int>(1)
val box5 = boxIn(1)     // 👈 编译器会进行类型推断
```
#### 泛型上边界

Kotlin 中上边界用 `out` 关键字表示，对应 Java 中的 `? extends`，具有协变性，用于生产者，只能读不能写，只能用作输出，可以作为返回值类型但是无法作为入参的类型。

```java
val tvList: List<out TextView> = ArrayList<Button>() // 👈 out
```
以一个生产者为例子：
```java
class Producer<T> {
    fun produce(): T {
        ...
    }
}
val producer: Producer<out TextView> = Producer<Button>()
val textView: TextView = producer.produce() // 👈 相当于 'List' 的 `get`
```
#### 泛型下边界

Kotlin 中下边界用 `in` 关键字表示，对应 Java 中的 `? super`， 使泛型具有逆变性，用于消费者，只能写不能读，只能用作输入，可以作为入参的类型但是无法作为返回值的类型。

```java
val tvList: List<in TextView> = ArrayList<View>() // 👈 in
```
以一个消费者为例子：
```java
class Consumer<T> {
    fun consume(t: T) {
        ...
    }
}
val consumer: Consumer<in Button> = Consumer<TextView>()
consumer.consume(Button(context)) // 👈 相当于 'List' 的 'add'
```
#### 声明处的 in 和 out

在前面的例子中，在声明 Producer 的时候已经确定了泛型 T 只会作为输出来用，但是每次都需要在使用的时候加上 `out TextView` 来支持协变，写起来很麻烦。Kotlin 提供了另一种写法：

在声明类的时候，给泛型符号加上 `out` 关键字，表明泛型参数 T 只会用来输出，在使用的时候就不用额外加 out 了。

```java
//             👇
class Producer<out T> {
    fun produce(): T {
        ...
    }
}
val producer: Producer<TextView> = Producer<Button>() // 👈 这里不写 out 也不会报错
val producer: Producer<out TextView> = Producer<Button>() // 👈 out 可以写但没必要
```
与 out 一样，可以在声明类的时候，给泛型参数加上 `in` 关键字，来表明这个泛型参数 T 只用来输入。
```java
//             👇
class Consumer<in T> {
    fun consume(t: T) {
        ...
    }
}
val consumer: Consumer<Button> = Consumer<TextView>() // 👈 这里不写 in 也不会报错
val consumer: Consumer<in Button> = Consumer<TextView>() // 👈 in 可以写但没必要
```
#### 泛型通配符

前面提到 Java 中单个 `?` 号能作为泛型通配符使用，相当于 `? extends Object`。

它在 Kotlin 中有等效的写法：`*` 号，相当于 `out Any`。

```java
var list: List<*>
```
#### where 关键字

上面提到 Java 中泛型上边界用 extends 关键字，如果同时有多个上界时，用 `&`。

```java
//                            👇 T 的类型必须同时是 Animal 和 Food 的子类型
class Monster<T extends Animal & Food>{ 
}
```
在 Kotlin 中的等效写法是使用 `where` 关键字：
```java
//                👇
class Monster<T> where T: Animal, T: Food { 
}
```
#### reified 关键字

在 Java 中因为在编译期间类型被擦除了，所以在运行期不能获取泛型的确切类型。比如在运行期不能检查一个对象是否是泛型 T 的实例。

```java
<T> void printIfTypeMatch(Object item) {
    if (item instanceof T) { // 👈 IDE 会提示错误，illegal generic type for instanceof
        System.out.println(item);
    }
}
```
在 Kotlin 中同样不行：
```java
fun <T> printIfTypeMatch(item: Any) {
    if (item is T) { // 👈 IDE 会提示错误，Cannot check for instance of erased type: T
        println(item)
    }
}
```
这个问题，在 Java 中的解决方案通常是额外传递一个 `Class<T>` 类型的参数，然后通过 `Class#isInstance` 方法来检查：
```java
<T> void check(Object item, Class<T> type) {
    if (type.isInstance(item)) {
        //      👆
        System.out.println(item);
    }
}
```
Kotlin 中同样可以这么解决，不过还有一个更方便的做法：使用关键字 `reified` 配合 `inline` 来解决：
```plain
inline fun <reified T> printIfTypeMatch(item: Any) {
    if (item is T) { // 👈 这里就不会在提示错误了
        println(item)
    }
}
```
这里的原理是：
* inline 内联方法会把这个方法代码复制到调用处进行替换，这时候编译器知道当前的方法中泛型对应的具体类型是什么
* reified 关键字就是让编译器把泛型替换为具体类型，从而达到不被擦除的目的

## 参考资料
[Kotlin 的泛型 - 扔物线](https://kaixue.io/kotlin-generics/)

[Kotlin 泛型 - 菜鸟教程](https://www.runoob.com/kotlin/kotlin-generics.html)

[java 泛型详解-绝对是对泛型方法讲解最详细的，没有之一](https://blog.csdn.net/s10461/article/details/53941091)

