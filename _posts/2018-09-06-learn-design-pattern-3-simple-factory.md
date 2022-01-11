---
layout: post
title: 学学设计模式（3）简单工厂模式
tags: ["Java","设计模式"]
categores: 技术
date: 2018-09-06 17:34
cover: http://image.wufazhuce.com/FpCqYzpbJ3_XHoZ4d6bwPu7qwOka
---

#### 定义

简单工厂模式属于创建型模式，又叫静态工厂方法（Static Factory Method）模式。在简单工厂模式中，可以根据参数的不同返回不同类的实例。简单工厂模式专门定义一个类来负责创建其他类的实例，被创建的实例通常都具有共同的父类。

> 注意：简单工厂模式并不属于23种GOF设计模式之一。但是他是抽象工厂模式，工厂方法模式的基础，并且也有广泛的应用。

#### 模式结构

简单工厂模式有如下角色：

- Factory：工厂角色
工厂角色负责实现创建所有实例的内部逻辑。
- Product：抽象产品角色
抽象产品角色是所创建的所有对象的父类，负责描述所有实例所共有的公共接口
- ConcreteProduct：具体产品角色
具体产品角色是创建目标，所有创建的对象都充当这个角色的某个具体类的实例。

#### 类图

![img1.png](https://i.loli.net/2019/08/29/pstP7Qhmg6eSlVZ.jpg)

#### 实现

以一个水果类为示例看看简单工厂模式如何实现：

```
//抽象产品类：Fruit
public abstract class Fruit {
	
	public abstract void eat();
	
}

//----------------------------

//具体的产品类：Apple，Banana
public class Apple extends Fruit{

	@Override
	public void eat() {
		System.out.println("吃了一个苹果");
	}

}

public class Banana extends Fruit{

	@Override
	public void eat() {
		System.out.println("吃了一个香蕉");
	}

}

//-----------------------------

//工厂类：FruitFactory

public class FruitFactory {
	
	public static Fruit createFruit(String name){
		Fruit fruit = null;
		switch(name){
		case "apple":
			fruit = new Apple();
			break;
		case "banana":
			fruit = new Banana();
			break;
		}
		return fruit;
	}
	
	public static void main(String[] args) {
		Fruit f1 = FruitFactory.createFruit("apple");
		f1.eat();
		Fruit f2 = FruitFactory.createFruit("banana");
		f2.eat();
	}
}
```

> 运行结果是：
> 吃了一个苹果
> 吃了一个香蕉

#### 模式分析

- 将对象的创建和对象本身业务处理分离可以降低系统的耦合度，使得两者修改起来都相对容易。

- 在调用工厂类的工厂方法时，由于工厂方法是静态方法，使用起来很方便，可通过类名直接调用，而且只需要传入一个简单的参数即可，在实际开发中，还可以在调用时将所传入的参数保存在XML等格式的配置文件中，修改参数时无须修改任何源代码。

- 简单工厂模式最大的问题在于工厂类的职责相对过重，增加新的产品需要修改工厂类的判断逻辑，这一点违背了开闭原则。

- 简单工厂模式的要点在于：当你需要什么，只需要传入一个正确的参数，就可以获取你所需要的对象，而无须知道其创建细节。

**优点：**

简单工厂模式最大的优点在于实现对象的创建和对象的使用分离，将对象的创建交给专门的工厂类负责。

**缺点：**

但是其最大的缺点在于工厂类不够灵活，增加新的具体产品需要修改工厂类的判断逻辑代码，而且产品较多时，工厂方法代码将会非常复杂。


#### 适用场景

在以下情况下可以使用简单工厂模式：

- 工厂类负责创建的对象比较少：由于创建的对象较少，不会造成工厂方法中的业务逻辑太过复杂。

- 客户端只知道传入工厂类的参数，对于如何创建对象不关心：客户端既不需要关心创建细节，甚至连类名都不需要记住，只需要知道类型所对应的参数。

#### 在 Android 中的应用

在 Android 中使用到了简单工厂方法的地方有 Bitmap 对象的获取、Fragment 创建等。

**1. Bitmap 对象的获取**

我们不能直接通过 new Bitmap() 来创建一个 Bitmap 对象，因为 Bitmap 类的构造函数是私有的，只能是通过 JNI 实例化。

在创建 Bitmap 对象时，大多时候都是调用 BitmapFactory 的不同 decodeXXX() 方法来实现的。这个工厂支持从不同的资源创建 Bitmap 对象，包括 files，streams 和 byte-arrays。

**2. Fragment 的创建**

有时候，为了简化简单工厂模式，可以将抽象产品类和工厂类合并，将静态工厂方法移至抽象产品类中。

Fragment 的创建使用简单工厂方法没有抽象产品类，所以工厂类放到了实现产品类中。

在 Android Studio 中输入 newInstance 会自动补全 Fragment 的简单工厂方法。

```
public static TasksFragment newInstance() {

    Bundle args = new Bundle();

    TasksFragment fragment = new TasksFragment();
    fragment.setArguments(args);
    return fragment;
}
```

使用静态工厂方法，将外部传入的参数可以通过 Fragment.setArgument 保存在它自己身上，这样我们可以在 Fragment.onCreate(…) 调用的时候将这些参数取出来。

**这样写有什么好处呢？**

- 避免了在创建 Fragment 的时候无法在类外部知道所需参数的问题。

- Fragment 推荐使用 setArguments 来传递参数，避免在横竖屏切换的时候 Fragment 自动调用自己的无参构造函数，导致数据丢失。

#### 参考资料

[Android源码中的静态工厂方法](https://blog.csdn.net/sdkfjksf/article/details/52672059)

[简单工厂模式( Simple Factory Pattern )](https://design-patterns.readthedocs.io/zh_CN/latest/creational_patterns/simple_factory.html)

[设计模式（四）——简单工厂模式](http://www.hollischuang.com/archives/1391)







