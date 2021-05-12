---
title: 学学设计模式（12）代理模式
tags: ["Java","设计模式"]
categores: 技术
date: 2018-11-07 16:34
thumbnail: http://image.wufazhuce.com/FsLub7xi_thN-3hdPp_9by3IzUc1
---

#### 动机

在某些情况下，一个客户不想或者不能直接引用一个对 象，此时可以通过一个称之为「代理」的第三者来实现 间接引用。代理对象可以在客户端和目标对象之间起到中介的作用，并且可以通过代理对象去掉客户不能看到的内容和服务或者添加客户需要的额外服务。

#### 定义

代理模式（Proxy Pattern）：给某一个对象提供一个代 理，并由代理对象控制对原对象的引用。它是一种对象结构型模式。

#### 结构

代理模式包含如下角色：

- Subject: 抽象主题角色
- Proxy: 代理主题角色
- RealSubject: 真实主题角色

![img1.png](https://i.loli.net/2019/08/29/e3rxHQuUdhR9qj7.jpg)

#### 代码实现

**抽象主题类：**

```
public abstract class Subject {
	public abstract void request();
}
```

**真实主题类：**

```
public class RealSubject extends Subject{

	@Override
	public void request() {
		System.out.println("请求");
	}
}
```

**代理类：**

```
public class Proxy extends Subject {

	private Subject realSubject = new RealSubject();
	/**
	 * 请求前的一些操作
	 */
	public void preRequest(){
		System.out.println("请求前的一些操作");
	}
	/**
	 * 请求后的一些操作
	 */
	public void postRequest(){
		System.out.println("请求后的一些操作");
	}
	@Override
	public void request() {
		preRequest();
		realSubject.request();
		postRequest();
	}
}
```

**客户端：**

```
public class Client {

    public static void main(String[] args) {
        Subject proxy = new Proxy();
        proxy.request();
    }

}
```

**运行结果如下：**

> 请求前的一些操作
请求
请求后的一些操作

#### 模式分析

##### 优点

- 代理模式能够协调调用者和被调用者，在一定程度上降低了系统的耦合度。
- 远程代理使得客户端可以访问在远程机器上的对象，远程机器可能具有更好的计算性能与处理速度，可以快速响应并处理客户端请求。
- 虚拟代理通过使用一个小对象来代表一个大对象，可以减少系 统资源的消耗，对系统进行优化并提高运行速度。
- 保护代理可以控制对真实对象的使用权限。

##### 缺点

- 由于在客户端和真实主题之间增加了代理对象，因此 有些类型的代理模式可能会造成请求的处理速度变慢。
- 实现代理模式需要额外的工作，有些代理模式的实现非常复杂。

#### 几种常见的代理

- **远程代理**：为一个位于不同的地址空间的对象提供一个本地的代表对象，它使得客户端可以访问在远程机器上的对象，远程机器可能具有更好的计算性能与处理速度，可以快速响应并处理客户端请求。
- **虚拟代理：**如果需要创建一个资源消耗较大的对象，先创建一个消耗相对较小的对象来表示，真实对象只在需要时才会被真正创建，这个小对象称为虚拟代理。虚拟代理通过使用一个小对象来代表一个大对象，可以减少系统资源的消耗，对系统进行优化并提高运行速度。 
- **保护代理**：可以控制对一个对象的访问，可以给不同的用户提供不同级别的使用权限。

#### 在 Android 中的应用

ActivityManager 中使用到了代理模式，代理类是ActivityManagerProxy。然后在 Binder 和 AIDL 中也使用到了代理模式。

#### 参考资料

[Android源码中的代理模式](https://ivanljt.github.io/blog/2017/08/18/Android%E6%BA%90%E7%A0%81%E4%B8%AD%E7%9A%84%E4%BB%A3%E7%90%86%E6%A8%A1%E5%BC%8F/)

[代理模式](https://design-patterns.readthedocs.io/zh_CN/latest/structural_patterns/proxy.html)