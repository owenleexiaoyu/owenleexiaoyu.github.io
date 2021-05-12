---
title: Java 笔试面试（4）基本数据类型与运算
tags: ["Java"]
categories: 笔试面试
date: 2018-06-12 17:23:00
thumbnail: http://image.wufazhuce.com/FjOMdD_CvegIc0l5DNzFaVN3d8Vj
---

#### 1. Java基本数据类型

Java一共提供了8中基本数据类型：

**byte，short，int，long，float，double，char，boolean**

这些基本数据类型变量在声明之后就会立刻在栈上分配内存空间。

![img1.png](https://i.loli.net/2019/08/29/yjH2zSFxdp5U6Xa.jpg)

Java语言提供了对这些基本数据类型的包装类（见上表）。

#### 2. void&Void

除了这8中基本数据类型，Java中还存在一中基本数据类型void（包装类：java.long.Void）,但是无法对它直接进行操作。

void是一个关键字，表示函数的没有返回值。

```
public final
class Void {

    /**
     * The {@code Class} object representing the pseudo-type corresponding to
     * the keyword {@code void}.
     */
    @SuppressWarnings("unchecked")
    public static final Class<Void> TYPE = (Class<Void>) Class.getPrimitiveClass("void");

    /*
     * The Void class cannot be instantiated.
     */
    private Void() {}
}
```

Void是一个不可变类，不能被继承。构造函数为private，不能被实例化。Void作为函数的返回结果表示函数返回null(除了null不能返回其它类型)。

#### 3. 基本类型的包装类

包装类的作用：

a. 作为和基本数据类型对应的类类型存在，方便涉及到对象的操作（List的add（）方法不能传入基本数据类型）。
b. 包含每种基本数据类型的相关属性如最大值、最小值等，以及相关的操作方法。

自动装箱、拆箱：

JDK自从1.5(5.0)版本以后，引入了自动拆装箱的语法，也就是在进行基本数据类型和对应的包装类转换时，系统将自动进行，这将大大方便程序员的代码书写。

下面是一道笔试题：

```
public class Test {
	public static void main(String[] args) {
		Integer v1 = 10;
		Integer v2 = 10;
		Integer v3 = new Integer(10);
		Integer v4 = 128;
		Integer v5 = 128;
		Integer v6 = Integer.valueOf(10);
		Boolean b1 = true;
		Boolean b2 = true;
		System.out.println("v1==v2?"+(v1 == v2));
		System.out.println("v1==v3?"+(v1 == v3));
		System.out.println("v4==v5?"+(v4 == v5));
		System.out.println("v1==v6?"+(v1 == v6));
		System.out.println("b1==b2?"+(b1 == b2));
	}
}
```

> 运行结果：
>
> v1==v2?true
> v1==v3?false
> v4==v5?false
> v1==v6?true
> b1==b2?true

引用类型使用==进行比较时，只有当二者指向同一个对象时，才会返回true，否则即使值相等也返回false。

Java为了获得更高的执行效率，在某些类的设计中引入了缓存机制。

请看Integer的部分源码：

```
static final Integer[]cache=new Integer[-(-128)+127+1];  
static{  
for(int i=0;i<cache.length;i++)  
   cache[i]=new Integer[i-128);  
}
```

> 来源于：https://blog.csdn.net/Bettarwang/article/details/26166405
>
> 系统把-128~127之间的整数装箱成Integer实例，并通过cache数组进行缓存，所以只要是-128~127之间的Integer类型变量，其指向的对象都是cache数组成员，从而只要有两个值相同且在-128~127之间的Integer变量，它们指向的对象就是同一个，故采用==进行比较时也返回true.Boolean的情形与之类似。对于在这范围之外的int值，则直接用Integer i = new Integer(i1);指向的就不是同一个对象了。

Integer.valueOf()方法也是进行装箱的操作，同样使用了缓存机制，所以Integer i1 = 10;和Integer i2 = Integer.valueOf(10);i1==i2为true。

#### 4. Math类中的round、ceil、floor方法 

round方法表示四舍五入，其实现原理是在原来数字的基础上加0.5再向下取整。

ceil方法是向上取整，Math.ceil(a);表示取大于a的最小整数值。

floor方法是向下取整，Math.floor(a);表示取小于a的最大整数值。

#### 5. ++i与i++

它们的不同之处在于i++是在程序执行结束进行自增，++i是在程序开始执行前进行自增。（看++的位置）

```
public static void main(String[] args) {
	int i = 1;
	System.out.println(i+++i++);
	System.out.println("i="+i);
	System.out.println(i+++++i);
	System.out.println(i+++i+++i++);
	System.out.println("i="+i);
}
```

> 运行结果为：
> 3
> i=3
> 8
> i=5
> 18
> i=8









