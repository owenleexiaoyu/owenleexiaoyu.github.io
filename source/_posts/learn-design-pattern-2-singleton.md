---
title: 学学设计模式（2）单例模式
tags: ["Java","设计模式"]
categores: 技术
date: 2018-09-06 16:34
thumbnail: http://image.wufazhuce.com/FmOcq228kcWn_FARwr0qxsI4oxl0
---

#### 前言

上篇文章介绍了设计模式的基础概念、需要遵守的六大原则以及设计模式的分类。

这篇文章就从最简单，应用范围也最广的单例模式入手，学习第一个设计模式。

#### 定义

**确保单例类只有一个实例，并且这个单例类提供一个函数接口让其他类获取到这个唯一的实例。**

#### 优点

- 在内存中只有一个对象，节省内存空间。
- 避免频繁地创建销毁对象，可以提高性能。
- 避免对共享资源的多重占用。
- 可以全局访问。

#### 适用场景

- 需要频繁实例化然后销毁的对象。
- 创建对象时耗时过多或者耗资源过多，但又经常用到的对象。
- 有状态的工具类对象。
- 频繁访问数据库或文件的对象。
- 其他要求只有一个对象的场景。

#### 类图

![img1.png](https://i.loli.net/2019/08/29/4BYKrLUVO6k1avl.jpg)

#### 实现步骤

1. **将构造函数设为私有**
这样外界就不能直接通过 new SingleTon() 来创建实例了。
2. 创建一个**私有的静态成员变量** instance
3. 提供一个**公共的静态方法** getInstance()，返回值为 instance

#### 几种不同的写法

**1. 饿汉式**

```
public class Singleton {
    private static Singleton singleton = new Singleton();
    private Singleton(){}
    public static Singleton getInstance(){
        return singleton;
    }
}
```

饿汉式是在类装载时就创建了 instance 实例，所以是线程安全的。这种方式类加载比较慢，获取对象的速度快。不能够做到懒加载的效果。

**2. 懒汉式（线程不安全）**

```
public class Singleton {  
    private static Singleton instance;  
    private Singleton (){}   
    public static Singleton getInstance() {  
    if (instance == null) {  
        instance = new Singleton();  
    }  
    return instance;  
    }  
}  
```

懒汉式先创建一个instance的引用，在第一次调用getInstance() 方法时，进行instance的实例化，类装载速度快，获取对象速度比较慢。可以做到懒加载。在多线程中不能正常工作。

**3. 懒汉式（线程安全）**

```
public class Singleton {  
    private static Singleton instance;  
    private Singleton (){}   
    public static synchronized Singleton getInstance() {  
    if (instance == null) {  
        instance = new Singleton();  
    }  
    return instance;  
    }  
}  
```

这种实现是在 getInstance() 方法中加入了 synchronized 关键字，将其变为一个同步方法，这样就可以保证线程安全。但是每次调用 getInstance() 方法时都需要进行同步，造成不必要的同步开销，而且大部分时候我们是用不到同步的，所以不建议用这种模式。

**4. 双重校验锁**

```
public class Singleton {  
    private volatile static Singleton instance;  
    private Singleton (){}  
    public static Singleton getInstance() {  
    if (instance == null) {  
        synchronized (Singleton.class) {  
	        if (instance == null) {  
	            instance = new Singleton();  
	        }  
        }  
    }  
    return instance;  
    }  
} 
```

可以看到，在getInstance() 方法中进行了两次判空。这是为什么呢？第一次判断是为了避免不必要的同步，第二次判断是确保在此之前没有其他线程进入到 sychronized 块创建了新实例。

但是现在的getInstance() 方法还是有隐患的，问题出现在instance=new SingleTon();这段代码上。这段代码会编译成多条指令，大致上做了3件事：

> （1）给Singleton实例分配内存
（2）调用Singleton()构造函数，初始化成员字段
（3）将instance对象指向分配的内存（此时instance就不是null啦）

上面的（2）和（3）的顺序无法得到保证的，也就是说，JVM可能先初始化实例字段再把instance指向具体的内存实例，也可能先把instance指向内存实例再对实例进行初始化成员字段。考虑这种情况：一开始，第一个线程执行instance=new Singleton();这句时，JVM先指向一个堆地址，而此时，又来了一个线程2，它发现instance不是null，就直接拿去用了，但是堆里面对单例对象的初始化并没有完成，最终出现错误~ 。

所以为了解决这个隐患，对 instance 变量加了 volatile 关键字。volatile 关键字的作用是：线程每次使用到被volatile 关键字修饰的变量时，都会去堆里拿最新的数据。换句话说，就是每次使用 instance 时，保证了 instance 是最新的。

**5. 静态内部类实现单例模式**

```
public class Singleton { 
    private Singleton(){
    }
      public static Singleton getInstance(){  
        return SingletonHolder.INSTANCE;  
    }  
    private static class SingletonHolder {  
        private static final Singleton INSTANCE = new Singleton();  
    }  
} 
```

第一次加载 Singleton 类时并不会初始化 INSTANCE，只有第一次调用 getInstance() 方法时虚拟机加载SingletonHolder 并初始化 INSTANCE，这样不仅能确保线程安全也能保证 Singleton 类的唯一性，所以推荐使用静态内部类单例模式。

**6. 枚举单例**

```
public enum Singleton {  
    INSTANCE;  
    public void whateverMethod() {  
    }  
}  
```

这种方式是 Effective Java作者 Josh Bloch 提倡的方式，它不仅能避免多线程同步问题，而且还能防止反序列化重新创建新的对象。

#### 单例与序列化

如果Singleton实现了java.io.Serializable接口，那么这个类的实例就可能被序列化和复原。不管怎样，如果你序列化一个单例类的对象，接下来复原多个那个对象，那你就会有多个单例类的实例。

可以这样解决：

```
public class Singleton implements java.io.Serializable {     
   public static Singleton INSTANCE = new Singleton();     
   private Singleton() {}     
   private Object readResolve() {     
       return INSTANCE;     
   }    
}   
```


#### 单例在 Android 中应用

在Android中调用系统服务时拿到的各种Manager对象就是个单例。比如：

```
//获取WindowManager服务引用
WindowManager wm = (WindowManager)getSystemService(Context.WINDOW_SERVICE);  
```

其内部是通过单例的方式返回的。

#### 参考资料

[单例模式](http://wiki.jikexueyuan.com/project/java-design-pattern/singleton-pattern.html)

[从Android代码中来记忆23种设计模式](https://www.jianshu.com/p/1a9f571ad7c0)

[单例模式的七种写法](https://blog.csdn.net/itachi85/article/details/50510124)

[Android设计模式源码解析之单例模式](https://github.com/simple-Android-framework/android_design_patterns_analysis/tree/master/singleton/mr.simple)
