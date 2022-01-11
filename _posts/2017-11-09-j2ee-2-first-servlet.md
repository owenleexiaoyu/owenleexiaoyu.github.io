---
layout: post
title: Java EE 学习笔记（2）第一个 Servlet 程序及 Web 应用部署
tags: ["J2EE"]
categories: 技术
date: 2017-11-09 17:15
cover: http://image.wufazhuce.com/FnnEhHOnpYCgOb4bIWpn0fK3p7j_
---
### 前言

这篇笔记中将介绍 Servlet 组件的基本使用，以及使用Servlet 组件完成一个最简单的 Web 应用，并介绍在 Tomcat 上部署 Web 应用的几种方式。

### Servlet 简介

Servlet 是 Java EE 规范中定义的一个组件。它是运行在服务器端的一个小程序，可以响应来自客户端的请求，生成动态的 Web 界面。Servlet 和以前写的 Java SE 的程序的区别在于：Servlet 不是一个完整的 Java 程序，没有入口 main 函数。Servlet 运行在 Web 服务器的 Web 容器中，由 Web 容器进行管理。Web 容器创建并初始化 Servlet，管理多个 Servlet 实例，将客户端的请求传递给 Servlet，并将 Servlet 的响应返回给客户端，在 Servlet 使用完后，终结该 Servlet。服务器关闭时，Web 容器会从内存中删除 Servlet。

作为一个组件，Servlet 有生命周期函数。当Servlet被 Web 容器创建和被销毁时会由 Web容器调用 init()、destory() 这样的生命周期函数。

### Servlet 用法

Servlet 是一个接口，我们创建自己的 Servlet 时必须实现该接口，然后实现 Servlet 接口中的抽象方法。如以下代码所示：

```
public class HelloServlet implements Servlet{
	private ServletConfig config;
	@Override
	public ServletConfig getServletConfig() {
		return config;
	}

	@Override
	public String getServletInfo() {
		return null;
	}

	@Override
	public void init(ServletConfig config) throws ServletException {
		this.config = config;
	}
	
	@Override
	public void destroy() {
	}
	
	@Override
	public void service(ServletRequest request, ServletResponse response) 
			throws ServletException, IOException {
		response.setContentType("text/html;charset=utf-8");	
		PrintWriter out = response.getWriter();
		out.println("<h1>Hello World.</h1>");
	}
}
```

下面依次来介绍这几个抽象方法。

> void init(ServletConfig c)

Servlet 的初始化方法，我们可以在这个方法中做一些初始化工作，如连接数据库等。ServletConfig 从字面意思就知道它是表示 Servlet 的配置信息，是 Web 容器和  Servlet 连接的纽带。

通常实现 Servlet 接口后，类中会定义 ServletConfig 类型的成员变量，在init() 方法中使用 **this.config = config;** 这样的代码接收 Web 容器传递过来的 ServletConfig 实例。

Web 容器在创建 Servlet 实例并初始化时调用 init() 方法，并且这个方法必须在 Servlet 接收任何客户端请求之前完成执行。init() 方法作用相当于构造函数，所以我们不用另外写构造函数（写了有可能是会报错的）。

> ServletConfig getServletConfig()

获取 ServletConfig 对象。返回 ServletConfig 类型的成员变量。

> String getServletInfo()

获取 Servlet 的信息，例如作者、版本、版权等。（好像没什么用，所以一般都返回 null）

> void destory()

Web 容器在 Servlet 的 service() 方法执行完毕后（所有线程都执行结束）后调用该方法。服务器宕机时也会调用。我们可以在这个方法中进行资源的释放。

> void service(ServletRequest req, ServletResponse res) throws ServletException, IOException

这个方法处理 Web 容器传递的客户端请求，并将响应结果通过 Web 容器返回给客户端。这个方法只有在 Servlet 的 init() 方法成功完成后才能被调用。

参数一个是 ServletRequest 对象，包含客户端请求；另一个是 ServletResponse 对象，包含响应信息。这个方法会抛出两个异常，一个是 ServletException，一个是 IOException（因为在读取请求数据和发送响应数据时都使用了 IO 流）。

在上面的示例代码中向客户端返回一个简单的字符串数据。调用 **response.getWriter()** 方法获取一个字符输出流对象，通过这个输出流来发送响应数据。ServletResponse 对象还可以调用 **getOutputStream()** 来获取字节输出流，用于传输二进制数据（如文件、音频、视频等）。同样的道理，ServletRequest 对象可以获取到输入流，用于读取请求数据。具体的用法后续笔记中会介绍。

