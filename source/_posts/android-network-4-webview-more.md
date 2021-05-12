---
title: Android 网络编程系列（四）WebView 详解
date: 2017-10-19 17:36
tag: ["Android 网络编程"]
categories: 技术
thumbnail: http://image.wufazhuce.com/FlDFgAFVicIwfqO4cCeQFPB5LLSd
subtitle: 关于 WebView 的 7 点补充知识。
---
### 前言

在上一篇关于WebView的文章中，介绍了 WebView 的基本使用方法、WebView 页面处理和历史记录以及和 JS 调用本地代码的相关内容。今天就在上一篇文章的基础上，补充一些 WebView 的更深入的东西。

主要从如下几点来进行补充：

1. 加载本地的 HTML 页面
2. WebView 一些方法的讲解
3. WebView 与 WebViewClient、WebChromeClient 的关系和作用
4. WebViewClient 和 WebChromeCient 的方法介绍
5. 错误码的处理
7. 利用 WebView 来下载文件
8. 远程注入漏洞的解决方案

###   加载本地 HTML 页面

前一篇文章中说到使用 WebView 需要开启 Internet 的权限，这个说法其实是不准确的。开启权限只是因为我们使用 loadUrl() 方法来获取 URL 的内容时需要联网。当我们选择加载本地的 HTML 页面（比如 assets 目录下的 HTML 文件或者使用 loadData() 方法加载一段 HTML 代码），并不需要网络权限。

加载 assets 目录下的 HTML 文件的方式和加载网页是一致的，都是使用 WebView 的 loadUrl() 方法。

```
mWebView.loadUrl("file:///android_asset/index.html");
```

### WebView 部分方法详解

上篇文章在介绍 WebView 的历史记录时，列举了部分相关的方法并做了简单的描述。这部分主要补充几个 load 方法的介绍。

> void loadData (String data, String mimeType, String encoding)

加载指定的 data 数据，有时需要加载的不是一个完整的网页，而是一个 HTML 片段。

data 表示给定编码的 String 类型 HTML 文本。mimeType 表示 data 的 MIMIE 类型，比如 “text/html”。encoding 表示 data 的编码格式。

这个方法中有两个地方需要注意：
- JavaScript 有同源限制。意味着在此页面中运行的脚本无法访问任何不是通过 data 加载的数据。避免同源限制可以采用 loadDataWithBaseURL() 方法。
- encoding 指定了 data 是使用 base64 编码还是使用 URL 编码。如果 data 是使用 base64 编码的，encoding 的值一定为 “base64”，如果是其他值的编码方式（包括 null），则默认使用 ASCII 编码方式。对于超出 ASCII 范围的字符比如 ‘#’，‘%’，'\'，'?'，应该转化为 ”%+原字符的十六进制值“ 如 ‘%23’、‘%25’、‘%27’、‘%3f’。

示例如下：
```
String htmlString = "<html><title>this is title</title><body>this is web content.</body></html>";
mWebView.loadData(htmlString, "text/html","utf-8");
```

> void loadDataWithBaseURL(String baseUrl, String data, String mimeType, String encoding, String historyUrl)

这个方法比上面那个方法只多了两个参数，一个是 baseUrl，一个是 historyUrl。baseUrl 指定了 data 数据的基准地址。我们知道，在 HTML 代码中通常会有超链接或者图片，而这些链接或者图片地址通常使用的都是相对路径，如果没有一个基准，WebView 就无法访问到这些资源。

下面我们在 assets 目录下模拟网站资源的相对路径，来帮助我们更好地理解：

assets 目录下创建了 web 目录，里面有一张图片名为 logo.png
 
```
String htmlStr = "this is our logo：<img src="/logo.png"/>"
mWebView.loadData(htmlStr, "text/html","utf-8");
mWebView.loadDataWithBaseUrl("file:///android_asset/web",htmlstr,"text/html","utf-8",null);
```
使用 loadData() 方法无法加载图片，只有使用 loadDataWithBaseUrl() 方法才能加载。

> void loadUrl(String url)

加载指定 URL 的内容。

> void loadUrl(String url, Map<String, String> additionalHttpHeaders)

加载指定的 URL 的内容，并携带 http header 数据。

> void reload()

