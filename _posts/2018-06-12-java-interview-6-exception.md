---
layout: post
title: Java 笔试面试（6）异常处理
tags: ["Java"]
categories: 笔试面试
date: 2018-06-12 22:52:00
cover: https://s2.loli.net/2022/01/24/T7kJvzSpnfmtwFI.jpg
---

### Java 笔试面试（6）异常处理

#### 1. finally的代码何时执行？

问题描述：try{}里有一个return语句，那么在这个try后面的finally{}中的代码是否为执行？如果会，是在return之前还是在return之后？

```
public class Test {
	public static int testFinally(){
		try{
			return 1;
		}catch(Exception e){
			return 0;
		}finally{
			System.out.println("execute finally");	
		}
	}
	public static void main(String[] args) {
		System.out.println(testFinally());
	}
}
```
> 运行结果：
> execute finally
> 1

**说明finally{}中代码执行了，并且是在try{}中return语句之前执行。**

```
//在finally代码块中加入return
public class Test {
	public static int testFinally(){
		try{
			return 1;
		}catch(Exception e){
			return 0;
		}finally{
			System.out.println("execute finally");	
			return 3;
		}
	}
	public static void main(String[] args) {
		System.out.println(testFinally());
	}
}
```
> 运行结果：
> execute finally
> 3

**说明当finally{}中有return时，会把try{}中的return给覆盖掉。**

不会执行finally语句块的情况：
1. 程序在进入try{}之前就出现异常
2. 程序在try{}中强制退出时不会执行finally中的代码：
```
public class Test {
	public static int testFinally(){
		try{
			System.out.println("try block");
			System.exit(0);
		}catch(Exception e){
			System.out.println("catch block");
		}finally{
			System.out.println("finally block");	
		}
	}
	public static void main(String[] args) {
		System.out.println(testFinally());
	}
}
```
> 运行结果：
> try block

上例在try{}中调用System.exit(0)强制退出了程序，因此导致finally{}中代码没有被执行。

#### 2. 异常综述

![98062763.jpg](https://i.loli.net/2018/11/06/5be18b79e73ef.jpg)

Java标准库内建了一些通用的异常，这些类以Throwable为顶层父类。

Throwable又派生出Error类和Exception类。

错误：Error类以及他的子类的实例，代表了JVM本身的错误。错误不能被程序员通过代码处理，Error很少出现。因此，程序员应该关注Exception为父类的分支下的各种异常类。

异常：Exception以及他的子类，代表程序运行时发送的各种不期望发生的事件。可以被Java异常处理机制使用，是异常处理的核心。

非检查异常（unckecked exception）：Error 和 RuntimeException 以及他们的子类。javac在编译时，不会提示和发现这样的异常，不要求在程序处理这些异常。所以如果愿意，我们可以编写代码处理（使用try…catch…finally）这样的异常，也可以不处理。对于这些异常，我们应该修正代码，而不是去通过异常处理器处理 。这样的异常发生的原因多半是代码写的有问题。如除0错误ArithmeticException，错误的强制类型转换错误ClassCastException，数组索引越界ArrayIndexOutOfBoundsException，使用了空对象NullPointerException等等。

检查异常（checked exception）：除了Error 和 RuntimeException的其它异常。javac强制要求程序员为这样的异常做预备处理工作（使用try…catch…finally或者throws）。在方法中要么用try-catch语句捕获它并处理，要么用throws子句声明抛出它，否则编译不会通过。这样的异常一般是由程序的运行环境导致的。因为程序可能被运行在各种未知的环境下，而程序员无法干预用户如何使用他编写的程序，于是程序员就应该为这样的异常时刻准备着。如SQLException , IOException,ClassNotFoundException 等。
> 来源：http://www.importnew.com/26613.html

注意：
1. 进行异常捕获时，先捕获子类，再捕获父类的异常信息。
2. 尽早抛出异常，同时对捕获的异常进行处理。
3. 可以根据实际需要自定义异常类型，只要继承Exception即可。
4. 异常能处理就处理，不能处理就抛出。

#### 3. throw 和 throws

 throw是手动抛出一个异常。throw语句的后面是一个异常对象。
 格式是**throw new Exception();**
throws是方法可能会抛出异常的声明。(用在声明方法时，表示该方法可能要抛出异常)

格式为：
**public void f() throws IOException{}**

比较：
1、throws出现在方法函数头；而throw出现在函数体。
2、throws表示出现异常的一种可能性，并不一定会发生这些异常；throw则是抛出了异常，执行throw则一定抛出了某种异常对象。
3、两者都是消极处理异常的方式（这里的消极并不是说这种方式不好），只是抛出或者可能抛出异常，但是不会由函数去处理异常，真正的处理异常由函数的上层调用处理。

> 来源：https://blog.csdn.net/hjfcgt123/article/details/53349275

