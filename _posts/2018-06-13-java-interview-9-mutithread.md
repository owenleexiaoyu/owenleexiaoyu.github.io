---
layout: post
title: Java 笔试面试（9）多线程
tags: ["Java"]
categories: 笔试面试
date: 2018-06-13 20:45:00
cover: https://s2.loli.net/2022/01/24/kxlLf1H259gBquw.jpg
---

### Java 笔试面试（9）多线程

#### 1.线程与进程

线程是指在程序执行过程中，能够执行程序代码的一个执行单元。线程有四种状态：就绪、运行、挂起、结束。

进程是指一段正在执行的程序，一个进程可以拥有多个线程，各个线程之间共享程序的内存空间（代码段、数据段和堆空间）及一些进程级的资源（如打开的文件），但是各个线程有自己的栈空间。

关系图：

![img1.png](https://i.loli.net/2019/08/29/rJaZYBj8XdGicFx.jpg)

为什么使用多线程？
1. 使用多线程可以减少程序的响应时间
2. 与进程相比，线程的创建和切换开销更小
3. 多CPU或多核计算机本身就具有执行多线程的能力，如果使用单线程，就无法充分利用计算机资源，造成资源浪费。
4. 使用多线程能简化程序的结构，是程序便于理解和维护

#### 2. 同步和异步

同步：

当多个线程需要访问同一个资源时，需要以某种顺序保证该资源在某一个时刻只能被一个线程使用。否则，程序的运行结果是不可预料的，在这种情况下就要对数据进行同步。

要实现同步，必须要获得每个线程对象的锁。获得锁可以保证在同一时刻只有一个线程能够进入临界区（访问互斥资源的代码块），并且在这个锁释放前，其他线程不能进入临界区。如果还有其他线程也想要获得该对象的锁，就必须进入等待队列等待。只有拥有锁的线程推出临界区时，锁才会被释放，等待队列中优先级最高的线程获得该锁，进入临界区。

可以使用synchronized关键字来实现同步，它是以很大的系统开销为代价的，有时候还可能造成死锁。所以同步控制不是越多越好，要尽量避免无谓的同步控制。
实现同步的方法有两种：
- 使用同步代码块
- 使用同步方法

异步：

异步与非阻塞类似，由于每个线程都包含了运行时自身所需要的数据或方法，因此，在执行输入输出时，不必关心其他线程的状态或行为，也不必等到输入输出处理完毕后才返回。**当程序调用了一个需要花很长时间来执行的方法，并且不希望让程序等待方法的返回时，就应该使用异步编程，异步能够提高程序的效率。**

#### 3. 如何实现多线程

如何新建一个线程：
1. 继承Thread类，重写run() 方法

```
class MyThread extends Thread{
	@Override
	public void run() {
		System.out.println("线程体");
		super.run();
	}
}
public class Test {
	public static void main(String[] args) {
		MyThread thread = new MyThread();
		thread.start();
	}
}
```
2. 实现Runnable接口，并实现该接口的run（）方法

```
class MyThread implements Runnable{

	@Override
	public void run() {
		System.out.println("线程体");
	}
}
public class Test {
	public static void main(String[] args) {
		Thread thread = new Thread(new MyThread());
		thread.start();
	}
}
```
注意：调用start（）方法后并不是立即执行线程体中的代码，而是是该线程的状态变为就绪状态，加入就绪队列中，什么时候运行多线程代码是有操作系统决定的。

#### 4. run()方法和start()方法
系统通过调用线程类的start() 方法来启动一个线程，此时线程处于就绪状态，而不是运行状态，即这个线程可以被JVM调度执行。在调度过程中，JVM通过调用run() 方法来完成实际的操作，当run() 方法结束后，此线程就终止。

如果直接调用run() 方法，对被当做一个普通的函数调用，**程序中仍然只有主线程这一个线程**，也就是说，start() 方法能够异步地调用run()方法。**只有使用start()方法才能实现多线程。**

#### 5. 多线程同步的方法

当多个线程访问同一资源时，非常容易出现线程安全的问题，因此需要采用同步机制来解决这个问题。

主要有3种同步方法：
1. synchronized关键字

Java中每个对象都对应一个对象锁，该锁表明在任何时候只能允许被一个线程所拥有，**当一个线程调用对象的一段synchronized代码时，需要先获取到这个锁，然后再去执行相应的代码，执行结束后，释放锁。**

- synchronized方法：在方法的申明前加入synchronized关键字。
```
public synchronized void function(){}
```
只要把多个线程对需要同步的资源的操作放入这个方法中，就能保证这个方法同一时刻只能被一个线程访问，从而保证了安全性。然而当一个方法的方法体规模非常大时，加入synchronized修饰会大大影响程序的执行效率。为了提高效率，可以用同步代码块。

- synchronized代码块：synchronized代码块可以把任意的代码段变成同步的，也可以指定上锁对象。
```
synchronized(syncObject){
	//代码
}
```
如果未指定syncObject，默认为当前类实例，即this。

> 来源于： http://www.importnew.com/23511.html

synchronized可以保证方法或者代码块在运行时，同一时刻只有一个方法可以进入到临界区，同时它还可以保证共享变量的内存可见性

Java中每一个对象都可以作为锁，这是synchronized实现同步的基础：

① 普通同步方法，锁是当前实例对象
② 静态同步方法，锁是当前类的class对象
③ 同步方法块，锁是括号里面的对象

---
> 来源于： https://www.cnblogs.com/sevenyuan/p/6956588.html

一、当两个并发线程访问同一个对象object中的这个synchronized(this)同步代码块时，一个时间内只能有一个线程得到执行。另一个线程必须等待当前线程执行完这个代码块以后才能执行该代码块。

二、然而，当一个线程访问object的一个synchronized(this)同步代码块时，另一个线程仍然可以访问该object中的非synchronized(this)同步代码块。

三、尤其关键的是，当一个线程访问object的一个synchronized(this)同步代码块时，其他线程对object中所有其它synchronized(this)同步代码块的访问将被阻塞。

四、第三个例子同样适用其它同步代码块。也就是说，当一个线程访问object的一个synchronized(this)同步代码块时，它就获得了这个object的对象锁。结果，其它线程对该object对象所有同步代码部分的访问都被暂时阻塞。

五、以上规则对其它对象锁同样适用.

---

2. wait() 方法和notify() 方法

在synchronized代码被执行期间，线程可以调用对象的wait() 方法，释放对象锁，并且可以调用notify() 或notifyAll()方法通知正在等待的其他线程。notify() 方法仅唤醒一个线程（等待队列中的第一个线程）并允许它获得锁，notifyAll() 是唤醒所有等待的线程并允许他们去获得锁（不是让所有线程都获得锁，而是让它们去竞争）。

3. Lock

JDK5新增了Lock接口及它的一个实现类ReentrantLock（重入锁），Lock也可以用来实现同步。

有以下方法：
- lock()
以阻塞的方式获取锁，如果取到了锁，立即返回，如果别的线程持有锁，当前线程等待，知道获得到锁后返回。

- tryLock() 
以非阻塞的方式尝试获取锁，如果获取到锁，立即返回true，否则，立即返回false。

- tryLock(long timeout, TimeUnit unit)
如果取到锁，立即返回true，否则会等待参数给定的时间单位，在等待过程中，取到了锁，返回true，如果等待超时，返回false。

- lockInterruptibly()
 如果取到了锁，立即返回，如果没有，当前贤臣处于休眠状态，知道获得锁，或者当前线程被别的线程中断（会收到InterruptedException异常）。它与lock() 方法最大的区别在于如果lock() 获取不到锁，会一直处于阻塞状态，且会忽略interrupt() 方法。

#### 6.sleep() 方法与wait()方法

区别：

**1. 原理不同**

sleep() 方法是Thread的静态方法，是线程用来控制自身流程的，它会使此此线程暂停执行一段时间，而把执行机会让给其他线程，这时此线程进入阻塞状态，等到计时时间一到，此线程会自动苏醒，重新加入竞争CPU的队列中。

wait() 是Object类的方法，用于线程间的通信，这个方法会使当前拥有该对象锁的线程等待，直到其他线程调用notify()或notifyAll() 时才会醒来，或者指定一个时间，过后自动醒来。

**2. 对锁的处理机制不同**

sleep() 不涉及线程间的通信，因此调用它不会释放锁。

wait() 调用后会释放掉它所占用的锁。

**3. 使用区域不同**

由于wait() 方法的特殊意义，它必须放在同步控制方法或同步代码块中使用。

sleep() 方法可以放在任何地方使用。

sleep() 必须捕获异常，wait()、notify()、notifyAll() 方法都不需要捕获异常。

由于sleep()方法不会释放锁，容易造成死锁问题的发生，因此一般情况下不推荐使用sleep() 方法，而是使用wait() 方法。

---

引申：sleep() 与yield()区别

1.sleep()方法给其他线程运行机会时，不考虑线程的优先级，因此低优先级的线程也有运行的机会；而yield() 方法只会给相同或更高优先级的线程让出运行机会。

2.sleep()之后线程进入阻塞状态，所以在指定的时间内该线程肯定不会被执行，过了指定时间后，该线程重新开始竞争CPU，所以再次执行时间大于等于指定时间。yield()方法知识使当前线程重新回到就绪状态，所以该线程又可能进入就绪状态后又马上被执行。

3.sleep() 方法抛出InterruptedException异常，yield()方法没有声明任何异常。

4.sleep()方法比yield()方法有更好的可移植性。

#### 7. synchronized和Lock

区别：

**1. 用法不同**

在需要同步的对象中加入synchronized控制，synchronized既可以加在方法上，也可以加在特定代码块中，括号中表示需要锁的对象。synchronized是托管给JVM执行的。

Lock需要显示地指定起始位置和终止位置。Lock的锁定是通过代码实现的，它有synchronized更准确的线程语义。

**2. 性能不同**

Lock拥有和synchronized相同的并发性和内存语义，还多了锁投票、定时锁、等候和中断锁等。它们的性能在不同的情况下有所不同：
在竞争不是很激烈的情况下，synchronized的性能要优于ReentrantLock，但是在资源竞争很激烈的情况下，synchronized的性能会下降的非常快，而ReentrantLock的性能基本保持不变。

**3. 锁机制不同**

synchronized获得锁和释放锁的方式都是在块结构中，当获得多个锁时，必须以相反的顺序释放，并且时自动解锁，不会因为出了异常而导致所没有被释放从而引发死锁。

Lock需要开发人员手动去释放，并且必须在finally块中释放，否则会引起死锁问题。此外，Lock还提供了更强大的功能，tryLock() 可以采用非阻塞的方式去获得锁。

虽然synchronized和Lock都可以用来实现多线程的同步，但是最好不要同时使用这两个，因为它们的机制不同，所以它们是独立运行的，相当于两种类型的锁，在使用时互不影响。

```
class SyncTest{
	private int value = 0;
	Lock lock = new ReentrantLock();
	//用synchronized来实现同步
	public synchronized void addValueSync(){
		this.value++;
		System.out.println(Thread.currentThread().getName()+":"+value);
	}
	//用Lock实现同步
	public void addValueLock(){
		try{
			//获得锁
			lock.lock();
			value++;
			System.out.println(Thread.currentThread().getName()+":"+value);
		}finally {
			//释放锁
			lock.unlock();
		}
	}
}
```

#### 8. 守护线程

线程分为用户线程和守护线程。

守护线程又称服务线程、精灵线程、后台线程。是指在程序运行时在后台提供一种通用服务的线程。（比如垃圾回收器就是一个典型的守护线程，只要JVM启动，它始终在运行，实时监控和管理系统中可以被回收的资源）

用户线程和守护线程几乎一模一样，唯一的不同之处在于如果所有的用户线程都结束了，只剩下守护线程存在，JVM也就退出了。即只要有用户线程还在运行，程序就不会终止。

可以自己设置守护线程：在一个线程调用start() 方法之前setDaemon(true)就可以把一个用户线程变成守护线程。

#### 9. join()

join() 方法的作用是让调用该方法的线程实行完run()方法后再执行join()方法后面的代码，简单点说就是将两个线程合并，用于实现同步功能。

join() 方法等待线程结束
join(int timeout) 等待线程结束，但最多只等待timeout的时间。

```
class ThreadImp implements Runnable{

	@Override
	public void run() {
		try {
			System.out.println("线程启动");
			Thread.sleep(5000);
			System.out.println("线程结束");
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
}
public class Test {
	public static void main(String[] args) {
		Thread thread = new Thread(new ThreadImp());
		thread.start();
		try{
			thread.join(1000);
			if(thread.isAlive()){
				System.out.println("线程还没有结束");
			}else{
				System.out.println("线程已经结束");
			}
			System.out.println("join结束");
		}catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
}
```
> 运行结果：
> 线程启动
线程还没有结束
join结束
线程结束



