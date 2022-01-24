---
layout: post
title: Android 网络编程系列（三）WebView 的使用
date: 2017-10-16 17:32
tag: ["Android 网络编程"]
categories: 技术
cover: https://s2.loli.net/2022/01/24/ijv1ykgbSOPe7qX.png
subtitle: 介绍一下 WebView 的简单用法
---
### 前言

在 Android 中提供了这样一个特殊的控件 WebView，用于显示网页。也属于网络编程中的一部分，所以这次就来学习一下 WebView 的相关用法。

### 最基本用法

WebView 最基本的用法可以分为以下三步：

1. 在 layout 文件中添加 WebView 控件：

```
<?xml version="1.0" encoding="utf-8"?>
<WebView  
	xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/webview"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent"
/>
```

2.  调用 WebView 的 loadUrl() 方法，传入要显示的网址：

```
WebView mWebView = (WebView) findViewById(R.id.webview);
mWebView.loadUrl("http://www.baidu.com");
```

3. 在 AndroidManifest.xml 文件中添加网络访问的权限：

```
<manifest ... >
    <uses-permission android:name="android.permission.INTERNET" />
    ...
</manifest>
```

通过以上三个步骤，就已经可以使用 WebView 了。接下来再介绍一下 WebView 的更进一步的内容。

### WebView 支持 JavaScript

WebView 默认是不支持 JS 的，我们可以通过手动修改设置来让 WebView 支持 JS。通过 getSettings() 法获取到 WebSettings 这个类的实例，这个类是专门用于 
```
//设置支持JS
WebSettings webSettings = mWebView.getSettings();
webSettings.setJavaScriptEnabled(true);
```

### WebView 页面处理

但是在加载网页时，Android 默认是需要调用本机中浏览器来打开网页，而不是直接在本应用中展示。如果想在应用中直接展示网页，就需要重写 WebViewClient 类中的 **shouldOverrideUrlLoading()** 方法，return true 表示使用 WebView 直接展示网页。

```
//设置在当前应用中直接展示网页
mWebView.setWebViewClient(new MyWebViewClient());

class MyWebViewClient extends WebViewClient{
    @Override
    public boolean shouldOverrideUrlLoading(WebView view, 
		    String url) {
        view.loadUrl(url);
        return true;
    }
}
```

### WebView 历史记录

WebView 自身维护了一个浏览历史记录的列表，但是在 WebView 中点击返回键时，当前页面不管是不是能够返回上一页，都会直接退出 WebView。如果想实现和浏览器中一样的到上一页、下一页的效果就需要借助 WebView 的 goBack() 、goForword() 方法，同时重写返回键的处理逻辑。
 
先来看看相关的方法说明：

```
boolean canGoBack ()
判断此WebView是否可以回到上一页
boolean cangGoForward ()
判断此WebView是否可以到下一页
boolean canGoBackOrForward (int steps)
通过传进来的参数判断是否能够到达指定的页面，参数为负表示回到上n页，为正表示去下n页

void goBack ()
回到上一页
void goForword ()
去到下一页
void goBackOrForward (int steps)
回到上n页或者去到下n页，steps为负表示后退，为正表示前进

void clearHistory ()
清除所有的历史纪录
```

实例代码如下，当按下返回键并且 WebView 可以回到上一页时，就返回到上一页，否则就按默认逻辑处理：

```
Override
public boolean onKeyDown(int keyCode, KeyEvent event) {
    if ((keyCode == KeyEvent.KEYCODE_BACK) 
		    && mWebView.canGoBack()) {
        mWebView.goBack();
        return true;
    }
    return super.onKeyDown(keyCode, event);
}
```

### JS代码调用本地Java代码

WebView 支持使用 addJavaScriptInterface() 方法来让 JavaScript 调用 App 中的原生 Java 代码，比如在网页中弹出一个原生的对话框代替网页中的 Alert。
```
void addJavascriptInterface (Object object, String name)
该方法的原理是将一个Java对象以指定的变量名字（代码中的name）注入到JS的上下文中，这个时候这个变量在JS中可以用于表示那个Java对象，从而调用该对象的方法。
```

首先需要在 Java 代码中创建一个 JavaScriptInterface，比如：

```
class MyJSInterface{
	private Context mContext;
	public MyInterface(Context context){
		this.mContext = context;
	}
	@JavascriptInterface
	public void showToast(String text){
	Toast.makeText(mContext, text, 1000).show();
	}
}
```

之后调用 WebView 的 addJavaScriptInterface() 方法，传入上面这个“接口”类的实例和在 JS 中变量名称：

```
mWebView.addJavascriptInterface (new MyJSInterface(this), 
		"android");
```

让我们看看在 HTML 页面中是如何调用到 Java代码的：

```
<html>
  <head> 
    <meta charset="utf-8"> 
    <title>JSDemo</title> 
    <script>
       function toast(msg) {
         window.android.showToast(msg)
       }
    </script>
  </head>
  <body>
    <button type="button" id="btn_toast" 
        onclick="toast('show a Toast')">
      toast
    </button>
  </body>
</html>
```

可以看到在 HTML 页面上有一个按钮，点击这个按钮就会执行 JS 中的 toast() 方法，在这个方法里面就是调用了 window.android.showToast() 方法。

使用 addJavaScriptInterface() 需要注意以下几点：

1. addJavascriptInterface() 方法中要绑定的 Java 对象及方法要运行另外的线程中，不能运行在构造它的线程中。

2. 使用这个方法在 Android 4.2 以下的版本中会存在安全隐患，4.2 以下的版本没有对注册 Java 类的方法调用进行限制，所以 JavaScript 可以使用反射来访问注入对象的公共字段，以及其他任何没有注册的 Java 类。攻击者可以通过这一漏洞对客户端为所欲为，包括盗取个人隐私资料等。

3. 在 Android 4.2（targetSdkVersion ≥ 17）以上的版本中这个漏洞被解决，在注册 Java 对象需要调用的方法前必须加上**@JavascriptInterface**这个注解，否则 JS 代码不能调用该方法。

### 结束语

就先写这些吧。这篇文章写了很久，但还是没写好。因为其实并没有讲的很深入，只是介绍了一些皮毛，我自己的理解也还没到位。下一篇文章努力做的更好一点，还是关于 WebView。

下次见。

### 参考文章

照例贴一下在学习过程中看过的一些优秀的博客，真的从中学到了很多的东西。

>https://developer.android.google.cn/reference/android/webkit/WebView.html
>谷歌开发者官网：WebView
>http://jaq.alibaba.com/blog.htm?id=48
>阿里无线安全平台：WebView 远程代码执行漏洞浅析
>http://www.jianshu.com/p/e3965d3636e7
>谈谈WebView的使用（作者的想法很好）
>https://www.kymjs.com/code/2015/05/03/01/
>https://kymjs.com/code/2015/05/04/01/
>张涛：深入讲解WebView（上、下）














