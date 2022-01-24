---
layout: post
title: 学学设计模式（6）建造者模式
tags: ["Java","设计模式"]
categores: 技术
date: 2018-09-20 19:34
---

#### 背景

建造者模式和工厂模式有相似之处，都是创建型的设计模式，都是用于构造一个对象。建造者模式和工厂模式的主要区别在于建造者模式主要用于复杂对象的创建。

在复杂对象中，有很多成员属性，而且在这些属性中，还可能存在一些限制，如某些属性没有赋值则复杂对象不能作为一个完整产品使用了；有些属性的赋值必须按照一定的顺序，一个属性没有赋值之前，另一个属性无法赋值。

#### 模式定义

**建造者模式是将一个复杂对象的构建和它的表示分离，使得同样的构建过程可以创建不同的表示。**建造者模式又可称为生成者模式。

#### 模式结构

**类图：**

![img1.png](https://i.loli.net/2019/08/29/68wyB5FOTGHPbdR.jpg)

建造者模式包含如下角色：

Builder：抽象建造者
ConcreteBuilder：具体建造者
Director：指挥者
Product：产品

**产品类**：一般是一个较为复杂的对象，也就是说创建对象的过程比较复杂，一般会有比较多的代码量。在本类图中，产品类是一个具体的类，而非抽象类。实际编程中，产品类可以是由一个抽象类与它的不同实现组成，也可以是由多个抽象类与他们的实现组成。

**抽象建造者**：引入抽象建造者的目的，是为了将建造的具体过程交与它的子类来实现。这样更容易扩展。一般至少会有两个抽象方法，一个用来建造产品，一个是用来返回产品。

**建造者**：实现抽象类的所有未实现的方法，具体来说一般是两项任务：组建产品；返回组建好的产品。

**导演类**：负责调用适当的建造者来组建产品，导演类一般不与产品类发生依赖关系，与导演类直接交互的是建造者类。一般来说，导演类被用来封装程序中易变的部分。

#### 代码实现

```
    class Product {
        private String name;
        private String type;
        public void showProduct(){
            System.out.println("名称："+name);
            System.out.println("型号："+type);
        }
        public void setName(String name) {
            this.name = name;
        }
        public void setType(String type) {
            this.type = type;
        }
    }

    abstract class Builder {
        public abstract void setPart(String arg1, String arg2);
        public abstract Product getProduct();
    }
    class ConcreteBuilder extends Builder {
        private Product product = new Product();

        public Product getProduct() {
            return product;
        }

        public void setPart(String arg1, String arg2) {
            product.setName(arg1);
            product.setType(arg2);
        }
    }

    public class Director {
        private Builder builder = new ConcreteBuilder();
        public Product getAProduct(){
            builder.setPart("宝马汽车","X7");
            return builder.getProduct();
        }
        public Product getBProduct(){
            builder.setPart("奥迪汽车","Q5");
            return builder.getProduct();
        }
    }
    public class Client {
        public static void main(String[] args){
            Director director = new Director();
            Product product1 = director.getAProduct();
            product1.showProduct();

            Product product2 = director.getBProduct();
            product2.showProduct();
        }
    }
```
#### 模式分析

在建造者模式的结构中引入了一个指挥者类，该类的作用主要有两个：一方面它隔离了客户与生产过程；另一方面它负责控制产品的生成过程。指挥者针对抽象建造者编程，客户端只需要知道具体建造者的类型，即可通过指挥者类调用建造者的相关方法，返回一个完整的产品对象。

**优点：**

1. 客户端不必知道产品内部组成的细节，将产品本身与产品的创建过程解耦，使得相同的创建过程可以创建不同的产品对象；
2. 每一个具体建造者都相对独立，而与其他的具体建造者无关，因此可以很方便地替换具体建造者或增加新的具体建造者，符合「开闭原则」；
3. 可以更加精细地控制产品的创建过程。

**缺点：**

1. 由于建造者模式所创建的产品一般具有较多的共同点，其组成部分相似，因此其使用范围受到一定的限制
2. 如果产品的内部变化复杂，可能会导致需要定义很多具体建造者类来实现这种变化，导致系统变得很庞大。

#### 适用情况

1. 需要生成的产品对象有复杂的内部结构，这些产品对象通常包含多个成员属性；
2. 需要生成的产品对象的属性相互依赖，需要指定其生成顺序；
3. 需要生成的产品对象有很多可选属性。


#### 模式的简化

省略抽象建造者角色：如果系统中只需要一个具体建造者的话，可以省略掉抽象建造者。
省略指挥者角色：在具体建造者只有一个的情况下，如果抽象建造者角色已经被省略掉，那么还可以省略指挥者角色，让 Builder 角色扮演指挥者与建造者双重角色。

一般来说，Builder 常常作为实际产品的静态内部类来实现（提高内聚性），所以 Product、Director、Builder 常常在一个类文件中。

#### 和抽象工厂的比较

与抽象工厂模式相比， 建造者模式返回一个组装好的完整产品 ，而 抽象工厂模式返回一系列相关的产品，这些产品位于不同的产品等级结构，构成了一个产品族。

#### 在 Android 中应用

Android 中的 AlertDialog 就用到了建造者模式，调用 AlertDialog.Builder的create() 方法可以返回一个 AlertDialog 对象。

```
AlertDialog.Builder builder = new AlertDialog.Builder(activity);//创建一个Builder对象
        builder.setIcon(R.drawable.icon);
        builder.setTitle("标题");
        builder.setMessage("信息");
        builder.setPositiveButton("确定",
                new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {

                    }
                });
        AlertDialog alertDialog = builder.create();//创建AlertDialog对象
        alertDialog.show();//展示AlertDialog

```

#### 参考资料

[建造者模式](https://design-patterns.readthedocs.io/zh_CN/latest/creational_patterns/builder.html)

[建造者模式-极客学院WIKI](http://wiki.jikexueyuan.com/project/java-design-pattern/builder-pattern.html)

[设计模式（九）——建造者模式](http://www.hollischuang.com/archives/1477)

[【Android设计模式系列】卖热干面的启发---Builder模式](https://mp.weixin.qq.com/s/DOT59A--UMZDyE6CzYpySQ)


