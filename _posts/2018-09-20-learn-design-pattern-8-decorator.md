---
layout: post
title: 学学设计模式（8）装饰者模式
tags: ["Java","设计模式"]
categores: 技术
date: 2018-09-20 21:34
cover: http://image.wufazhuce.com/Ft23lIu-i6SOxrMcwnU2FJEOKQDb
---

一般有两种方式可以实现给一个类或对象增加行为：

- 继承机制，使用继承机制是给现有类添加功能的一种有效途径，通过继承一个现有类可以使得子类在拥有自身方法的同时还拥有父类的方法。但是这种方法是静态的，用户不能控制增加行为的方式和时机，并且随着功能的增多，子类会很臃肿。
- 关联机制，即将一个类的对象嵌入另一个对象中，由另一个对象来决定是否调用嵌入对象的行为以便扩展自己的行为。


装饰者模式以对客户透明的方式动态地给一个对象附加上更多的责任，换言之，客户端并不会觉得对象在装饰前和装饰后有什么不同。装饰模式可以在不需要创造更多子类的情况下，将对象的功能加以扩展。

#### 定义

装饰器模式（Decorator Pattern）允许向一个现有的对象添加新的功能，同时又不改变其结构。这种类型的设计模式属于结构型模式，它是作为现有的类的一个包装。就增加对象功能来说，装饰模式比生成子类实现更为灵活。

#### 模式结构

装饰模式包含如下角色：

- Component: 抽象构件
- ConcreteComponent: 具体构件
- Decorator: 抽象装饰类
- ConcreteDecorator: 具体装饰类

![img1.png](https://i.loli.net/2019/08/29/P1TwIDlrde7SnLM.jpg)

#### 代码实现

我们以一个示例来看看装饰者模式的代码该如何实现：

装饰者模式为已有类动态附加额外的功能就像 LOL、王者荣耀等类 Dota 游戏中，英雄升级一样。每次英雄升级都会附加一个额外技能点学习技能。具体的英雄就是 ConcreteComponent，技能栏就是装饰器 Decorator，每个技能就是 ConcreteDecorator。

```
//Component 英雄接口 
public interface Hero {
    //学习技能
    void learnSkills();
}
//ConcreteComponent 具体英雄盲僧
public class BlindMonk implements Hero {
    
    private String name;
    
    public BlindMonk(String name) {
        this.name = name;
    }

    @Override
    public void learnSkills() {
        System.out.println(name + "学习了以上技能！");
    }
}
//Decorator 技能栏
public class Skills implements Hero{
    
    //持有一个英雄对象接口
    private Hero hero;
    
    public Skills(Hero hero) {
        this.hero = hero;
    }

    @Override
    public void learnSkills() {
        if(hero != null)
            hero.learnSkills();
    }    
}
//ConreteDecorator 技能：Q
public class Skill_Q extends Skills{
    
    private String skillName;

    public Skill_Q(Hero hero,String skillName) {
        super(hero);
        this.skillName = skillName;
    }

    @Override
    public void learnSkills() {
        System.out.println("学习了技能Q:" +skillName);
        super.learnSkills();
    }
}
//ConreteDecorator 技能：W
public class Skill_W extends Skills{

    private String skillName;

    public Skill_W(Hero hero,String skillName) {
        super(hero);
        this.skillName = skillName;
    }

    @Override
    public void learnSkills() {
        System.out.println("学习了技能W:" + skillName);
        super.learnSkills();
    }
}
//ConreteDecorator 技能：E
public class Skill_E extends Skills{
    
    private String skillName;
    
    public Skill_E(Hero hero,String skillName) {
        super(hero);
        this.skillName = skillName;
    }

    @Override
    public void learnSkills() {
        System.out.println("学习了技能E:"+skillName);
        super.learnSkills();
    }
}
//ConreteDecorator 技能：R
public class Skill_R extends Skills{    
    
    private String skillName;
    
    public Skill_R(Hero hero,String skillName) {
        super(hero);
        this.skillName = skillName;
    }
    
    @Override
    public void learnSkills() {
        System.out.println("学习了技能R:" +skillName );
        super.learnSkills();
    }
}
//客户端：召唤师
public class Player {
    public static void main(String[] args) {
        //选择英雄
        Hero hero = new BlindMonk("李青");
        
        Skills skills = new Skills(hero);
        Skills r = new Skill_R(skills,"猛龙摆尾");
        Skills e = new Skill_E(r,"天雷破/摧筋断骨");
        Skills w = new Skill_W(e,"金钟罩/铁布衫");
        Skills q = new Skill_Q(w,"天音波/回音击");
        //学习技能
        q.learnSkills();
    }
}
```

执行结果：

> 学习了技能Q:天音波/回音击
学习了技能W:金钟罩/铁布衫
学习了技能E:天雷破/摧筋断骨
学习了技能R:猛龙摆尾
李青学习了以上技能！

#### 模式分析

**优点：**

1. 可以提供比继承更多的灵活性
2. 可以通过一种动态的方式来扩展一个对象的功能
3. 通过使用不同的具体装饰类以及这些装饰类的 排列组合，可以创造出很多不同行为的组合
4. 具体构件类与具体装饰类可以独立变化，用户可以根据需要增加新的具体构件类和具体装饰类。

**缺点：**

1. 使用装饰模式进行系统设计时将产生很多小对象和很多具体装饰类。这些装饰类和小对象的产生将增加系统的复杂度，加大学习与理解的难度。
2. 装饰模式比继承更加易于出错，排错也很困难，对于多次装饰的对象，调试时寻找错误可能需要逐级排查，较为烦琐。

**适用场景：**

1. 在不影响其他对象的情况下，以动态、透明的方式给 单个对象添加职责；
2. 需要动态地给一个对象增加功能，这些功能也可以动态地被撤销；
3. 当不能采用继承的方式对系统进行扩充或者采用继承不利于系统扩展和维护时。

#### 在 Android 中的应用

1. Java 中的 IO  流就是使用了装饰者模式。
2. 在 Android 源码中 Context 类用到了装饰者模式，其中 ContextWrapper 类就是装饰者。

#### 参考资料

[装饰模式](https://design-patterns.readthedocs.io/zh_CN/latest/structural_patterns/decorator.html)

[装饰器模式](http://www.runoob.com/design-pattern/decorator-pattern.html)


