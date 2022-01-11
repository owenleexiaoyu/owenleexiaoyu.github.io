---
layout: post
title: 学学设计模式（5）抽象工厂模式
tags: ["Java","设计模式"]
categores: 技术
date: 2018-09-06 19:34
cover: http://image.wufazhuce.com/Fh7WHJw9t_0JFh8N0eM-VX076rDX
---

#### 对工厂模式的简单回顾

工厂模式的主要功能就是帮助我们实例化对象的。之所以名字中包含工厂模式四个字，是因为对象的实例化过程是通过工厂实现的，是用工厂方法代替 new 操作的。

这样做的好处是封装了对象的实例化细节，尤其是对于实例化较复杂或者对象的生命周期应该集中管理的情况。给系统带来更大的可扩展性和尽量少的修改量。

**简单工厂模式的优缺点**

优点：

1. 屏蔽产品的具体实现，调用者只关心产品的接口。

2. 实现简单

缺点：

1. 增加产品，需要修改工厂类，不符合开闭原则

2. 工厂类集中了所有实例的创建逻辑，违反了高内聚责任分配原则

**工厂方法模式的优缺点**

优点：

1. 继承了简单工厂模式的优点

2. 符合开闭原则

缺点：

1. 增加产品，需要增加新的工厂类，导致系统类的个数成对增加，在一定程度上增加了系统的复杂性。


#### 抽象工厂模式动机

在工厂方法模式中具体工厂负责生产具体的产品，每一个具体工厂对应一种具体产品。但是有时候我们需要一个工厂可以提供多个产品对象，而不是单一的产品对象。

为了更清晰地理解工厂方法模式，需要先引入两个概念：

**产品等级结构 ：**产品等级结构即产品的继承结构，如一个抽象类是电视机，其子类有海尔电视机、海信电视机、TCL 电视机，则抽象电视机与具体品牌的电视机之间构成了一个产品等级结构，抽象电视机是父类，而具体品牌的电视机是其子类。

**产品族 ：**在抽象工厂模式中，产品族是指由同一个工厂生产的，位于不同产品等级结构中的一组产品，如海尔电器工厂生产的海尔电视机、海尔电冰箱，海尔电视机位于电视机产品等级结构中，海尔电冰箱位于电冰箱产品等级结构中。

当系统所提供的工厂所需生产的具体产品并不是一个简单的对象，而是多个位于不同产品等级结构中属于不同类型的具体产品时需要使用抽象工厂模式。

#### 抽象工厂模式定义

抽象工厂模式（Abstract Factory Pattern）：提供一个创建一系列相关或相互依赖对象的接口，而无须指定它们具体的类。抽象工厂模式又称为 Kit 模式，属于对象创建型模式。

#### 抽象工厂模式结构

抽象工厂模式包含如下角色：

AbstractFactory：抽象工厂
ConcreteFactory：具体工厂
AbstractProduct：抽象产品
Product：具体产品

#### 类图

