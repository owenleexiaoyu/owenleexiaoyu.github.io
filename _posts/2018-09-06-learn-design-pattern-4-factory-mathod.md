---
layout: post
title: 学学设计模式（4）工厂方法模式
tags: ["Java","设计模式"]
categores: 技术
date: 2018-09-06 18:34
cover: https://s2.loli.net/2022/01/24/muHgoiqjNBRW5K2.jpg
---

#### 概念

工厂方法模式（Factory Method Pattern）又称为工厂模式，也叫虚拟构造器（Virtual Constructor）模式或者多态工厂（Polymorphic Factory）模式，它属于类创建型模式。

工厂方法模式是一种实现了「工厂」概念的面向对象设计模式。就像其他创建型模式一样，它也是处理在不指定对象具体类型的情况下创建对象的问题。

在工厂方法模式中，工厂父类负责定义创建产品对象的公共接口，而工厂子类则负责生成具体的产品对象，这样做的目的是将产品类的实例化操作延迟到工厂子类中完成，即通过工厂子类来确定究竟应该实例化哪一个具体产品类。

#### 模式结构

工厂方法模式包含如下角色：

- Product：抽象产品
- ConcreteProduct：具体产品
- Factory：抽象工厂
- ConcreteFactory：具体工厂

#### 类图

