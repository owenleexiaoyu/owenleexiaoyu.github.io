---
layout: post
title: EventBus 的使用
date: 2019-10-18 12:00
tags: ["Android"]
categories: 技术
cover: http://image.wufazhuce.com/FordKXIwo_85nVFcvOn3TC8oZXXH
---

#### 前言

EventBus 是一个非常优秀的 Android 事件总线框架，可以用来简化组件间通信与数据传输，比如 Activity 之间、Fragment 之间、子线程与 UI 线程间等等情况。它基于发布/订阅模式，实现业务代码的解耦，提高了开发的效率。

最近在做需求时也使用到了 EventBus 3.0，在使用粘性事件时也遇到一些问题，这篇文章来简单总结一下 EventBus 的使用。

#### 基本概念

EventBus 主要由三个元素构成：

- 事件（Event）
- 发布者（Publisher）
- 接收者（Subscriber）

事件（Event）可以是任何类型。可以分为普通事件和粘性事件（StickyEvent），粘性事件文章后面会单独介绍。

事件发布者（Publisher），可以在任意线程的任意位置调用 post 方法送事件。

事件订阅者/事件接收者（Subscriber），在需要接收事件的位置（通常是 Activity、Fragment，随业务决定），创建一个方法接收事件进行处理，EventBus 3.0 之后方法名可以任意指定，不过需要添加  `@Subscribe` 注解，注解中可以指定线程模型、是否支持粘性事件、优先级。

#### 简单用法

可以通过以下几个步骤来快速上手使用 EventBus：

**0. 添加依赖**

在 gradle 中添加对 EventBus 的依赖：

```
implementation 'org.greenrobot:eventbus:3.1.1'
```

**1. 定义一个事件** 

一般来说我们根据业务来定义事件，为了意思明确再加上 Event，表明这是个 EventBus 的事件，比如 LoginEvent、LogoutEvent，分别对应在登陆后、登出后发送的事件。

我们这里可以定义一个携带一个 String 变量的 StringEvent：

```
class StringEvent{
	public String msg;
	public StringEvent(String msg){
		this.msg = msg;
	}
}
```

**2. 注册、注销 EventBus**

订阅者需要在总线中注册/注销。只有注册后，订阅者才能正常接收到事件。通常我们都在 Activity、Fragment 中订阅事件，需要在生命周期回调函数中做这步。

- Activity：在 onCreate 中注册，在 onDestory 中注销。

```
Override protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    EventBus.getDefault().register(this);
}
```

```
@Override protected void onDestroy() {
    super.onDestroy();
    EventBus.getDefault().unregister(this);
}
```

- Fragment：在 onCreateView 中注册，在 onDestoryView 中注销。

```
public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
    EventBus.getDefault().register(this);
    return super.onCreateView(inflater, container, savedInstanceState);
}
```

```
@Override public void onDestroyView() {
    super.onDestroyView();
    EventBus.getDefault().unregister(this);
}
```

EventBus 的官方文档中推荐在 onStart 和 onStop 中进行注册和注销，提到这个时期对绝大多数情况适用。在开发过程中也会遇到在 onStart 注册偏晚造成接收不到事件的情形，所以也可以把注册时机稍微提前。

**3. 发送事件**

发送事件非常简单，只需要调用一个 post 方法即可。

```
EventBus.getDefault().post(new StringEvent("hello"));
```

**4. 处理事件**

在 Activity 或 Fragment 中定义一个方法，方法名可以任意指定，参数为要接收的 Event 对象，需要加上 `@Subscribe` 注解。注解中可以添加线程模型、是否支持粘性事件、优先级属性。其中线程模型是必需的，默认值为 POSTING，线程模型的概念在示例之后进行介绍。

```
@Subscribe   //这里没有指定线程模型，使用默认值
public void onStringEvent(StringEvent event) {
    //业务逻辑
}
```

**完整示例代码**

下面贴一个简单的示例代码，结合演示效果应该比较好理解。

MainActivity

```
public class MainActivity extends AppCompatActivity {

    private TextView mTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        EventBus.getDefault().register(this);

        mTextView = findViewById(R.id.textview);

        new Thread(new Runnable() {
            @Override public void run() {
                try {
                    Thread.sleep(3000);
                    EventBus.getDefault().post(new StringEvent("我接收到事件了"));
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onStringEvent(StringEvent event) {
        mTextView.setText(event.text);
    }

    @Override protected void onDestroy() {
        super.onDestroy();
        EventBus.getDefault().unregister(this);
    }
}
```

activity_main.xml

```
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="初始文案"
        android:layout_centerInParent="true"
        android:textSize="20sp"
        android:id="@+id/textview"/>
</RelativeLayout>
```

代码的逻辑非常简单，在 MainActivity 中有一个TextView，有个初始文案，创建了一个子线程，在3s后发送一个事件，接受到事件后修改TextView的内容。

效果如图：

