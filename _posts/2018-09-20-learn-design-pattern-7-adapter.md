---
layout: post
title: 学学设计模式（7）适配器模式
tags: ["Java","设计模式"]
categores: 技术
date: 2018-09-20 20:34
cover: http://image.wufazhuce.com/FnPyUIutVWLtBQ_as2AGbH362HIf
---

#### 结构型设计模式

结构型设计模式描述如何将类或对象结合在一起形成更大的结构，就像搭积木，通过简单积木的组合形成复杂的、功能更强大的积木结构。

#### 定义

适配器模式是作为两个不兼容的接口之间的桥梁，它结合了两个独立接口的功能。

适配器将一个类的接口转化成用户需要的另一个接口。适配器模式使得原本由于接口不兼容而不能一起工作的类可以一起工作。

举个真实的例子，读卡器是作为内存卡和笔记本之间的适配器。将内存卡插入读卡器，再将读卡器插入笔记本，这样就可以通过笔记本来读取内存卡。

#### 模式结构

适配器模式包含以下角色：

- Target：目标抽象类
- Adapter：适配器类
- Adaptee：适配者类
- Client：客户类

**类图：**

![img1.png](https://i.loli.net/2019/08/29/vyl8tO9JsumnNdw.jpg)

#### 代码实现

以手机充电器的例子来看看代码该如何实现：

**场景：**

现在主流的手机充电器口主要包含 Mini Usb、Micro Usb和 Lightning 三种。其中 Mini Usb 广泛出现在读卡器、 MP3、数码相机以及移动硬盘上。由于 Micro Usb 比 Mini Usb 更薄，所以广泛应用于手机上，常见于安卓手机。还有一个比较常见的充电器口就是苹果手机常用的 Lightning。

当然，特定型号的手机只能使用特定型号的充电器充电。比如 Iphone6 手机只能使用 Lightning 接口的充电器进行充电。但是，如果我们身边只有一条安卓的 Micro Usb 充电器线的话，我们能不能为苹果手机充电呢？答案是肯定的，只要有一个适配器就可以了。

![img2.png](https://i.loli.net/2019/08/29/DARLHqdmykY8XZ6.jpg)

现在我们就来定义这样一个适配器：

首先定义两个接口：

```
/**
 * Lighting 充电器接口
 *
 */
public interface ILighting {
	public void chargeWithLighting();

}
/**
 * MicroUsb充电器接口
 *
 */
public interface IMicroUsb {
	public void chargeWithMicroUsb();
}
```

接着定义两个接口的实现类：

```
/**
 * 苹果设备的充电器
 *
 */
public class AppleCharger implements ILighting{

	@Override
	public void chargeWithLighting() {
		System.out.println("使用Lighting型号充电器充电");	
	}
}
/**
 * 安卓设备的充电器
 *
 */
public class AndroidCharger implements IMicroUsb{

	@Override
	public void chargeWithMicroUsb() {
		System.out.println("使用MicroUsb型号充电器充电");
	}
}
```

然后定义两个手机：

```
/**
 * Iphone6手机，只能使用Linghting接口
 * @author OwenLee
 *
 */
public class Iphone6 {
	private ILighting lighting;
	
	public Iphone6(){
		
	}

	public Iphone6(ILighting lighting){
		this.lighting = lighting;
	}

	public ILighting getLighting() {
		return lighting;
	}

	public void setLighting(ILighting lighting) {
		this.lighting = lighting;
	}
	
	public void charge(){
		System.out.println("----Iphone6开始充电----");
		lighting.chargeWithLighting();
		System.out.println("----Iphone6结束充电----");
	}
}
/**
 * 小米手机，只能使用MicroUsb接口
 * @author OwenLee
 *
 */
public class Xiaomi8 {
	private IMicroUsb microUsb;

	public Xiaomi8(){
		
	}
	public Xiaomi8(IMicroUsb microUsb) {
		super();
		this.microUsb = microUsb;
	}
	public IMicroUsb getMicroUsb() {
		return microUsb;
	}
	public void setMicroUsb(IMicroUsb microUsb) {
		this.microUsb = microUsb;
	}
	
	public void charge(){
		System.out.println("----Xiaomi8开始充电----");
		microUsb.chargeWithMicroUsb();
		System.out.println("----Xiaomi8结束充电----");
	}
}
```

最后就来实现将 MicroUsb 接口转化为 Lighting 接口的适配器 LightingAdaper：

```
public class LightingAdapter implements ILighting{
	
	private IMicroUsb microUsb;
	
	public LightingAdapter() {
		
	}
	public LightingAdapter(IMicroUsb microUsb){
		this.microUsb = microUsb;
	}

	public IMicroUsb getMicroUsb() {
		return microUsb;
	}
	public void setMicroUsb(IMicroUsb microUsb) {
		this.microUsb = microUsb;
	}
	
	@Override
	public void chargeWithLighting() {
		microUsb.chargeWithMicroUsb();
	}

}
```
该适配器的功能是把一个 MicroUsb 转换成 Lightning。实现方式是实现目标类的接口（ILightning），然后使用组合的方式，在该适配器中定义 IMicroUsb。然后在重写的 chargeWithLightning() 方法中，采用 IMicroUsb 的方法来实现具体细节。

在主函数中进行测试：

```
public class AdaperTest {
	public static void main(String[] args) {
		Iphone6 iphone6 = new Iphone6(new AppleCharger());
		iphone6.charge();
		
		Xiaomi8 xiaomi8 = new Xiaomi8(new AndroidCharger());
		xiaomi8.charge();
		
		Iphone6 ip = new Iphone6(new LightingAdapter(new AndroidCharger()));
		ip.charge();
	}

}
```

> 执行结果为：
> ----Iphone6开始充电----
使用Lighting型号充电器充电
----Iphone6结束充电----

> ----Xiaomi8开始充电----
使用MicroUsb型号充电器充电
----Xiaomi8结束充电----

> ----Iphone6开始充电----
使用MicroUsb型号充电器充电
----Iphone6结束充电----


#### 模式分析

**优点：**

1. 将目标类和适配者类解耦，通过引入一个适配器类来重用现有的适配者类，而无须修改原有代码。

2. 增加了类的透明性和复用性，将具体的实现封装在适配者类中，对于客户端类来说是透明的，而且提高了适配者的复用性。

3. 灵活性和扩展性都非常好，通过使用配置文件，可以很方便地更换适配器，也可以在不修改原有代码的基础上增加新的适配器类，完全符合「开闭原则」。

**缺点：**

1. 过多地使用适配器，会让系统非常零乱，不易整体进行把握。比如，明明看到调用的是 A 接口，其实内部被适配成了 B 接口的实现，一个系统如果太多出现这种情况，无异于一场灾难。因此如果不是很有必要，可以不使用适配器，而是直接对系统进行重构。

2. 由于 Java 至多继承一个类，所以至多只能适配一个适配者类，而且目标类必须是抽象类。

**适用场景：**

1. 系统需要使用现有的类，而此类的接口不符合系统的需要。
2. 想要建立一个可以重复使用的类，用于与一些彼此之间没有太大关联的一些类，包括一些可能在将来引进的类一起工作，这些源类不一定有一致的接口。 

#### 模式应用

Sun 公司在 1996 年公开了 Java 语言的数据库连接工具 JDBC，JDBC 使得 Java 语言程序能够与数据库连接，并使用 SQL 语言来查询和操作数据。JDBC 给出一个客户端通用的抽象接口，每一个具体数据库引擎（如 SQL Server、Oracle、MySQL 等）的 JDBC 驱动软件都是一个介于 JDBC 接口和数据库引擎接口之间的适配器软件。抽象的 JDBC 接口和各个数据库引擎 API 之间都需要相应的适配器软件，这就是为各个不同数据库引擎准备的驱动程序。

#### 在 Android 中的应用

其实我们 Android 开发者对于适配器模式是比较熟悉的， ListView 和 RecyclerView 中就使用到了 Adaper 来将数据与视图进行对应。

ListView 为什么要使用 Adapter 模式呢？ 

我们知道，ListView 需要能够显示各式各样的视图，每个人需要的显示效果各不相同，显示的数据类型、数量等也千变万化。那么如何隔离这种变化尤为重要。

Android 的做法是增加一个 Adapter 层来应对变化，将 ListView 需要的接口抽象到 Adapter 对象中，这样只要用户实现了 Adapter 的接口，ListView 就可以按照用户设定的显示效果、数量、数据来显示特定的 Item View。 
通过代理数据集来告知 ListView 数据的个数( getCount函数 )以及每个数据的类型( getItem 函数 )，最重要的是要解决 Item View 的输出。Item View 千变万化，但终究它都是 View 类型，Adapter 统一将 Item View 输出为 View ( getView 函数 )，这样就很好的应对了 Item View 的可变性。

#### 参考资料

[设计模式（十一）——适配器模式](http://www.hollischuang.com/archives/1524)

[适配器模式](http://www.runoob.com/design-pattern/adapter-pattern.html)

 [适配器模式](https://design-patterns.readthedocs.io/zh_CN/latest/structural_patterns/adapter.html)

[从Android代码中来记忆23种设计模式](https://www.jianshu.com/p/1a9f571ad7c0)