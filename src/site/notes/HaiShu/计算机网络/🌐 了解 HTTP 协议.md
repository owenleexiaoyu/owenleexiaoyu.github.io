---
{"dg-publish":true,"permalink":"/HaiShu/计算机网络/🌐 了解 HTTP 协议/","tags":["主题/计算机网络"],"noteIcon":"","created":"2017-10-12","updated":"2026-11-14T09:33:22.110+08:00","dg-note-properties":{"date":"2017-10-12","tags":["主题/计算机网络"]}}
---


| 时间         | 内容                      |
| ---------- | ----------------------- |
| 2017.10.12 | 完成初稿                    |
| 2022.09.14 | 调整格式                    |
| 2024.05.05 | 对状态码、Header 等内容进行增补修订文字 |

## 前言

HTTP 是互联网中最基础的网络协议，平常我们上网浏览网页、听音乐、玩游戏等行为都离不开这个协议。对于开发者来说，在开发应用程序时，都少不了需要连接网络的功能。因此，了解 HTTP 协议是很有必要的。

## HTTP 协议简介

HTTP 协议（HyperText Transfer Protocol，超文本传输协议）是一个基于 TCP/IP 的应用层网络协议，它不涉及数据包的传输，规定了客户端与服务器端的通信格式。用于从万维网（WWW）服务器传输超文本到本地客户端。HTTP 协议从 1991 年发布 0.9 版开始，经过 20 多年的发展，不断完善和扩展。

### HTTP 协议的工作原理

HTTP 协议是基于 C/S（客户端/服务端）架构模型来实现的。浏览器作为客户端向 Web 服务器发送请求，Web 服务器收到请求后，向客户端发送响应信息。常见的 Web 服务器有 Apache 服务器、IIS 服务器等。