![img1](https://i.loli.net/2019/10/16/J9sMgXwHxAOe5Ea.gif)

#### 线程模型

这部分来介绍以下 EventBus 的几种线程模型，线程模型是用来指定订阅者在什么线程中处理这个事件。

有如下几种线程模型：

1. ThreadMode.POSTING

默认的线程模型，订阅者会在发布事件的同一个线程里被调用。事件传递是同步完成的，事件发布后，所有的订阅者都会接收到事件，因为没有切换线程，所以开销最小。如果是简单的任务，这种模型最为推荐。

```
@Subscribe(threadMode = ThreadMode.POSTING)
public void onMessage(MessageEvent event) {
    log(event.message);
}
```

2. ThreadMode: MAIN

订阅者将在 Android 的主线程（UI 线程）中调用。 如果发布事件的线程是主线程，那么就和 POSTING 是一样的。 使用这个模式的事件处理不能有耗时操作，必须快速返回，否则容易阻塞主线程，造成 ANR。 

```
@Subscribe(threadMode = ThreadMode.MAIN)
public void onMessage(MessageEvent event) {
    textText.setText(event.message);
}
```

3. ThreadMode: MAIN_ORDERED

这个模型下，订阅者同样会在 Android 主线程被调用。与 MAIN 不同的是，订阅者处理接收该事件是串行的，第二个订阅者需要在第一个订阅者处理完后才会接收到事件，所以被称为 ordered。这个模型同样要避免阻塞主线程。

```
@Subscribe(threadMode = ThreadMode.MAIN_ORDERED)
public void onMessage(MessageEvent event) {
    textText.setText(event.message);
}
```

4. ThreadMode: BACKGROUND

从名字可以看出，这个模型是在后台处理事件。如果在子线程中发布事件，则会在那个子线程中调用订阅者，进行处理；如果在主线程中发布事件，则会新创建一个子线程，然后在子线程中处理。

```
@Subscribe(threadMode = ThreadMode.BACKGROUND)
public void onMessage(MessageEvent event){
    saveToDisk(event.message);
}
```

5. ThreadMode: ASYNC

在这个模型下，总是会在一个新的线程中取处理事件，这个线程独立于发布线程和主线程。如果在事件处理方法中有耗时操作，如网络请求等等，采用这种模型。 EventBus 使用了线程池来重用线程，节省开销。

```
@Subscribe(threadMode = ThreadMode.ASYNC)
public void onMessage(MessageEvent event){
    backend.send(event.message);
}
```

#### 粘性事件（StickyEvent）

普通事件必须要订阅者先注册，然后发送事件，才能被订阅者接收到。有的情况下，我们希望即使先发送事件，再注册，订阅者也能接收到。EventBus 提供了粘性事件来满足这种情形。

在发布事件时，改用 postSticky 方法来发送一个粘性事件。

```
EventBus.getDefault().postSticky(new StringEvent("Hello World!"));
```

然后在订阅者接收事件方法的 @Subscribe 注解中加上`sticky=true`，表示支持接收粘性事件。

```
@Subscribe(sticky = true, threadMode = ThreadMode.MAIN)
public void onStringEvent(StringEvent event) {   
    mTextView.setText(event.message);
}
```

下面同样写一个比较简单的示例来演示一下粘性事件的用法：

MainActivity：

```
public class MainActivity extends AppCompatActivity {

    private TextView mTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        getSupportActionBar().setTitle("MainActivity");
        mTextView = findViewById(R.id.textview);
    }

    @Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
    public void onStringEvent(StringEvent event) {
        mTextView.setText(event.text);
    }

    @Override protected void onDestroy() {
        super.onDestroy();
        EventBus.getDefault().unregister(this);
    }

    public void register(View view) {
        EventBus.getDefault().register(this);
    }

    public void toSecondActivity(View view) {
        startActivity(new Intent(MainActivity.this, SecondActivity.class));
    }
}
```

SecondActivity

```
public class SecondActivity extends AppCompatActivity {
    @Override protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_second);
        getSupportActionBar().setTitle("SecondActivity");
    }

    public void sendEvent(View view){
        EventBus.getDefault().post(new StringEvent("OWEN"));
        finish();
    }

    public void sendStickyEvent(View view){
        EventBus.getDefault().postSticky(new StringEvent("Sticky OWEN"));
        finish();
    }
}
```

**效果演示：**

![img2](https://i.loli.net/2019/10/18/X3qVtEc2iz6G4Rn.gif)

代码的逻辑非常简单，MainActivity 中没有在 onCreate 中注册 EventBus，而是将它放在了一个按钮的点击事件中。

演示中一共发送三次事件：

1. 未注册时，从 SecondActivity 发送普通事件，发现 TextView 文字没有变化；
2. 未注册时，从 SecondActivity 发送 Sticky 事件，回到 MainActivity 中点击注册 EventBus，发现这时文字变化了。
3. 注册后，从 SecondActivity 发送普通事件，发现文字再次变化。

这就是 Sticky 事件的作用，先发送事件，再注册订阅者，也可以接受到事件。

**使用注意**

发送的粘性事件会保存在一个 map 中，这样才能实现后订阅也能接收到的功能，同时会保留最后一个粘性事件。对于某些只处理一次的事件，会造成重复处理最后一个粘性事件的情况，有时这是不符合预期的，需要在处理完粘性事件后手动将其删除，使用 `removeStickyEvent` 方法。

```
StringEvent stickyEvent = EventBus.getDefault().getStickyEvent(StringEvent.class);
// 判断此粘性事件是否存在
if(stickyEvent != null) {
    // 若粘性事件存在，将其删除
    EventBus.getDefault().removeStickyEvent(stickyEvent);
}
```

#### ProGuard 混淆规则

```
-keepattributes *Annotation*
-keepclassmembers class ** {
    @org.greenrobot.eventbus.Subscribe <methods>;
}
-keep enum org.greenrobot.eventbus.ThreadMode { *; }

# Only required if you use AsyncExecutor
-keepclassmembers class * extends org.greenrobot.eventbus.util.ThrowableFailureEvent {
    <init>(java.lang.Throwable);
}
```