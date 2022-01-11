---
layout: post
title: Java EE 学习笔记（4）关于 Servlet 的一些补充
tags: ["J2EE"]
categories: 技术
date: 2017-11-17 15:30
cover: http://image.wufazhuce.com/FoBEubfSGAroMoMdI_jx0nH0gh7y
---
这篇笔记中，针对之前笔记中出现的一些类和接口，以及这些类的相关方法，做一个补充。涉及的类有 HttpServletRequest、HttpservletResponse、ServletConfig、ServletContext。

### 1. HttpServletRequest

HttpServletRequest 是一个接口，继承自 ServletRequest，表示客户端向 Servlet 组件发送的 HTTP 	请求。作为一个HTTP请求，它必然包含以下信息：

- 请求方式（GET、POST 等）
- 请求的URL
- 请求头信息
- 请求的正文数据（POST 中会有）

我们通过介绍它的常用 API 来了解如何通过HttpServletRequest 对象来获取上述这些信息。

> ServletInputStream **getInputStream**() throws IOException

这个方法是其父接口中的方法，获取请求的对应的字节输入流对象。我们可以通过这个方法获得用户上传的二进制数据，比如音频、视频文件等。

> BufferedReader **getReader**() throws IOException

获取请求对应的字符输入流对象，读取客户端的字符数据。

> String **getParameter**(String name)
> Enumeration< String> **getParameterNames**()

上面两个方法都与获取请求参数有关，我们使用 POST 方法发送的参数就是通过这几个方法来获得。第一个通过参数名返回参数的值。第二个返回所有参数名的一个迭代器对象，可以依次迭代取出每个参数名对应的参数值。

例如，POST 请求中有三个参数 username=Owen;age=22;password=123456，我们看看如何在Servlet中获得这些参数。

```
Enumeration<String> names = request.getParameterNames();
while(names.hasMoreElements()){
	String paramName = names.nextElement();
	String paramValue = request.getParameter(paramName);
	System.out.println("参数："+paramName+"="+paramValue);
}
```

> String **getMethod**()

返回 HTTP 请求的方式，如 GET、POST 等。上篇笔记中就提到 HttpServlet 的 service 方法正是通过获取到请求方式来进行请求的转发，详细介绍可见上篇笔记。

> String **getHeader**(String name)
> Enumeration< String> **getHeaderNames**()
> int **getIntHeader**(String name)
> long **getDateHeader**(String name)

上面几个方法都与获取 HTTP 请求的请求头有关。因为请求头中每一项，都是键值对的形式，所以这几个方法和上面获取 POST 请求参数的方法非常类似。第一个通过Header 的名字返回 Header的值。第二个方法返回所有header的迭代器对象。第三个方法通过header的名字返回header的值，这个值的类型必须是int类型，否则会出现 NumberFormatException 的异常。第四个方法通过header的名字返回日期相关的header的值。这个值必须要可以转换程Date类型，否则会抛出 IllegalArgumentException 的异常。

> Cookie[] **getCookies**()

这个方法返回一个包含了客户端与此请求一起发送的所有Cookie对象的数组。如果没有发送cookie，这个方法将返回null。关于 Cookie 后面的笔记中也会有详细说明。

> HttpSession **getSession**()
> HttpSession **getSession**(boolean create)

返回与这个请求关联的会话 HttpSession，如果没有就新建一个会话并返回。第二个方法中参数 create 如果为 false，则没有关联的会话时不会创建新的会话，返回 null。关于 Session，后面同样会详细介绍。

### 2. HttpServletResponse

HttpServletResponse 是一个接口，它的父接口是ServletResponse，表示Servlet组件向客户端返回的一个HTTP响应。同样，和HttpServletRequest类似，作为Http响应，它应该包含以下信息。
 - 响应状态信息（状态码等）
 - 响应头部
 - 响应内容

在 HttpServletResponse 的API中，常见的方法有：

> ServletOutputStream **getOutputStream**() throws IOException

这个方法是 HttpServletResponse 的父接口  ServletResponse 中定义的方法，获取响应关联的字节输出流，用来向客户端返回二进制数据，比如传输一个文件等。会抛出 IOException。

> PrintWriter **getWriter**() throws IOException

同样是父接口中定义的方法，获取响应所关联的字符输出流，向客户端传输字符数据。（如之前实例中的返回 Hello World）

> void **setContentLength**(int len)

设置响应正文长度。

> void **setContentType**(String type)

设置响应正文的MIME类型及字符编码格式。
例如返回的是一个HTML页面：

```
//设置MIME 类型为text/html，编码格式为utf-8
resp.setContentType("text/html;charset=utf-8");
```
常用的MIME类型有：

> text/html HTML 格式
> text/xml XML 格式
> text/json JSON格式
> image/jpg JPG图片格式

再比如返回的是一个可下载的二进制文件：

```
//设置MIME类型为application/x-download
resp.setContentType("application/x-download");
```

> void **setHeader**(String name,String value)

