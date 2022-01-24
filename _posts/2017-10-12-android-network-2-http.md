---
layout: post
title: Android 网络编程系列（二）了解HTTP协议
date: 2017-10-12 22:00
tag: ["Android 网络编程"]
categories: 技术
cover: https://s2.loli.net/2022/01/24/2IqPXAT3JiwGFN6.png
subtitle: 作为一个开发者，不知道 HTTP 怎么行？
---
#### 前言

这篇文章算是正式开始学习的第一篇技术文章，在阅读搜集到的几篇博客文章后，对 HTTP 协议的相关知识做一下总结。

HTTP 是互联网中最基础的网络协议，平常我们上网浏览网页、听音乐、玩游戏等行为都离不开这个协议。对于开发者来说，在开发应用程序时，都少不了需要网络功能。因此，了解 HTTP 协议是很有必要的。

#### HTTP 协议简介

HTTP 协议（HyperText Transfer Protocol，超文本传输协议）是一个基于 TCP/IP 的应用层网络协议，它不涉及数据包的传输，规定了客户端与服务器端的通信格式。用于从万维网（WWW）服务器传输超文本到本地客户端。HTTP 从1991年发布0.9版开始，经过20多年的发展，不断完善和扩展。

**HTTP 协议的工作原理**

HTTP 协议是基于 C/S（客户端/服务端）架构模型来实现的。浏览器作为客户端向Web服务器发送请求，Web服务器收到请求后，向客户端发送响应信息。常见的Web服务器有 Apache 服务器、IIS 服务器等。