![](https://img.lixiaoyu.life/blog-res/2026/10/5c90b3b93c81bf6dce75e7120d3c9d80.gif)

### HTTP 协议的特点

1.  媒体独立  
    只要客户端和服务端知道如何处理数据内容，HTTP 可以传输任何类型的数据。

2.  无连接  
    无连接的意思是每次连接只处理一个请求，服务端处理完客户端的请求后，并收到客户端应答后就断开连接，采用无连接的方式可以节省传输时间。

3.  无状态  
    HTTP 协议是无状态协议，即一次请求和上一次的请求之间没有任何关系。如果这次请求需要之前请求的信息，则需要将信息加入到这次请求当中。  
    比如购物网站中，用户登录后购买商品，这时候购买商品的请求就需要加上当前用户信息，否则服务器不知道究竟是谁下了这个订单。

### HTTP URL 格式

```http
http://host[:port][abs_path]
```

`http` 表示使用 HTTP 协议来发送网络请求；`host` 表示合法的 Internet 主机域名或者 IP 地址；`port` 表示端口号，HTTP 协议默认使用 80 端口，也可以另外指定；`abs_path` 表示指定的 Web 服务器上可用资源的 URI。

接下来介绍 HTTP 协议中的报文，包含两种类型，请求报文和响应报文，分别对应客户端向服务器发送请求以及服务器响应请求这两个过程。

## HTTP 请求报文

HTTP 请求报文的一般格式如图所示：

![](https://img.lixiaoyu.life/blog-res/2026/10/c79bb3d1bca7b3932f55cdcf0b5c6cb3.jpeg)

例如：

```kotlin
POST /users HTTP/1.1
Host: api.github.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 21
User-Agent: curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3

name=owen&gender=male
```

请求报文包含**请求行**、**请求报头**、**空行**和**请求数据** 4 个部分。

### 请求行

请求行由请求方法、URL 字段和 HTTP 协议的版本组成，如示例：

```http
GET http://www.runoob.com/http/http-tutorial.html HTTP/1.1
```

#### HTTP 请求方法

HTTP 的请求方法共有 8 个，HTTP 协议 0.9 版本只有一个 `GET` 方法，1.0 版本中增加了 `POST`、`HEAD` 方法，1.1 版本时又新增了 `PUT`、`DELETE`、`TRACE`、`CONNECT`、`OPTION` 这 5 个方法。其中最常用的是 `**GET**` 和 `**POST**`。

![](https://img.lixiaoyu.life/blog-res/2026/10/770852575024a9918894bc032895aeed.jpeg)

##### GET 请求

GET 请求用来获取服务器上某个资源，请求报文中没有 Body。

##### POST 请求

POST 请求用来向服务器增加或者修改资源，请求报文中有 Body。POST 不具有幂等性（幂等性是指调用一次和调用多次结果一样），比如添加用户，调用一次请求，会增加一个用户，调用十次，就会增加十个用户，结果不一致。

##### PUT 请求

PUT 请求用来向服务器修改资源，请求报文中有 Body。如果想要修改资源，用 POST 请求或者 PUT 请求都可以。PUT 具有幂等性，比如修改用户性别，从男性改为女性，调用一次和调用十次，最终结果都是女性，结果是一致的。

##### DELETE 请求

DELETE 请求用来删除资源，请求报文中没有 Body。DELETE 也是幂等的，比如删除某个用户，第一次调用，用户被删除，第二次调用，找不到该用户，删除失败，但最终结果都是这个用户被删除了，是一致的。

##### HEAD 请求

HEAD 请求的使用方式和 GET 请求一样，唯一的区别是 HEAD 请求的响应结果中没有 Body，只有 Header。HEAD 请求可以用来获取信息，比如要下载一个文件，可以先发送一个 HEAD 请求，快速获得响应，在 Header 中看到比如文件的大小、是否支持断点续传等，用于进一步决策，比如分段下载，然后再发 GET 请求开始真正的下载。

### 请求报头（Header）

请求行之后会有 0 个或多个请求报头，如果有请求报头，则每行有 1 个请求头，都是以键值对的形式表示，包括头部域的名字和值，中间用 `:` 分隔。

### 空行

协议中用空行来表示请求报头的结束，空行之后就是请求数据。

### 请求数据（Body）

请求数据是客户端向服务器发送的数据，GET 请求中没有请求数据，出现在使用 POST 方法来向服务器提交表单等情景中。和请求数据相关的最常用的请求头是 `Content-Type` 和 `Content-Length`。

## HTTP 响应报文

HTTP 响应报文的一般格式如下图所示：

![](https://img.lixiaoyu.life/blog-res/2026/10/9a415f95e924f247a3341e07f67ca2e5.jpeg)

响应报文包含 **状态行**、**响应报头**、**空行** 和 **响应正文** 4 个部分。空行表示响应头部和正文的分隔，响应正文则表示服务器返回的资源的内容。响应报头和请求报头和响应报头放在一起在下一小节介绍。下面重点介绍一下状态行和状态码。

### 状态行

状态行依次包括 `HTTP 版本`、`状态码`以及该`状态码对应的原因短语`，示例如下：

```http
HTTP/1.1 200 OK
```

#### HTTP 状态码

HTTP 状态码用来对请求的结果做出类型化的描述，由三个十进制数字组成，第一个十进制数字定义了状态码的类型，后两个数字有分类的作用。HTTP 状态码共分为 5 种类型：

-   100~199：信息，服务器收到请求，需要请求者继续执行操作

-   100：**让客户端继续发**。使用场景有：客户端发送的数据比较大，一次发不完，需要拆分成几个请求来发送，服务器在接收到请求后不能立即开始处理，需要等几个请求都完毕后再开始处理。客户端可以给服务端请求里加个 Header（`Expect: 100-continue`），服务端收到后，知道客户端数据没有发完，就不会处理，在响应中给客户端一个 `HTTP/1.1 100` 的状态码，表示让客户端继续发，等最后一个请求发完了，服务端才开始处理数据，并返回给客户端一个最终结果 `HTTP/1.1 200`。
-   101：**协议切换**。使用场景有：客户端发个请求询问服务端是否支持 HTTP2，在请求 Header 里加一个 `Upgrade: h2c`，如果服务器支持 HTTP2，能识别这个 Header，会返回 `HTTP/1.1 101` 表示它支持 HTTP2，下个请求客户端就可以用 HTTP2 来发送了；如果服务器不支持，不能识别这个 Header，会返回 `HTTP/1.1 200`，客户端就知道服务器不支持 HTTP2，之后的请求还是用 HTTP 1.1 来发送。

-   200~299：成功，操作被成功接收并处理

-   200：最常见的成功状态码，表示请求成功
-   201：创建成功。比如创建一个用户成功

-   300~399：重定向，需要进一步的操作以完成请求

-   301：**资源永久迁移（比如：http -> https）**。比如访问 `http://lixiaoyu.life`，打开网页后，地址变成了 `https://lixiaoyu.life`，这里其实发了两个请求，第一个 `http://lixiaoyu.life` 的结果码是 301，告诉浏览器资源发生了永久迁移，新的地址放在 `Location: https://lixiaoyu.life` 这个响应 Header 里，浏览器会自动发起第二次请求到新地址。

![image.png](https://img.lixiaoyu.life/blog-res/2026/10/fec9795c885b13647ccd3fec7457b492.png)

![image.png](https://img.lixiaoyu.life/blog-res/2026/10/f5d95937e8bd4666677451304a862605.png)

（图中 http -> https 的重定向的状态码是 307）

-   302：表示临时迁移。搜索引擎计算权重不会转移到新的网站上。

-   400~499：客户端错误，请求包含语法错误或无法完成请求

-   404：请求的资源（页面）不存在
-   401：未授权（没有登陆账号）

-   500~599：服务器错误，服务器在处理请求的过程中发生了错误。比如服务器内部资源不足、空间不足、数据库连接失败等，请求本身没有问题，和 4XX 的客户端错误分开，便于排查错误。

## HTTP 的消息报头

HTTP 报文中的消息报头（Header）是 HTTP 数据的元数据，用来对 HTTP 数据进行修饰。

消息报头可以分为通用报头、请求报头、响应报头和实体报头。以键值对的形式存在，每行一对，名字和值之间用 `:` 来进行分隔。

### 通用报头

通用报头既能出现在请求报头也能出现在响应报头中。

-   **Date**：发送消息的日期和时间

```kotlin
Date: Sun, 05 May 2024 02:53:47 GMT
```

-   **Connection**：允许发送指定连接的选项。例如指定连接是连续，或者指定 `close` 选项，通知服务器，在响应完成后，关闭连接。

-   **Cache-Control**：用于指定缓存指令，缓存指令是单向的（响应中出现的缓存指令在请求中未必会出现），并且是独立的（一个消息的缓存指令不会影响另一个消息处理的缓存机制）

```kotlin
Cache-Control: max-age=600
```

### 请求报头

请求报头允许客户端向服务器端传递请求的附加信息以及客户端自身的信息。

常见的请求报头有：

-   **Host**：发送请求时，该报头是必需的。Host 主要用于指定被请求资源的 Internet 主机和端口号，它通常从 HTTP URL 中提取出来。

```kotlin
Host: https://lixiaoyu.life/
```

-   **User-Agent**：用户代理，表示是谁发起网络请求，允许客户端将操作系统、浏览器和其它信息告诉服务器。可以用来做移动端适配。

```kotlin
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36
```

> 所有的 User-Agent 前面都会写 Mozilla，这是为什么？
> 
> 因为在最开始的时候，浏览器的适配非常困难，所以很多网站只会通过 User-Agent 来适配网景的浏览器。后面其他一些浏览器兼容性做的比较好了，但网站仍然不适配它们，所以这些浏览器就都加上了 Mozilla 的 User-Agent。

-   **Accept**：用于指定客户端接受哪些类型的信息。例如 `Accept:image/gif`，表明客户端希望接受 GIF 图象格式的资源；`Accept:text/html`，表明客户端希望接受 html 文本。

```kotlin
Accept: text/html
```

-   **Accept-Charset**：指定客户端可以接受的字符集。

```kotlin
Accept-Charset: utf-8
```

-   **Accept-Encoding**：指定客户端可以接受的压缩编码类型。

```kotlin
Accept-Encoding:gzip
```

-   **Accept-Language**：指定客户端可以接受的自然语言。

```kotlin
Accept-Language:zh-cn // 表示支持中文
```

-   **Authorization**：授权信息，这个 Header 用来证明客户端有权查看某个资源。当浏览器访问一个页面时，如果收到服务器的响应代码为 `401（未授权）`，可以发送一个包含 `Authorization` Header 的请求，要求服务器对其进行验证。

### 响应报头

响应报头用于服务器向客户端发送信息。

常见的响应报头有：

-   **Location**：重定向（状态码 3XX 的情况）的目标 URL。

```kotlin
Location: https://lixiaoyu.life/
```

-   **Server**：包含了服务器用来处理请求的软件信息，与 `User-Agent` 请求报头域是相对应的。

```kotlin
Server: GitHub.com
```

-   **WWW-Authenticate**：必须被包含在 `401（未授权）` 响应消息中，客户端收到 401 响应消息时候，并发送 `Authorization` 这个 Header 请求服务器对其进行验证时，服务端响应里包含这个 Header。
-   `Transfer-Encoding: chunked`：分块传输，在服务器还未获取到完整内容时，更快对客户端做出响应，减少用户等待。此时内容长度不固定，所以不能有`Content-Length` 这个 Header。

Body 的格式如下，以 `0\n` 作为结束标志，表示传输结束。

```kotlin
<length1>
<data1>
<length2>
<data2>
<length3>
<data3>
0

```

![image.png](https://img.lixiaoyu.life/blog-res/2026/10/b5a37226547a28f2d629d874cdde5367.png)

-   **Accept-Ranges**：支持分段加载

响应 Header 里如果有 `Accept-Ranges` 这个 Header，就表明支持分段加载，比如 `Accept-Ranges: bytes`（这个 bytes 表示用字节来分段）

![image.png](https://img.lixiaoyu.life/blog-res/2026/10/1d4c19b7e4e8dff7b5632e5f23f26d84.png)

在请求的 Header 中添加一个 `Range` 的 Header，比如`Range: bytes=0-30037` 指定分段下载的范围。（原图的 Content-Length 是 60057，这里指定了一半）

![image.png](https://img.lixiaoyu.life/blog-res/2026/10/9762238818c28929c1112d5ed8a7abd7.png)

效果是这样的（只下载了图片的一半）：

![image.png](https://img.lixiaoyu.life/blog-res/2026/10/82b8e7765c4fbdcd47c3310bdc4b20d4.png)

这个请求的响应里还会有个 `Content-Range: bytes 0-30057/60057` 的 Header，表示当前的分段，以及总的字节数。

用途：

-   断点续传，分段下载；
-   多线程下载：很多服务器为了性能给每个端口设置了带宽限制，以便支持更多连接；多线程下载就绕过了这个限制。

### 实体报头

这类 Header 都是用来修饰请求或者响应中的 Body 数据。

常见的实体报头有：

-   **Content-Encoding**：内容的压缩编码格式。

```kotlin
Content-Encoding: gzip
```

-   **Content-Language**：描述了内容的自然语言。

```kotlin
Content-Language: en
```

-   **Content-Length**：用于指明内容的长度，以十进制数字来表示。

```kotlin
Content-Length: 3501
```

> 为什么需要发送内容的长度？
> 
> 因为内容可能是二进制数据，什么字符都有，没有办法找到一个固定的结束符号。比如发送纯文本时，可以规定以 `\n` 作为结束符，但在发送二进制数据时，内容中可能包含 `\n`，这时内容就会被不符合预期地截断。所以需要发送内容长度，在读取内容时，只读取对应长度的内容。

-   **Content-Type**：用于指明发送给接收者的实体正文的媒体类型。比如 `application/json` 表示内容是 JSON 格式的字符串，`text/html` 表示是 HTML 文本。

```kotlin
Content-Type: text/html; charset=utf-8
```

-   **Last-Modified**：用于表示资源最后修改的日期和时间。

```kotlin
Last-Modified: Thu, 11 Jan 2024 16:01:30 GMT
```

### Content Type 详解

下面来详细介绍下几种 Content-Type。

#### text/html

表示内容是 HTML 文本，用在浏览器页面响应中。

```kotlin
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 800

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
...
```

#### application/x-www-form-urlencoded

普通表单，Encoded URL 格式，发送的内容是纯文本，不同的字段之间用 `&` 分隔。

![image.png](https://img.lixiaoyu.life/blog-res/2026/10/212b76d1263c9bd7ef1513650442452d.png)

```kotlin
POST /users/1 HTTP/1.1
Host: api.hencoder.com
Content-Length: 26
Content-Type: x-www-form-urlencoded

name=owen&nickname=owen111
```

#### application/json

JSON 格式，用来作为 Web API 的响应，或者发送 POST/PUT 请求。

![image.png](https://img.lixiaoyu.life/blog-res/2026/10/89718c4679f956c1c6e4da6c2dcc6206.png)

#### multipart/form-data

多部分形式，一般用于传输包含二进制数据的多项内容

![image.png](https://img.lixiaoyu.life/blog-res/2026/10/552bdc1bdef04198d5c56364dbecf7bd.png)

![image.png](https://img.lixiaoyu.life/blog-res/2026/10/ed9cf6daaf279c7222a81d251b61dd49.png)

boundary：分隔符，用来将多个部分分开，因为包含了二进制数据，简单的分隔符在二进制数据中可能出现，会造成数据解析错误，所以需要一个长串来作为分隔符，这个长串在二进制数据中出现的概率较小，如果出现了，则请求失败，再重发一次。

> 为什么普通表单不需要 boundary？
> 
> 其实也是有的，就是 `&` 符号。不需要使用长串作为分隔符（增加了报文的长度，浪费带宽和流量）。

#### image/jpeg、application/zip 等

表示单个文件的内容格式，用在 Web API 的响应或者发送 POST/PUT 请求。

![image.png](https://img.lixiaoyu.life/blog-res/2026/10/868ff9ecfbfbebed6accc4c366a77a6c.png)（左边：上传单个图片，比如移动端换用户头像；右边：下载图片）

## 参考文章

学习过程中阅读了如下几篇文章和教程，感谢这些作者辛勤付出。

-   [刘望舒： Android网络编程（一）HTTP协议原理](http://liuwangshu.cn/application/network/1-http.html)
-   [HTTP协议详解](http://www.cnblogs.com/li0803/archive/2008/11/03/1324746.html)
-   [阮一峰： HTTP 协议入门](http://www.ruanyifeng.com/blog/2016/08/http.html)
-   [菜鸟教程： HTTP 教程](http://www.runoob.com/http/http-tutorial.html)