此方法设置响应头部信息，还有很多类似的方法如addHeader等，作用大同小异，这里不一一列举。这个方法的两个参数分别是header 的名字和值。例如：

```
resp.setHeader("Content-Type","text/html;charset=utf-8");
```

上述代码的作用和之前使用 setContentType 方法是一样的。

> void **setStatus**(int sc)
> void **setStatus**(int sc, String sm)

设置该响应的状态码及说明行文字。

> void **sendError**(int sc) throws IOException
> void **sendError**(int sc, String msg) throws IOException

发送响应出错时的状态码及原因。

> void **addCookie**(Cookie cookie)

将指定的cookie添加到响应中。可以多次调用此方法来设置多个Cookie。Cookie 的相关知识后面笔记中会介绍。

> String **encodeURL**(String url)

这个方法用于进行URL重写，当浏览器禁用Cookie时，可以使用这个方法来维持会话。

### 3. ServletConfig

ServletConfig 接口用于在Servlet初始化时，Web容器向Servlet组件传递消息。ServletConfig 传递的初始化参数均以键值对的形式存在，所以和HttpServletRequest 中获取请求参数方式非常类似。ServletConfig 中的方发只有四个，我们依次来看看。

> String **getInitParameter**(String name)
> Enumeration< String> **getInitParameterNames**()

第一个方法通过初始化参数名来获得对应的值，第二个方法获得初始化参数名字的迭代器对象，逐一迭代可以取得所有的参数名。

在web.xml 中声明一个Servlet 组件时，可以添加初始化参数，比如：

```
<servlet>
	<servlet-name>HelloServlet</servlet-name>
	<servlet-class>HelloServlet</servlet-class>
	<init-param>
		<param-name>port</param-name>
		<param-value>8081</param-value>
	</init-param>
	<init-param>
		<param-name>host</param-name>
		<param-value>127.0.0.1</param-value>
	</init-param>
</servlet>
```

上述代码中添加了两个初始化参数，参数名分别为host和port。我们可以通过以下代码来获取相应的初始化参数值。

```
Enumeration<String> names = config.getInitParameterNames();
while(names.hasMoreElements()){
	String initParamName = names.nextElement();
	String initParamValue = config.getInitParameter(initParamName);
	System.out.println("初始化参数："+initParamName+"="+initParamValue);
}
```

用法和之前的HttpServletRequest获取请求参数是一样的。

> String getServletName()

返回当前Servlet实例的名称。

> ServletContext getServletContext()

这个方法返回当前这个 Sercvlet 所在的应用的上下文信息。

### 4. ServletContext

Web 容器启动时会给每个Web应用都创建一个ServletContext对象，它代表当前的Web应用。这个ServletContext 对象被应用中的多个Servlet组件所共享，不同的Servlet 可以通过ServletContext 来进行通讯。

ServletContext 对象可以由ServletConfig 对象的方法来获得，也可以通过Servlet对象的方法获得。（之前的笔记中有提到）

ServletContext 主要有以下几个作用：

**4.1 多个Servlet 通过ServletContext 实现数据共享。**

涉及的方法有：

> void setAttribute(String name, Object object)
> Enumeration< String> getAttributeNames()
> Object getAttribute(String name)

第一个方法向ServletContext中写入共享属性，第二第三个方法从它读出共享属性，由于也是采用键值对的形式，就不赘述，应该已经非常简单了。

例如，在LoginServlet 中向ServletContext中写入属性name：

```
ServletContext context = this.getServletContext();
context.setAttribute("name", "owen");
```

在HelloServlet 中读出这个属性：

```
ServletContext context = this.getServletContext();
String name = (String) context.getAttribute("name");
System.out.println(name);
```

**4.2 获取Web应用的初始化参数**

ServletConfig 能够获得对应Servlet的初始化参数，同样，Web应用也有一些初始化参数，这些参数就是通过ServletContext对象来获得。

涉及的方法有：

> boolean setInitParameter(String name, String value)
> Enumeration< String> getInitParameterNames()
> String getInitParameter(String name)

这样形式的方法和ServletConfig 中的方法几乎一模一样，也无须多解释，直接来一个例子就行了。

web.xml 文件中Web应用的初始化参数：

```
<web-app>   
	<context-param>   
		<param-name>password</param-name>   
		<param-value>123456</param-value>   
	</context-param>   
	<context-param>   
		<param-name>username</param-name>   
		<param-value>root</param-value>   
	</context-param>   
</web-app> 
```

在Servlet中：

```
ServletContext context = this.getServletContext();   
//获取web.xml文件中所有的初始化应用参数          
Enumeration<String> enumer = context.getInitParameterNames();   
while(enumer.hasMoreElements()){   
	String name = enumer.nextElement();   
	String value = context.getInitParameter(name);   
	System.out.println(name+"=========="+value);   
}  
```

**4.3 实现Servlet的转发**
**4.4 利用ServletContext获取资源文件**

这两种方法后续笔记中会有详细介绍。