![img1.png](https://i.loli.net/2019/08/29/7qvoQOJCthMaSwD.jpg)

#### 代码实现

还是以水果的例子来看看代码：

```
//抽象产品：Fruit
public abstract class Fruit {
	
	public abstract void eat();
	
}

//--------------------------

//具体产品：Apple、Banana
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

//-------------------------------

//抽象的工厂类（接口实现）IFactory
public interface IFactory {
	
	Fruit createFruit();

}

//--------------------------

//每个具体产品都对应一个具体的工厂类AppleFactory、BananaFactory

public class AppleFactory implements IFactory{

	public Fruit createFruit() {
		
		return new Apple();
	}

}

public class BananaFactory implements IFactory{

	public Fruit createFruit() {
		return new Banana();
	}

}

//---------------------------

//main方法中调用
public class Test {
	
	public static void main(String[] args) {
		
		Fruit f1 = new AppleFactory().createFruit();
		f1.eat();
		Fruit f2 = new BananaFactory().createFruit();
		f2.eat();
	}

}
```

> 执行结果如下：
> 吃了一个苹果
> 吃了一个香蕉

和简单工厂模式进行比较，最大的区别是：**工厂方法模式在设计上完全完全符合「开闭原则」。**

当我们想要增加一个产品时，比如水果示例中增加一个 Orange。在简单工厂模式的实现中，需要：

1. 增加 Orange 类，继承自 Fruit 类（肯定是必须的）
2. 修改 FruitFactory 类，在 switch 中增加一个 case，在匹配到 orange 时返回一个 Orange 实例。

很显然，这样的操作是不符合开闭原则（对扩展开放，对修改封闭）的，我们希望在增加新的功能时，不去修改原有的代码。

而在工厂方法模式中，需要：

1. 增加 Orange 类，继承自 Fruit 类（和简单工厂一样）
2. 增加一个 OrangeFactory 的工厂类，实现 IFactory 接口，返回一个 Orange 实例。

可以看到，工厂方法模式的实现中，不需要修改任何原有的代码，只是增加了一对产品类和相应的工厂类，是符合开闭原则的。

#### 适用场景

在以下情况下可以使用工厂方法模式：

- 一个类不知道它所需要的对象的类：在工厂方法模式中，客户端不需要知道具体产品类的类名，只需要知道所对应的工厂即可，具体的产品对象由具体工厂类创建；客户端需要知道创建具体产品的工厂类。

- 一个类通过其子类来指定创建哪个对象：在工厂方法模式中，对于抽象工厂类只需要提供一个创建产品的接口，而由其子类来确定具体要创建的对象，利用面向对象的多态性和里氏代换原则，在程序运行时，子类对象将覆盖父类对象，从而使得系统更容易扩展。

- 将创建对象的任务委托给多个工厂子类中的某一个，客户端在使用时可以无须关心是哪一个工厂子类创建产品子类，需要时再动态指定，可将具体工厂类的类名存储在配置文件或数据库中。

#### 优缺点

**优点：**

- 在工厂方法模式中，工厂方法用来创建客户所需要的产品，同时还向客户隐藏了哪种具体产品类将被实例化这一细节，用户只需要关心所需产品对应的工厂，无须关心创建细节，甚至无须知道具体产品类的类名。

- 基于工厂角色和产品角色的多态性设计是工厂方法模式的关键。它能够使工厂可以自主确定创建何种产品对象，而如何创建这个对象的细节则完全封装在具体工厂内部。工厂方法模式之所以又被称为多态工厂模式，是因为所有的具体工厂类都具有同一抽象父类。

- 使用工厂方法模式的另一个优点是在系统中加入新产品时，无须修改抽象工厂和抽象产品提供的接口，无须修改客户端，也无须修改其他的具体工厂和具体产品，而只要添加一个具体工厂和具体产品就可以了。这样，系统的可扩展性也就变得非常好，完全符合“开闭原则”。

**缺点：**

- 在添加新产品时，需要编写新的具体产品类，而且还要提供与之对应的具体工厂类，系统中类的个数将成对增加，在一定程度上增加了系统的复杂度，有更多的类需要编译和运行，会给系统带来一些额外的开销。

- 由于考虑到系统的可扩展性，需要引入抽象层，在客户端代码中均使用抽象层进行定义，增加了系统的抽象性和理解难度，且在实现时可能需要用到 DOM、反射等技术，增加了系统的实现难度。

#### Android 中工厂方法的应用

**Java中的集合框架**

在 Android 开发中会用到很多数据结构，比如 ArrayList，HashMap 等。先来看下 Java 中 Collection 部分的类集框架的简要 UML 图。

![img2.png](https://i.loli.net/2019/08/29/utGvVliJX6o7Ew9.jpg)

我们知道 Iterator 是迭代器，用来遍历一个集合中的元素。而不同的数据结构遍历的方式是不一样的，所以迭代器的实现也是不同的。使用工厂方法模式将迭代器的具体类型延迟到具体容器类中，比较灵活，容易扩展。

List和Set继承自Collection接口，Collection接口继承于Iterable接口。

```
public interface Iterable<T> {
 
    Iterator<T> iterator();

    //省略部分代码
}
```

所以List和Set接口也会继承该方法。然后我们常用的两个间接实现类ArrayList和HashSet中的iterator方法就给我们构造并返回了一个迭代器对象。

ArrayList 类中 iterator() 方法的实现：

```
Override 
public Iterator<E> iterator() {
    return new ArrayListIterator();
}
```

ArrayListIterator类型定义如下：

```
private class ArrayListIterator implements Iterator<E> {
    /** Number of elements remaining in this iteration */
    private int remaining = size;

    /** Index of element that remove() would remove, or -1 if no such elt */
    private int removalIndex = -1;

    /** The expected modCount value */
    private int expectedModCount = modCount;

    public boolean hasNext() {
        return remaining != 0;
    }

    @SuppressWarnings("unchecked") public E next() {
        ArrayList<E> ourList = ArrayList.this;
        int rem = remaining;
        if (ourList.modCount != expectedModCount) {
            throw new ConcurrentModificationException();
        }
        if (rem == 0) {
            throw new NoSuchElementException();
        }
        remaining = rem - 1;
        return (E) ourList.array[removalIndex = ourList.size - rem];
    }

    public void remove() {
        Object[] a = array;
        int removalIdx = removalIndex;
        if (modCount != expectedModCount) {
            throw new ConcurrentModificationException();
        }
        if (removalIdx < 0) {
            throw new IllegalStateException();
        }
        System.arraycopy(a, removalIdx + 1, a, removalIdx, remaining);
        a[--size] = null;  // Prevent memory leak
        removalIndex = -1;
        expectedModCount = ++modCount;
    }
}
```

这个类实现了Iterator接口，接口的定义如下：

```
public interface Iterator<E> {

    boolean hasNext();

    E next();

    default void remove() {
        throw new UnsupportedOperationException("remove");
    }

    default void forEachRemaining(Consumer<? super E> action) {
        Objects.requireNonNull(action);
        while (hasNext())
            action.accept(next());
    }
}
```

基本的结构分析完了，接下来对号入座，看一看具体是如何实现工厂方法模式的。

**Iterator————>Product；ArrayListIteratorr————>ConcreteProduct。**

**Iterable/List————>Factory；ArrayList————>ConcreteFactory。**

工厂方法使一个类的实例化延迟到子类，对应着将迭代器 Iterator 的创建从 List 延迟到了ArrayList。这就是工厂方法模式。

#### 参考资料

[工厂方法模式(Factory Method Pattern)](https://design-patterns.readthedocs.io/zh_CN/latest/creational_patterns/factory_method.html)

[设计模式（五）——工厂方法模式](http://www.hollischuang.com/archives/1401)

[Android中的工厂方法模式](https://blog.csdn.net/sdkfjksf/article/details/52700648)