重新加载当前页面。页面中所有资源会重新加载。

> WebSettings getSettings()

获取对这个 WebView 进行设置的 WebSettings 对象。

WebSettings 是管理 WebView 设置状态的类。当首次创建 WebView 时，它会获得一组默认设置。这些默认设置可以通过 WebSettings 的任何 getter 方法调用返回。从 WebView.getSettings() 获取的WebSettings 对象与 WebView 的使用寿命相关。如果 WebView 已被破坏，WebSettings 上的任何方法调用都将抛出一个 IllegalStateException 异常。

上一篇文章中提到 WebView 本身不支持 JavaScript，需要通过 WebSettings 来设置，即：
```
mWebView.getSettings().setJavaScriptEnabled(true);
```

这里介绍其他几个常用的 WebSettings 的 setter 方法，来对 WebView 进行设置。

> setCacheMode(int mode)
> 设置是否支持缓存及缓存模式，默认值为 LOAD_DEFAULT。
> setDefaultFontSize(int size)
> 设置默认的字体大小。有效值在 1~72 之间，默认值为 16。
> setSupportZoom(boolean support)
> 设置是否支持缩放，默认支持。
> setDisplayZoomControls(boolean enabled)
> 设置是否显示缩放按钮。默认值为 true。

### WebView 与 WebViewClient、WebChromeClient 的关系和作用

在上篇文章中介绍了通过覆盖 WebViewClient 的shouldOverrideUrlLoading() 方法来使用当前应用展示页面，而不是通过手机浏览器来打开。这里就系统地讲讲 WebView 和 WebViewClient、WebChromeClient 的关系以及它们各自的作用。

WebView 在加载网页时会产生各种事件，并回调给应用程序以便在网页加载过程进行一些额外的处理。如果所有的工作都由 WebView 本身来完成，那么它的工作量就太大了，因此 Android 中引入了WebVIewClient 和 WebChromeClient 类来帮助 WebView 分担这些事件处理的回调。

WebView 负责加载网页以及网页渲染。
WebViewClient 的主要职责是帮助 WebView 处理各种通知、回调事件。
WebChromeClient 的作用是监听网页加载进度以及对网页标题，网页图标、JS 对话框进行处理等等。

### WebViewClient 和 WebChromeCient 的方法介绍

##### WebViewClient 部分方法说明

```
//网页开始加载时的回调函数
void onPageStarted(WebView view, String url, Bitmap favicon)
//网页加载结束时的回调函数
void	onPageFinished(WebView view, String url)
//网页加载出错时的回调函数
void onReceivedError(WebView view, int errorCode, String description, String failingUrl)
//选择使用应用程序进行页面展示时需要覆盖该方法
boolean shouldOverrideUrlLoading(WebView view, String url)
```

##### WebChromeClient 部分方法说明

```
//接收到页面 title 时回调，获取到 title 可以设置到应用的 ActionBar 上。
void onReceivedTitle(WebView view, String title)
//接收到页面的图标时回调
void onReceivedIcon(WebView view, Bitmap icon)
//当页面加载进度发生变化时回调，可以设置一个 ProgressBar 来显示加载进度
void onProgressChanged(WebView view, int newProgress)
//当页面弹出 Javascript 警报对话框时调用
//客户端可以设置是否对这个对话框进行处理
boolean	onJsAlert(WebView view, String url, String message, JsResult result)
//当页面弹出 Javascript 确认对话框时调用
//客户端可以设置是否对这个对话框进行处理
boolean	onJsConfirm(WebView view, String url, String message, JsResult result)
//当页面弹出 Javascript 提示对话框时调用
//客户端可以设置是否对这个对话框进行处理
boolean	onJsPrompt(WebView view, String url, String message, String defaultValue, JsPromptResult result)

```

### 错误码的处理

在浏览网页时经常会遇到 404 错误，也就是访问的页面不存在，这里就简单介绍一下如何处理 WebView 中的 404 错误。对错误码的处理需要覆盖 WebViewClient 类中的 onReceiveError() 方法，对于 404 错误，有两个常用的处理方法：

第一，加载一个 assets 目录下的写好的 404 页面
```
class MyWebViewClient extends WebViewClient{
    @Override
    public void onReceivedError(WebView view, int errorCode, 
	    String description, String failingUrl) {
        view.loadUrl("file:///android_asset/404.html");
    }
}
mWebView.setWebViewClient(new MyWebViewClient());
```

