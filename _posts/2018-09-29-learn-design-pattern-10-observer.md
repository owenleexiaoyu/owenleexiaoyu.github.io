---
layout: post
title: 学学设计模式（10）观察者模式
tags: ["Java","设计模式"]
categores: 技术
date: 2018-09-29 10:34
cover: https://s2.loli.net/2022/01/24/tTJb5fMG7W3VKqj.jpg
---

#### 动机

建立一种对象与对象之间的依赖关系，一个对象发生改变时将自动通知其他对象，其他对象将相应做出反应。在此，发生改变的对象称为观察目标，而被通知的对象称为观察者，一个观察目标可以对应多个观察者，而且这些观察者之间没有相互联系，可以根据需要增加和删除观察者，使得系统更易于扩展，这就是观察者模式的模式动机。

#### 定义

观察者模式(Observer Pattern)：观察者模式定义了一种一对多的依赖关系，让多个观察者对象同时监听某一个目标对象。这个目标对象在状态上发生变化时，会通知所有观察者对象，使它们能够自动更新自己。观察者模式又叫做发布-订阅（Publish/Subscribe）模式。是一种行为型设计模式。

#### 结构

观察者模式包含如下角色：

- Subject: 抽象目标
- ConcreteSubject: 具体目标
- Observer: 抽象观察者
- ConcreteObserver: 具体观察者