![img1](https://i.loli.net/2019/08/29/RjCTxpf8Dh61FcX.gif)

**HTTP 协议的特点**

1. 媒体独立
只要客户端和服务端知道如何处理数据内容，HTTP 可以传输任何类型的数据。
2. 无连接
无连接的意思是每次连接只处理一个请求，服务端处理完客户端的请求后，并收到客户端应答后就断开连接，采用无连接的方式可以节省传输时间。
3. 无状态
HTTP 协议是无状态协议，即一次请求和上一次的请求之间没有任何关系。如果这次请求需要之前请求的信息，则需要将信息加入到这次请求当中。
比如购物网站中，用户登录后购买商品，这时候购买商品的请求就需要加上当前用户信息，否则服务器不知道究竟是谁下了这个订单。

**HTTP URL 格式**

> http://host[":"port][abs_path]

http 表示使用 HTTP 协议来发送网络请求；host 表示合法的 Internet 主机域名或者IP地址；port 表示端口号，HTTP 协议默认使用 80 端口，也可以另外指定；abs_path 表示指定的 Web 服务器上可用资源的 URI。

接下来介绍 HTTP 协议中的报文，包含两种类型，请求报文和响应报文，分别对应客户端向服务器发送请求以及服务器响应请求这两个过程。

#### HTTP 请求报文

HTTP 请求报文的一般格式如图所示：

![img2](https://i.loli.net/2019/08/29/opYBzC7alSOEFVI.jpg)

请求报文包含**请求行**、**请求报头**、**空行**和**请求数据** 4 个部分。

**请求行**

请求行由请求方法、URL 字段和 HTTP 协议的版本组成，如示例：

> GET http://www.runoob.com/http/http-tutorial.html HTTP/1.1

HTTP 的请求方法共有 8 个，HTTP 协议 1.0 版本中定义了GET、POST、HEAD 这 3 个方法，1.1 版本时又新增了PUT、DELETE、TRACE、CONNECT、OPTION 这 5 个方法。其中最常用的是 GET 和 POST。

![img3.png](https://i.loli.net/2019/08/29/b1NR9ABGOFDPKSQ.jpg)

**请求报头（header）**

请求行之后会有 0 个或多个请求报头，如果有请求报头，则每行有 1 个请求头，都是以键值对的形式表示，包括头部域的名字和值，中间用 “：” 分隔。

**空行**

协议中用空行来表示请求报头的结束，空行之后就是请求数据。

**请求数据**

请求数据是客户端向服务器发送的数据，GET 请求中没有请求数据，出现在使用 POST 方法来向服务器提交表单等情景中。和请求数据相关的最常用的请求头是 Content-Type 和 Content-Length。

以下是一个完整的请求报文实例：

> GET /hello.txt HTTP/1.1
User-Agent: curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3
Host: www.example.com
Accept-Language: en, mi

#### HTTP 响应报文

HTTP 响应报文的一般格式如下图所示：

![img4.png](https://i.loli.net/2019/08/29/KlX2JPWENenqOU3.jpg)

响应报文包含**状态行**、**响应报头**、**空行**和**响应正文** 4 个部分。空行表示响应头部和正文的分隔，相应正文则表示服务器返回的资源的内容，主要介绍一下状态行和 HTTP 协议中的消息报头（请求报头和响应报头都属于它的一个分类，所以放在一起介绍）。

**状态行**

状态行依次包括 HTTP 版本、状态码以及该状态码对应的原因短语，示例如下：

> HTTP/1.1 200 OK

HTTP 状态码由三个十进制数字组成，第一个十进制数字定义了状态码的类型，后两个数字没有分类的作用。HTTP状态码共分为5种类型：

 - 100~199 ： 信息，服务器收到请求，需要请求者继续执行操作
 - 200~299： 成功，操作被成功接收并处理
 - 300~399 ： 重定向，需要进一步的操作以完成请求
 - 400~499 ： 客户端错误，请求包含语法错误或无法完成请求
 - 500~599 ： 服务器错误，服务器在处理请求的过程中发生了错误
 
常见的HTTP状态码有：

* 200 - 请求成功
* 301 - 资源（网页等）被永久转移到其它URL
* 404 - 请求的资源（网页等）不存在
* 500 - 内部服务器错误

#### HTTP 的消息报头

消息报头可以分为通用报头、请求报头、响应报头和实体报头。以键值对的形式存在，每行一对，名字和值之间用 “：” 来进行分隔。

**通用报头**

通用报头既能出现在请求报头也能出现在响应报头中。  

- Date ： 发送消息的日期和时间
- Connection ： 允许发送指定连接的选项。例如指定连接是连续，或者指定 “close” 选项，通知服务器，在响应完成后，关闭连接
- Cache-Control ： 用于指定缓存指令，缓存指令是单向的（响应中出现的缓存指令在请求中未必会出现），且是独立的（一个消息的缓存指令不会影响另一个消息处理的缓存机制）

**请求报头**

请求报头允许客户端向服务器端传递请求的附加信息以及客户端自身的信息。

常见的请求报头有：

- Host ： 发送请求时，该报头域是必需的。Host 请求报头域主要用于指定被请求资源的 Internet 主机和端口号，它通常从 HTTP URL 中提取出来。
- User-Agent ： 允许客户端将它的操作系统、浏览器和其它属性告诉服务器。
- Accept ： 用于指定客户端接受哪些类型的信息。例如Accept：image/gif，表明客户端希望接受 GIF 图象格式的资源；Accept：text/html，表明客户端希望接受 html 文本。
- Accept-Charset ： 用于指定客户端接受的字符集。
- Accept-Encoding ： 用于指定可接受的内容编码。
- Accept-Language ： 用于指定一种自然语言。例如 Accept-Language:zh-cn 表示支持中文。
- Authorization ： 请求报头域主要用于证明客户端有权查看某个资源。当浏览器访问一个页面时，如果收到服务器的响应代码为 401（未授权），可以发送一个包含 Authorization 请求报头域的请求，要求服务器对其进行验证。

**响应报头**

响应报头用于服务器向客户端发送信息。

常见的响应报头有：

- Location ： 用于重定向接受者到一个新的位置，常用在更换域名的时候。
- Server ： 包含了服务器用来处理请求的软件信息，与User-Agent请求报头域是相对应的。
- WWW-Authenticate ： 必须被包含在 401（未授权的）响应消息中，客户端收到 401 响应消息时候，并发送 Authorization 报头域请求服务器对其进行验证时，服务端响应报头就包含该报头域。

**实体报头**

请求和响应消息都可以传送一个实体。实体报头定义了关于实体正文和请求所标识的资源的元信息。

常见的实体报头有：

- Content-Encoding ： 被用作媒体类型的修饰符，它的值指示了已经被应用到实体正文的附加内容的编码。
- Content-Language ： 描述了资源所用的自然语言。
- Content-Length ： 用于指明实体正文的长度，以字节方式存储的十进制数字来表示。
- Content-Type ： 实体报头域用语指明发送给接收者的实体正文的媒体类型。
- Last-Modified ： 用于指示资源的最后修改日期和时间。

以下是一个响应报文的实例：

> HTTP/1.1 304 Not Modified
Date: Thu, 12 Oct 2017 09:20:27 GMT
Via: 1.1 varnish
Cache-Control: max-age=600
Expires: Thu, 12 Oct 2017 09:02:02 GMT
Age: 0
Connection: keep-alive
X-Served-By: cache-hkg17934-HKG
X-Cache: MISS
X-Cache-Hits: 0
X-Timer: S1507800028.883579,VS0,VE164
Vary: Accept-Encoding
X-Fastly-Request-ID: 17fc09b064ce9669f38931c159ec01384cc3f8de

#### 结语

HTTP 协议的有关知识暂时就到这里，大致上梳理了 HTTP 协议的整体工作流程，掌握了大部分的内容，其中的一些细节还是没有把握好，比如消息报头、Content-Type 没有深入的去理解。（本文图片转载自菜鸟教程与刘望舒博客，侵删）

下一篇文章，将是有关 Android 中 WebView 的使用。

下次见。

**参考文章**

学习过程中阅读了如下几篇文章和教程，感谢这些作者辛勤付出。

> 刘望舒： Android网络编程（一）HTTP协议原理
http://liuwangshu.cn/application/network/1-http.html
> Jeffrey ： HTTP协议详解http://www.cnblogs.com/li0803/archive/2008/11/03/1324746.html
> 阮一峰： HTTP 协议入门
http://www.ruanyifeng.com/blog/2016/08/http.html
> 菜鸟教程： HTTP 教程
http://www.runoob.com/http/http-tutorial.html





    












