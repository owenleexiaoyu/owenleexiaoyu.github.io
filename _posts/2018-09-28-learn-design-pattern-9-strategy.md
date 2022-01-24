---
layout: post
title: 学学设计模式（9）策略模式
tags: ["Java","设计模式"]
categories: 技术
date: 2018-09-28 13:13
cover: https://s2.loli.net/2022/01/24/c1QxA2Nnz6WuPGC.jpg
---

##### 定义

策略模式（Strategy Pattern）：针对一组算法，将每一个算法封装到具有共同接口的独立的类中，从而使它们能够相互替换。策略模式使得算法可以在不影响客户端的情况下发生变化。

#### 模式结构

策略模式是对算法的包装，是把使用算法的责任和算法本身分割开来，委派给不同的对象管理。策略模式通常把一个系列的算法包装到一系列的策略类里面，作为一个抽象策略类的子类。用一句话来说，就是：「准备一组算法，并将每一个算法封装起来，使得它们可以互换」。

**策略模式包含如下角色：**

- Context：环境类
- Strategy：抽象策略类
- ConcreteStrategy：具体策略类

![img1.png](https://i.loli.net/2019/08/29/hnQeDz2WgAZ1Ums.jpg)

#### 代码实现

我们利用一个场景来看看代码如何实现：

假设现在要设计一个贩卖各类书籍的电子商务网站的购物车系统。一个最简单的情况就是把所有货品的单价乘上数量，但是实际情况肯定比这要复杂。比如，本网站可能对所有的高级会员提供每本20%的促销折扣；对中级会员提供每本10%的促销折扣；对初级会员没有折扣。

根据描述，折扣是根据以下的几个算法中的一个进行的：

算法一：对初级会员没有折扣。

算法二：对中级会员提供 10% 的促销折扣。

算法三：对高级会员提供 20% 的促销折扣。

使用策略模式来实现的结构图如下：

![img2.png](https://i.loli.net/2019/08/29/5lbou2GDAKdF7ZM.jpg)

策略类：

```
//抽象折扣类
public interface MemberStrategy {
    /**
     * 计算图书的价格
     * @param booksPrice    图书的原价
     * @return    计算出打折后的价格
     */
    public double calcPrice(double booksPrice);
}

//-------------初级会员折扣类
public class PrimaryMemberStrategy implements MemberStrategy {

    @Override
    public double calcPrice(double booksPrice) {
        
        System.out.println("对于初级会员的没有折扣");
        return booksPrice;
    }

}

//-------------中级会员折扣类
public class IntermediateMemberStrategy implements MemberStrategy {

    @Override
    public double calcPrice(double booksPrice) {

        System.out.println("对于中级会员的折扣为10%");
        return booksPrice * 0.9;
    }

}

//-------------高级会员折扣类
public class AdvancedMemberStrategy implements MemberStrategy {

    @Override
    public double calcPrice(double booksPrice) {
        
        System.out.println("对于高级会员的折扣为20%");
        return booksPrice * 0.8;
    }
}
```

价格类：

```
public class Price {
    //持有一个具体的策略对象
    private MemberStrategy strategy;
    /**
     * 构造函数，传入一个具体的策略对象
     * @param strategy    具体的策略对象
     */
    public Price(MemberStrategy strategy){
        this.strategy = strategy;
    }
    
    /**
     * 计算图书的价格
     * @param booksPrice    图书的原价
     * @return    计算出打折后的价格
     */
    public double quote(double booksPrice){
        return this.strategy.calcPrice(booksPrice);
    }
}
```

客户端：

```
public class Client {

    public static void main(String[] args) {
        //选择并创建需要使用的策略对象
        MemberStrategy strategyA = new AdvancedMemberStrategy();
        //创建环境
        Price priceA = new Price(strategyA);
        //计算价格
        double quote = priceA.quote(300);
        System.out.println("图书的最终价格为：" + quote);
        
        MemberStrategy strategyB = new PrimaryMemberStrategy();
        Price priceB = new Price(strategyB);
        quote = priceB.quote(300);
        System.out.println("图书的最终价格为：" + quote);
    }

}
```

最终执行结果为：

> 对于高级会员的折扣为20%
图书的最终价格为：240.0
对于初级会员的没有折扣
图书的最终价格为：300.0

#### 模式分析

**策略模式的重心**

策略模式的重心不是如何实现算法，而是如何组织、调用这些算法，从而让程序结构更灵活，具有更好的维护性和扩展性。

**算法的平等性**

策略模式一个很大的特点就是各个策略算法的平等性。对于一系列具体的策略算法，大家的地位是完全一样的，正因为这个平等性，才能实现算法之间可以相互替换。所有的策略算法在实现上也是相互独立的，相互之间是没有依赖的。

所以可以这样描述这一系列策略算法：策略算法是相同行为的不同实现。

**运行时策略的唯一性**

运行期间，策略模式在每一个时刻只能使用一个具体的策略实现对象，虽然可以动态地在不同的策略实现中切换，但是同时只能使用一个。

**公有的行为**

经常见到的是，所有的具体策略类都有一些公有的行为。这时候，就应当把这些公有的行为放到共同的抽象策略角色 Strategy 类里面。当然这时候抽象策略角色必须要用 Java 抽象类实现，而不能使用接口。

#### 策略模式的优点

1. 策略模式提供了对「开闭原则」的完美支持，用户可以在不修改原有系统的基础上选择算法或行为，也可以灵活地增加新的算法或行为。
2. 策略模式提供了管理相关的算法族的办法。
3. 策略模式提供了可以替换继承关系的办法。
4. 使用策略模式可以避免使用多重条件转移语句。

#### 策略模式的缺点

1. 客户端必须知道所有的策略类，并自行决定使用哪一个策略类。

2. 策略模式将造成产生很多策略类，可以通过使用享元模式在一定程度上减少对象的数量。

#### 在 Android 中的应用

在属性动画中使用时间插值器的时候用到了策略模式。在使用动画时，你可以选择线性插值器（LinearInterpolator）、加速减速插值器（AccelerateDecelerateInterpolator）、减速插值器（DecelerateInterpolator）以及自定义的插值器。这些插值器都是实现根据时间流逝的百分比来计算出当前属性值改变的百分比。通过根据需要选择不同的插值器，实现不同的动画效果。 

#### 参考资料

[从Android代码中来记忆23种设计模式](https://www.jianshu.com/p/1a9f571ad7c0)

[《JAVA与模式》之策略模式](https://www.cnblogs.com/java-my-life/archive/2012/05/10/2491891.html)

[策略模式](https://design-patterns.readthedocs.io/zh_CN/latest/behavioral_patterns/strategy.html)