![img1.png](https://i.loli.net/2019/08/29/vhK6qDnCjtZoWQY.jpg)

#### 代码实现

我们用代码来实现一个观察者模式：

目标类：

```
//-----------抽象目标类
public abstract class Subject {
	//用来保存注册的观察者
	private List<Observer> list = new ArrayList<>();
	/**
	 * 注册观察者对象
	 * @param observer
	 */
	public void attach(Observer observer){
		list.add(observer);
		System.out.println("增加了一个观察者"+observer.getName());
	}
	/**
	 * 删除观察者对象
	 * @param observer
	 */
	public void detach(Observer observer){
		list.remove(observer);
		System.out.println("删除了一个观察者");
	}
	/**
	 * 通知所有注册的观察者对象
	 * @param newState
	 */
	public void notifyObservers(String newState){
		for(Observer o :list){
			o.update(newState);
		}
	}
}
//-----------具体目标类
public class ConcreteSubject extends Subject{
	private String state;
	
	public String getState(){
		return state;
	}
	public void change(String newState){
		state = newState;
		System.out.println("目标状态为："+state);
		notifyObservers(state);
	}
}
```

观察者类：

```
//----------------抽象观察者
public abstract class Observer {
	//观察者的名字
	protected String name;
	//观察者的状态
	protected String observerState;
	public String getName(){
		return name;
	}
	
	public Observer(String name){
		this.name = name;
	}
	
	/**
	 * 更新状态
	 * @param state
	 */
	public abstract void update(String state);
}
//--------------具体观察者
public class ConcreteObserver extends Observer{
	
	public ConcreteObserver(String name) {
		super(name);
	}
	
	/**
	 * 更新观察者的状态，使其与目标状态一致
	 */
	@Override
	public void update(String state) {
		observerState = state;
		System.out.println("观察者["+getName()+"]状态："+observerState);
	}
	
}
```

运行结果为：

> 增加了一个观察者1号
增加了一个观察者2号
增加了一个观察者3号
目标状态为：新状态
观察者[1号]状态：新状态
观察者[2号]状态：新状态
观察者[3号]状态：新状态

运行时，首先创建了具体目标类的实例，以及 3 个观察者对象。然后，它调用主题对象的 attach() 方法，将这 3 个观察者对象向目标对象登记，也就是将它加入到目标对象的 List 中去。

这时，客户端调用目标的 change() 方法，改变了目标对象的内部状态。目标对象在状态发生变化时，调用超类的 notifyObservers() 方法，通知所有注册过的观察者对象。

#### 推模型和拉模型

观察者又可以分为推模型和拉模型，上面代码实现的就是一个推模型。

- 推模型
目标对象向观察者推送主题的详细信息，不管观察者是否需要，推送的信息通常是目标对象的全部或部分数据。
- 拉模型
目标对象在通知观察者的时候，只传递少量信息。如果观察者需要更具体的信息，由观察者主动到目标对象中获取，相当于是观察者从目标对象中拉数据。一般这种模型的实现中，会把目标对象自身通过 update() 方法传递给观察者，这样在观察者需要获取数据的时候，就可以通过这个引用来获取了。

##### 拉模型代码实现

**抽象目标类**：拉模型的抽象目标类主要的改变是 nodifyObservers() 方法。在循环通知观察者的时候，也就是循环调用观察者的 update() 方法的时候，传入的参数不同了。

```
public abstract class Subject {
	//用来保存注册的观察者
	private List<Observer> list = new ArrayList<>();
	/**
	 * 注册观察者对象
	 * @param observer
	 */
	public void attach(Observer observer){
		list.add(observer);
		System.out.println("增加了一个观察者"+observer.getName());
	}
	/**
	 * 删除观察者对象
	 * @param observer
	 */
	public void detach(Observer observer){
		list.remove(observer);
		System.out.println("删除了一个观察者");
	}
	/**
	 * 通知所有注册的观察者对象
	 * @param newState
	 */
	public void notifyObservers(){
		for(Observer o :list){
			o.update(this);
		}
	}
}
```

**具体目标类**：跟推模型相比，有一点变化，就是调用通知观察者的方法的时候，不需要传入参数了。

```
public class ConcreteSubject extends Subject{
	private String state;
	
	public String getState(){
		return state;
	}
	public void change(String newState){
		state = newState;
		System.out.println("目标状态为："+state);
		notifyObservers();
	}
}
```

**抽象观察者类**：拉模型通常都是把主题对象当做参数传递。

```
public abstract class Observer {
	//观察者的名字
	protected String name;
	//观察者的状态
	protected String observerState;
	public String getName(){
		return name;
	}
	
	public Observer(String name){
		this.name = name;
	}
	
	/**
	 * 更新状态
	 * @param state
	 */
	public abstract void update(Subject subject);
}
```

**具体观察者**

```
public class ConcreteObserver extends Observer{
	
	public ConcreteObserver(String name) {
		super(name);
	}
	
	/**
	 * 更新观察者的状态，使其与目标状态一致
	 */
	@Override
	public void update(Subject subject) {
		observerState = ((ConcreteSubject)subject).getState();
		System.out.println("观察者["+getName()+"]状态："+observerState);
	}
	
}
```
##### 两种模式的比较

- 推模型是假定目标对象知道观察者需要的数据；而拉模型是主题对象不知道观察者具体需要什么数据，没有办法的情况下，干脆把自身传递给观察者，让观察者自己去按需要取值。

- 推模型可能会使得观察者对象难以复用，因为观察者的 update() 方法是按需要定义的参数，可能无法兼顾没有考虑到的使用情况。这就意味着出现新情况的时候，就可能提供新的 update() 方法，或者是干脆重新实现观察者；而拉模型就不会造成这样的情况，因为拉模型下，update() 方法的参数是主题对象本身，这基本上是主题对象能传递的最大数据集合了，基本上可以适应各种情况的需要。

#### JDK 中的观察者模式支持

在 Java 的 java.util 库里面，提供了一个 Observable 类以及一个 Observer 接口，构成对观察者模式的支持。

##### Observer 接口

这个接口只定义了一个方法，即 update() 方法，当被观察者对象的状态发生变化时，被观察者对象的 notifyObservers() 方法就会调用这一方法。

```
public interface Observer {
    void update(Observable o, Object arg);
}
```

##### Observable 类

被观察者类都是 java.util.Observable 类的子类。Observable 提供公开的方法支持观察者对象，这些方法中有两个对 Observable 的子类非常重要：一个是 setChanged()，另一个是 notifyObservers()。第一方法 setChanged() 被调用之后会设置一个内部标记变量，代表被观察者对象的状态发生了变化。第二个是 notifyObservers()，这个方法被调用时，会调用所有注册过的观察者对象的 update() 方法，使这些观察者对象可以更新自己。

```
public class Observable {
    private boolean changed = false;
    private Vector obs;
   
    /** Construct an Observable with zero Observers. */

    public Observable() {
    	obs = new Vector();
    }

    /**
     * 将一个观察者添加到观察者聚集上面
     */
    public synchronized void addObserver(Observer o) {
        if (o == null)
            throw new NullPointerException();
        if (!obs.contains(o)) {
        	obs.addElement(o);
        }
    }

    /**
     * 将一个观察者从观察者聚集上删除
     */
    public synchronized void deleteObserver(Observer o) {
        obs.removeElement(o);
    }

    public void notifyObservers() {
    	notifyObservers(null);
    }

    /**
     * 如果本对象有变化（那时hasChanged 方法会返回true）
     * 调用本方法通知所有登记的观察者，即调用它们的update()方法
     * 传入this和arg作为参数
     */
    public void notifyObservers(Object arg) {

        Object[] arrLocal;

        synchronized (this) {

        	if (!changed)
                return;
            arrLocal = obs.toArray();
            clearChanged();
        }

        for (int i = arrLocal.length-1; i>=0; i--)
            ((Observer)arrLocal[i]).update(this, arg);
    }

    /**
     * 将观察者聚集清空
     */
    public synchronized void deleteObservers() {
    	obs.removeAllElements();
    }

    /**
     * 将“已变化”设置为true
     */
    protected synchronized void setChanged() {
    	changed = true;
    }

    /**
     * 将“已变化”重置为false
     */
    protected synchronized void clearChanged() {
    	changed = false;
    }

    /**
     * 检测本对象是否已变化
     */
    public synchronized boolean hasChanged() {
    	return changed;
    }

    /**
     * Returns the number of observers of this <tt>Observable</tt> object.
     *
     * @return  the number of observers of this object.
     */
    public synchronized int countObservers() {
    	return obs.size();
    }
}
```

##### 使用示例

这里给出一个非常简单的例子，说明怎样使用 Java 所提供的对观察者模式的支持。在这个例子中，被观察对象叫做 Watched；而观察者对象叫做 Watcher。Watched 对象继承自 java.util.Observable 类；而 Watcher 对象实现了 java.util.Observer 接口。另外有一个 Test 类扮演客户端角色。

**被观察者 Watched 类**

```
public class Watched extends Observable{
    
    private String data = "";
    
    public String getData() {
        return data;
    }

    public void setData(String data) {
        
        if(!this.data.equals(data)){
            this.data = data;
            setChanged();
        }
        notifyObservers();
    }
}
```

**观察者 Watcher 类**

```
public class Watcher implements Observer{
    
    public Watcher(Observable o){
        o.addObserver(this);
    }
    
    @Override
    public void update(Observable o, Object arg) {
        System.out.println("状态发生改变：" + ((Watched)o).getData());
    }

}
```

**测试类**

```
public class Test {

    public static void main(String[] args) {
        //创建被观察者对象
        Watched watched = new Watched();
        //创建观察者对象，并将被观察者对象登记
        Observer watcher = new Watcher(watched);
        //给被观察者状态赋值
        watched.setData("start");
        watched.setData("run");
        watched.setData("stop");
    }
}
```

首先创建了 Watched 和 Watcher 对象。在创建 Watcher 对象时，将 Watched 对象作为参数传入；然后调用 Watched 对象的 setData() 方法，触发 Watched 对象的内部状态变化；Watched 对象进而通知实现登记过的 Watcher 对象，也就是调用它的 update() 方法。

#### 模式分析

- 观察者模式描述了如何建立对象与对象之间的依赖关系，如何构造满足这种需求的系统。
- 这一模式中的关键对象是观察目标和观察者，一个目标可以有任意数目的与之相依赖的观察者，一旦目标的状态发生改变，所有的观察者都将得到通知。
- 作为对这个通知的响应，每个观察者都将即时更新自己的状态，以与目标状态同步，这种交互也称为发布-订阅（Publish-Subscribe）。目标是通知的发布者，它发出通知时并不需要知道谁是它的观察者，可以有任意数目的观察者订阅它并接收通知。

##### 优点

- 观察者模式可以实现表示层和数据逻辑层的分离，并定义了稳定的消息更新传递机制。
- 抽象了更新接口，使得可以有各种各样不同的表示层作为具体观察者角色。
- 观察者模式在观察目标和观察者之间建立一个抽象的耦合。
- 观察者模式支持广播通信。
- 观察者模式符合「开闭原则」的要求。

##### 缺点

- 如果一个观察目标对象有很多直接和间接的观察者的话，将所有的观察者都通知到会花费很多时间。
- 如果在观察者和观察目标之间有循环依赖的话，观察目标会触发它们之间进行循环调用，可能导致系统崩溃。
- 观察者模式没有相应的机制让观察者知道所观察的目标对象是怎么发生变化的，而仅仅只是知道观察目标发生了变化。

#### 适用场景

- 一个抽象模型有两个方面，其中一个方面依赖于另一个方面；
- 一个对象的改变将导致其他一个或多个对象也发生改变，而不知道具体有多少对象将发生改变；
- 一个对象必须通知其他对象，而并不知道这些对象是谁；
- 需要在系统中创建一个触发链。A 对象的行为将影响 B 对象，B 对象的行为将影响 C 对象……可以使用观察者模式创建一种链式触发机制。

#### 模式应用

观察者模式在软件开发中应用非常广泛，如某电子商务网站可以在执行发送操作后给用户多个发送商品打折信息，某团队战斗游戏中某队友牺牲将给所有成员提示等等，凡是涉及到一对一或者一对多的对象交互场景都可以使用观察者模式。

#### 在 Android 中应用

Android 中大量的使用了观察者模式，Framework 层里面的事件驱动都是基于观察者模式实现的。另外在 Framework 层里面的各种服务在数据变更的时候，也是通过观察者模式实现上层数据更新的。像 View 的 Listener 监听、GPS 位置信息监听、BroadcastReceiver 等都是基于观察者模式实现的。

ListView 的适配器中有个函数 notifyDataSetChanged()，这个函数其实就是通知 ListView 的每个 Item，数据源发生了变化，让各个 Item 重新刷新一下。这里也用到了观察者模式。

#### 参考资料

[《JAVA与模式》之观察者模式](https://www.cnblogs.com/java-my-life/archive/2012/05/16/2502279.html)

[观察者模式](https://design-patterns.readthedocs.io/zh_CN/latest/behavioral_patterns/observer.html)

[当观察者模式和回调机制遇上 Android 源码](https://juejin.im/entry/57e4ef050bd1d0005bf0d362)