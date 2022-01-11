---
layout: post
title: Java 笔试面试（3）关键字
tags: ["Java"]
categories: 笔试面试
date: 2018-06-12 15:44:00
cover: http://image.wufazhuce.com/FhqXuQ0uP8FqDpSB1x5NRP4J3kgi
---

#### 1. final、finally、finalize

**final:**
用于声明属性、方法和类，表示属性不可变、方法不可覆盖、类不可被继承。

final属性：指的是引用的不可变，即指向的对象是不能变，但是这个对象的内容是可以变的。

final方法：不允许任何子类重写这个方法，但子类仍然可以使用该方法。

final参数：用于表示这个参数在这个函数内部不能被修改。

final类：不允许被继承，所有的方法都不能被重写。（一些比较基本的类或防止扩展类无意间破坏原来方法实现的类都应该用final修饰，如String、StringBuffer）一个类不能既被声明成abstract又被声明成final。

finally：
finally是异常处理的一部分，不管try语句块中有没有异常发生，finally中的语句都会被执行（在try或catch语句块中的return语句执行之前执行）。

如果finally语句块有return语句，try语句块和catch语句块中的return语句会失效。
示例：
```
public class Test {
    public static void main(String[] args) {
        System.out.println(test(null) + "," + test("0") + "," + test(""));
    }

    public static int test(String str) {
        try {
            return str.charAt(0) - '0';
        } catch (NullPointerException e1) {

            return 1;
        } catch (StringIndexOutOfBoundsException e2) {

            return 2;
        } catch (Exception e3) {

            return 3;
        } finally {
            return 4;
        }

    }
}
```
> **答案是：4，4，4**
> 执行结果：
> java.lang.NullPointerException
>   at cn.test.example.Test.test(Test.java:14)
>   at cn.test.example.Test.main(Test.java:9)
> java.lang.StringIndexOutOfBoundsException: String index out of range: 0
>   at java.lang.String.charAt(String.java:646)
>   at cn.test.example.Test.test(Test.java:14)
>   at cn.test.example.Test.main(Test.java:9)
> 4,4,4

**finalize**
finalize是Object类中的一个方法，在垃圾回收器执行时会调用被回收对象的finalize（）方法，可以覆盖这个方法实现对其他资源的回收，如关闭文件等。需要注意的是：一旦垃圾回收器准备好释放对象占用的内存，会首先调用其finalize（）方法，并且在下一次垃圾回收动作发生时，才会真正回收对象占用的内存。

#### 2. static

static作用：
1. static成员变量（静态变量是属于类的，被所有实例共享，在内存中只有一个复制，只要静态变量所在的类被加载，这个静态变量就会被分配内存空间）
2. static成员方法（是类的方法，不需要创建对象就可以调用，不能调用非静态方法，不能访问非静态成员变量）
3. static代码块（JVM在加载类时会执行static代码块，多个static代码块依次执行，且只执行一次，多用于静态变量的初始化）
4. static内部类（被声明成static的内部类，可以不依赖于外部类实例对象而被实例化，智能访问外部类的静态变量和静态方法，无论是不是私有的，但是不能访问非静态的变量和方法）

#### 3. volatile

Java语言有时为了提高程序运行效率，编译器会自动进行优化，将经常被访问到的变量缓存起来，程序在读取这个变量时，有可能就从缓存（比如寄存器）中读取，而不会从内存中读取，这样做可以提高程序的运行效率。**但是在遇到多线程时，变量的值可能在别的线程被改变了，而在缓存中的值没有变，从而造成读取的值与实际的值不一致。**

volatile是一个类型修饰符，用来修饰被不同线程访问和修改的变量。**被volatile修饰的变量，系统每次读取它的值都是直接从相应的内存中读取，不会利用缓存。**在使用volatile修饰变量后，所有线程在任何时候所看到变量的值都是相同的。

volatile可以保证可见性（变量在各线程之间同步），但是不能保证操作的原子性，所以volatile不能代替sychronized（sychronized既可以保证可见性又可以保证操作的原子性）。

#### 4. instanceof

是一个二元运算符，判断一个对象是否是一个类（或接口、抽象类、父类）的实例，返回值为boolean类型。

#### 5. switch

switch用于多分支选择，switch(exp)中的exp只支持int类型（byte、short、char能自动转化为int类型，所以也支持）和枚举类型。如果一定要使用long、float、double作exp，则一定要将其强制转化为int类型才行。

在Java 7中，switch开始支持String。

```
public void test(String exp){
    switch(exp){
        case "a":
        	System.out.println("a");
        	break;
        case "b":
        	System.out.println("b");
        	break;
        default:
        	System.out.println("default");
    }
}
```

switch对String的支持，其实还是int类型的匹配。它的实现原理是：通过对case后面的String对象调用hashCode()方法，得到一个int类型的hash值，用这个hash值来唯一标识这个case。匹配时，首先调用exp的hashCode()方法，得到一个hash值，再用这个hash值去依次匹配各个case的hash值，如果没有匹配成功，则说明不存在，如果匹配成功，接着会调用String.equals() 方法进行匹配（**这里是为了进行安全检查，因为存在hash冲突的情况**）。由此可以看出，exp不能为空，case 子句中的字符串也不能为空。