第二，使用 Android 中的 ImageView 或者 TextVIew 来显示错误信息。

```
TextView tvError = (TextView) findViewById(R.id.tv_error);
class MyWebViewClient extends WebViewClient{
    @Override
    public void onReceivedError(WebView view, int errorCode, 
	    String description, String failingUrl) {
	    mWebView.setVisibility(View.GONE);
        tvError.setVisibility(View.VISIBLE);
        tvError.setText("something goes wrong");
    }
}
mWebView.setWebViewClient(new MyWebViewClient());
```

### 利用 WebView 下载文件

使用 WebView 进行文件下载同样有两种常用的方法，一种是使用隐式 Intent，调用系统浏览器进行下载任务；一种是获取到下载文件的 URL，创建线程进行异步下载。

我们这里就简单介绍一下使用隐式 Intent 的方法来下载文件，第二种方法将在后面一篇关于 HttpUrlConnection 的文章中进行介绍。

WebView 有一个 setDownloadListener() 方法，当 URL 的内容不能被 WebView 引擎渲染时（文件），应该被下载。需要新建一个 DownloadListener 的实现类。在该实现类的 onDownloadStart() 方法中，可以获取到当前下载文件的 URL。之后就可以通过隐式 Intent 来调用系统浏览器进行下载。

```
class MyDownloadListener implements DownloadListener{

    @Override
    public void onDownloadStart(String url, String userAgent,
        String contentDisposition,
        String mimetype, long contentLength) {
        if(url.endsWith(".apk")){
            Uri uri = Uri.parse(url);
            Intent i = new Intent(Intent.ACTION_VIEW, uri);
            startActivity(i);
        }
    }
}
mWebView.loadUrl("http://www.wandoujia.com/");
mWebView.getSettings().setJavaScriptEnabled(true);
mWebView.setDownloadListener(new MyDownloadListener());
```

上述代码实现了在豌豆荚网站中下载 apk 文件的效果。

### 远程注入漏洞的解决方案

上篇文章中讲到了在 Android 4.2 版本之前使用 addJavascriptInterface() 方法会存在安全隐患，攻击者可以通过反射机制来对客户端进行攻击。那么在 4.2 之前，这个漏洞有没有什么解决方案呢？

答案是有的，在网上看了一些资料，找到了对应的方案。在上面的 WebChromeClient 的方法介绍时提到了一个 onJsPrompt() 方法，这个方法在 JS 调用 prompt 方法时会在本地回调。通过这个方法，JS 能把信息（文本）传递到 Java，而 Java 也能把信息（文本）传递到 JS 中。客户端和网页前端的开发者之间协商好一个小型的协议，通过 onJsPrompt() 将远程调用所需的信息按照协议封装成文本发给客户端，客户端根据协议解析这段文本，提取出所需的信息，利用反射机制进行本地的方法调用，如果有返回值就将返回值通过onJsPrompt() 传递给 JS。就能够实现 JS 远程调用 Java 代码了。

这样的解决方案我也只是一知半解，所以只能介绍到这里，在参考资料中会有更加详细的介绍。

### 结束语

这篇文章结束后，对于 WebView 的一些常见的方法和这些方法背后的原理都略作介绍。由于是在学习阶段，很多知识和原理并不能做到多么深入，但是通过写这两篇关于 WebView 的文章，去看了很多的博客，研究了一番官方文档，收获还是非常大的。接下来就要去学习 HttpUrlConnection 的相关用法，下篇文章见。

### 参考文章

以下是在学习过程中看的一些博客，不断向这些作者学习，努力深入知识点，然后写出尽量高质量的博客。
> http://blog.csdn.net/leehong2005/article/details/11808557
> Android WebView 的 Js 对象注入漏洞解决方案
> http://blog.csdn.net/typename/article/details/39030091
> http://blog.csdn.net/typename/article/details/39495409
> http://blog.csdn.net/typename/article/details/40302351
> Android WebView 开发详解（共3篇）
> http://www.jianshu.com/p/93cea79a2443
> JS 与 WebView 交互存在的一些问题