可以看到上面四个抽象方法中，真正处理请求的只有 service() 方法。另外四个方法在没有特别需求的情况下用处不大，但是每次实现 Servlet 接口时却都必须实现上面所有的方法，这非常不友好。

Java EE 中有 Servlet 接口的实现类 HttpServlet，专门用于处理 HTTP 协议的请求（Servlet 不是只应用于HTTP 协议，对 FTP、邮件协议等同样适用）。我们现在只需继承 HttpServlet 这个类，按实际需求来选择覆盖上述方法即可。比如将上面的代码改造成继承 HttpServlet 的形式：

```
public class HelloServlet extends HttpServlet{
	
	@Override
	protected void service(HttpServletRequest req, HttpServletResponse res) 
			throws ServletException, IOException {
		response.setContentType("text/html;charset=utf-8");	
		PrintWriter out = response.getWriter();
		out.println("<h1>Hello World.</h1>");
	}
}
```
是不是简洁了很多呢，只要覆盖 service() 这一个方法就可以了。

上面的两份代码中有一点区别的地方在于 service() 方法的参数类型分别是 HttpServletRequest 和 HttpServletResponse，这两个类是 ServletRequest 及  ServletResponse 的子类，专门针对于 HTTP 协议的请求与响应。

### Web 应用的部署

#### Web 应用文件结构

首先来讲讲一个 Web 应用的文件结构，最简单的如下图所示（图中直角方框代表文件夹，圆角方框代表文件）。使用 Eclipse 创建的项目文件结构略有不同，但大体相似。

![img1.png](https://i.loli.net/2019/08/29/6MmP318OwfYv4cK.jpg)

解释一上面这张图：first 是我们应用的名字（命名是随意的），first 这个文件夹也是应用的根文件夹，Web 应用中的所有资源及代码都放在这个文件夹下（或其子文件夹）。WEB-INF 这个文件夹是必不可少的，并且识别大小写，命名不能出错。它有两个子文件夹，lib 文件夹用于存放我们自己打包好的 jar 文件或第三方的 jar 文件。classes 文件夹用于存放编译好的 .class 文件。web.xml 是 Web 应用部署描述符文件，非常重要。

```
<?xml version="1.0" encoding="utf-8"?>
<web-app>
	<servlet>
		<servlet-name>HelloServlet</servlet-name>
		<servlet-class>HelloServlet</servlet-class>
		<init-param>
			<param-name>port</param-name>
			<param-value>8081</param-value>
		</init-param>
	</servlet>
	<servlet-mapping>
		<servlet-name>HelloServlet</servlet-name>
		<url-pattern>/hello</url-pattern>
	</servlet-mapping>
</web-app>
```

- web.xml 文件中的根标签为「web-app」，对应我们这个 web 应用。
- 「servlet」标签对应我们自己写的 Servlet 实现类或者 HttpServlet 的子类，如 HelloServlet。
- 该标签下一定会有「servlet-name」和「servlet-class」两个子标签。「servlet-name」可以随意指定，只要保证唯一即可。「servlet-class」指向这个 Servlet 类的位置，有包的情况下要写全路径。
- 可以在「servlet」标签下添加「init-param」标签，由「param-name」和「param-value」这样的键值对形式组成，这些初始化参数将会封装到 ServletConfig 对象中，我们在自己的 Servlet 中可以使用如下代码获得这些参数。

```
//获取到 Servlet 的初始化参数 port，值为 8001
String port = getServletConfig().getInitParameter("port");
```

- 每个「servlet」标签都应该对应一个「servlet-mapping 」标签，将客户端请求的 url 映射到对应的 Servlet 中。「servlet-mapping」标签下，「servlet-name」子标签同样表示 Servlet 的唯一标识名，「url-pattern」是基于根路径的相对路径。这里的根路径为「http://localhost:8080/first」，所以完整的请求 url 为「http://localhost:8080/first/hello」。

#### 部署方式

在 Tomcat 上部署 Web 应用主要有以下三种方式，略作介绍，以供了解。

1.将 Web 应用的文件夹（如 first）复制到 Tomcat 安装目录下的 webapps 文件夹里面。然后启动 Tomcat 即可。

2.将 Web 应用的整个文件夹打成一个 war 包，然后将 war 文件放到 webapps 文件夹里。Tomcat 会自动将该 war 文件解压。

3.无需复制文件夹或者打 war 包，在 Tomcat 目录下的 conf 文件夹中找到 server.xml 文件，在「Host」标签下添加一个「Context」标签，内容如：

```
<Host>
	<Context path="/zeze" docBase="D:\second"/>
</Host>
//second 这个web应用在D盘下
//这样部署后，可以通过http://localhost:8080/zeze/访问到这个web应用
```