![img1.png](https://i.loli.net/2019/08/29/bc1xqfwtCgNLmQP.jpg)

#### 代码实现

我们就以之前提到的电视（海尔电视、小米电视），电空调（海尔空调、小米空调）为例，看看代码如何实现。

```
//抽象产品类：TV、AirConditioning

/**
 * 电视的抽象类
 * @author OwenLee
 *
 */
public abstract class TV {
	
	/*
	 * 电视播放节目的抽象方法
	 */
	public abstract void show();

}

/**
 * 空调的抽象类
 * @author OwenLee
 *
 */
public abstract class AirConditioning {
	/*
	 * 空调的制冷方法
	 */
	public abstract void refrigerate();
}
```

```
//海尔公司生产的电视和空调

public class HaierTV extends TV{

	@Override
	public void show() {
		System.out.println("海尔电视的信号很好");
	}
}

public class HaierAirCoditioning extends AirConditioning{

	@Override
	public void refrigerate() {
		System.out.println("海尔空调制冷效果很好");
	}
}
```

```
//小米公司生产的电视和空调

public class XiaomiTV extends TV{

	@Override
	public void show() {
		System.out.println("小米电视非常漂亮");
	}
}

public class XiaomiAirConditioning extends AirConditioning{

	@Override
	public void refrigerate() {
		System.out.println("小米空调可以联网");
	}

}
```

```
//抽象的工厂类（接口）
public interface IFactory {
	//生产电视的方法
	TV createTV();
	//生产空调的方法
	AirConditioning createAirConditioning();
}
```

```
//海尔的工厂类和小米的工厂类

public class HaierFactory implements IFactory{

	@Override
	public TV createTV() {
		return new HaierTV();
	}

	@Override
	public AirConditioning createAirConditioning() {
		return new HaierAirCoditioning();
	}

}

public class XiaomiFactory implements IFactory{

	@Override
	public TV createTV() {
		return new XiaomiTV();
	}

	@Override
	public AirConditioning createAirConditioning() {
		return new XiaomiAirConditioning();
	}

}
```

#### 模式分析

当我们想要增加一个厂家，比如增加一家海信，同样生产电视和空调，我们需要做的工作有：

1. 增加海信的电视和空调的产品类 HaixinTV、HaixinAirConditioning（必须）
2. 增加一个海信工厂类 HaixinFactory，实现 IFactory 接口，在相应生产方法中返回海信电视和空调的实例。

因此增加一个新的厂家时（即增加新的**产品族**），无需对原有系统做任何修改，只需增加一些类，是符合开闭原则的。

当我们想增加一种产品时，比如海尔和小米都想增加**电冰箱**这种产品，那么需要做的工作有：

1. 增加一个电冰箱的抽象类
2. 增加海尔电冰箱和小米电冰箱的具体产品类
3. 修改 IFactory，增加一个生产电冰箱的抽象方法
4. 修改所有的具体工厂类，增加相应的生产电冰箱的方法实现。

可以看出，当增加一种新的产品时（即增加新的**产品等级结构**），需要修改原有的系统，是不符合开闭原则的。

这种现象被称为：

**「开闭原则」的倾斜性**

抽象工厂模式以一种倾斜的方式支持增加新的产品，它为新产品族的增加提供方便，但不能为新的产品等级结构的增加提供这样的方便。

#### 优缺点

**优点：**

抽象工厂模式的主要优点是隔离了具体类的生成，使得客户并不需要知道什么被创建，而且每次可以通过具体工厂类创建一个产品族中的多个对象。

增加或者替换产品族比较方便，增加新的具体工厂和产品族很方便。

**缺点：**

增加新的产品等级结构很复杂，需要修改抽象工厂和所有的具体工厂类，对「开闭原则」的支持呈现倾斜性。

#### 适用环境

在以下情况下可以使用抽象工厂模式：

- 一个系统不应当依赖于产品类实例如何被创建、组合和表达的细节，这对于所有类型的工厂模式都是重要的。

- 系统中有多于一个的产品族，而每次只使用其中某一产品族。
- 属于同一个产品族的产品将在一起使用，这一约束必须在系统的设计中体现出来。

- 系统提供一个产品类的库，所有的产品以同样的接口出现，从而使客户端不依赖于具体实现。

#### 三种工厂模式的关系

当抽象工厂模式中每一个具体工厂类只创建一个产品对象，也就是只存在一个产品等级结构时，抽象工厂模式退化成工厂方法模式；

抽象工厂模式与工厂方法模式最大的区别在于，工厂方法模式针对的是一个产品等级结构，而抽象工厂模式则需要面对多个产品等级结构。

当工厂方法模式中抽象工厂与具体工厂合并，提供一个统一的工厂来创建产品对象，并将创建对象的工厂方法设计为静态方法时，工厂方法模式退化成简单工厂模式。

#### 在 Android 中的应用

在很多软件系统中需要更换界面主题，要求界面中的按钮、文本框、背景色等一起发生改变时，可以使用抽象工厂模式进行设计。

对于 Android 开发者来说，一个比较适合的应用就是主题的修改，比如有亮色主题 LightTheme 和暗色主题 DarkTheme，而在这两种主题下有各自的 UI 元素，这种时候就可以使用抽象工厂模式

#### 参考资料

[抽象工厂模式(Abstract Factory)](https://design-patterns.readthedocs.io/zh_CN/latest/creational_patterns/abstract_factory.html)

[设计模式（七）——抽象工厂模式](http://www.hollischuang.com/archives/1420)

[工厂模式和抽象工厂模式以及在Android中的应用](https://blog.csdn.net/qq_18242391/article/details/81503370)

[三种工厂模式](http://ichennan.com/2016/08/09/DesignPattern.html)








