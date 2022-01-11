---
layout: post
title: Java EE 学习笔记（3）HttpServlet 详解
date: 2017-11-14 22:34
tags: ["J2EE"]
categories: 技术
cover: http://image.wufazhuce.com/FjMv0htbAPqGuWlRvSA8LQLH2BNa
---
### HttpServlet API 介绍

在上篇笔记中简单提到了一下 HttpServlet 这个类，它是 Servlet 的一个针对于 Http 协议的实现类。HttpServlet  的父类是 GenericServlet，GenericServlet 是一个通用的、与网络协议无关的 Servlet 实现类。由于我们接触最多的就是使用 Http 协议进行网络通信，所以将重点放在 HttpServlet 上。

下面介绍 HttpServlet 的相关方法：

> void init(ServletConfig config)
> void init()

这两个init 方法继承自它的父类。带参数的init 方法是实现 Servlet 接口所定义的抽象方法。不带参数的 init 方法则是他的重载形式。关于带参数的init 方法，在 Servlet  中已经提到，这里不再重复。这两个初始化方法的区别在于，当我们需要做自己的初始化工作（如连接数据库等）时，如果使用有参的 init 方法，必须在自己的初始化代码前手动加上 **super.init(config);** 这一行代码，否则在 Servlet 组件初始化时，无法接收来自Web容器的 ServletConfig 对象。而如果使用无参的 init 方法，则可以直接写自己的初始化代码。如：

```
Override
public void init() throws ServletException {
	//连接数据库的代码
}
@Override
public void init(ServletConfig config) throws ServletException {
	super.init(config);
	//连接数据库的代码
}
```
在 HttpServlet 父类 GenericServlet 的源码中，这两个方法是这样的：

```
public void init(ServletConfig config)
        throws ServletException {
    this.config = config;
    init();
}
public void init()
        throws ServletException {
}
```

在有参的 init 方法中调用了无参的 init 方法，因此我们重写无参 init 方法时无需再显式调用父类中的实现。

> void service(ServletRequest req, ServletResponse res)
> void service(HttpServletRequest req, HttpServletResponse resp)

HttpServlet 中有两个 service 方法，我们还是看看源码中这两个方法时如何实现的。

```
    public void service(ServletRequest req, ServletResponse res)
        throws ServletException, IOException
    {
        HttpServletRequest request;
        HttpServletResponse response;
        try
        {
            request = (HttpServletRequest)req;
            response = (HttpServletResponse)res;
        }
        catch(ClassCastException e)
        {
            throw new ServletException("non-HTTP request or response");
        }
        service(request, response);
    }
```

从上面的代码中可以看到在参数类型分别为第一个 service 方法中，其实是将两个参数分别进行向下转型，将 ServletRequest、ServletResponse 类型的参数分别转换为 HttpServletRequest 和 HttpServletResponse，然后调用第二个 service 方法。所以我们自己的 Servlet 在覆盖 service 方法时只需要覆盖第二个即可。

> void doGet(HttpServletRequest req, HttpServletResponse resp)
> void doPost(HttpServletRequest req, HttpServletResponse resp)

在 HttpServlet 中这样以 do 开头的方法共有7个，分别对应 Http 协议中 7 种请求方式。我们最常使用的是 GET 和 POST 方法，所以这里只列出这两个方法。顾名思义，doGet 方法就是专门处理 GET 方式的网络请求，doPost 方法就是专门处理 POST 方式的网络请求。但是在 Servlet 中处理请求的是 service 方法，那么它和这些 doXXX 方法之间有什么联系呢？我们看看源码就可以知道了。

```
    protected void service(HttpServletRequest req, HttpServletResponse resp)
        throws ServletException, IOException
    {
        String method = req.getMethod();
        if(method.equals("GET"))
        {
            long lastModified = getLastModified(req);
            if(lastModified == -1L)
            {
                doGet(req, resp);
            } else
            {
                long ifModifiedSince;
                try
                {
                    ifModifiedSince = req.getDateHeader("If-Modified-Since");
                }
                catch(IllegalArgumentException iae)
                {
                    ifModifiedSince = -1L;
                }
                if(ifModifiedSince < (lastModified / 1000L) * 1000L)
                {
                    maybeSetLastModified(resp, lastModified);
                    doGet(req, resp);
                } else
                {
                    resp.setStatus(304);
                }
            }
        } else
        if(method.equals("HEAD"))
        {
            long lastModified = getLastModified(req);
            maybeSetLastModified(resp, lastModified);
            doHead(req, resp);
        } else
        if(method.equals("POST"))
            doPost(req, resp);
        else
        if(method.equals("PUT"))
            doPut(req, resp);
        else
        if(method.equals("DELETE"))
            doDelete(req, resp);
        else
        if(method.equals("OPTIONS"))
            doOptions(req, resp);
        else
        if(method.equals("TRACE"))
        {
            doTrace(req, resp);
        } else
        {
            String errMsg = lStrings.getString("http.method_not_implemented");
            Object errArgs[] = new Object[1];
            errArgs[0] = method;
            errMsg = MessageFormat.format(errMsg, errArgs);
            resp.sendError(501, errMsg);
        }
    }
```

可以看到，在第二个 service 方法中根据请求的方式，来对请求进行了转发。如果请求方法为 GET，就调用 doGet 方法进行处理，如果请求方式为 POST，则调用 doPost 方法来处理。所以我们自己的 Servlet 中，可以根据不同的请求方式，在相应的 do 方法中编写处理逻辑，而不用覆盖 service 方法。

之前向客户端返回一段字符串的 Servlet 示例也可以这样来实现：

```
public class HelloServlet extends HttpServlet{
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
			throws ServletException, IOException {
		PrintWriter out = resp.getWriter();
		out.println("Hello World.");
	}
}
```

注意：上述提到的几个方法都有可能会出现异常，我们覆盖相应方法时需要在参数列表后 throws（抛出）这些异常。不然就需要在方法中使用 try-catch 结构来捕获异常。（通常 IDE 都会自动 throws 异常） 

> String getInitParameter(String name)
> Enumeration< String> getInitParameterNames()
> ServletContext getServletContext()
> String getServletName()

上面四个方法同样继承自它的父类，但实际上这四个方法是 ServletConfig 中的方法。我们看看其中 getServletContext 的源码实现：

```
public ServletContext getServletContext() {
    return getServletConfig().getServletContext();
}
```

可以看到，GenericServlet 中的 getServletContext 方法，是通过调用它的成员变量 ServletConfig 对象的 getServletContext 来实现的。这样做的好处在于我们可以直接在 Servlet 类中调用到 ServletConfig 的各个方法，更加方便。

其他的一些方法如 destroy、getServletConfig、getServletInfo 等之前的笔记中已经进行了说明，这里就不一一列举。

### POST 实例

下面，我们写一个关于 POST 请求的实例，模仿网站的登录功能。

**1.**在项目中新建一个 HTML 文件（暂时还没学到  JSP，所以没有用它），在 Eclipse 中这个文件通常放在 WebContent 这个文件夹下。index.html 中代码如下：

```
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
	<form action="login" method="POST">
		username:<input type="text" name="username"><br/>
		password:<input type="password" name="password"><br/>
		<input type="submit" value="登录">
	</form>
</body>
</html>
```

网页中有一个表单，其中有用户名和密码的输入框和登录按钮。效果如图：

![img1.png](https://i.loli.net/2019/08/29/y7Isnjph5KebAOg.jpg)

**2.**新建 LoginServlet，继承自 HttpServlet。获取到登录的用户名和密码，打印在控制台上，并在页面中显示欢迎语。代码如下：

```
public class LoginServlet extends HttpServlet{
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
			throws ServletException, IOException {
		String name = req.getParameter("username");
		String password = req.getParameter("password");
		System.out.println("name = "+name);
		System.out.println("password = "+password);
		PrintWriter out = resp.getWriter();
		out.println("Welcome,"+name);
	}
}
```

注意：我们这里需要使用 doPost 方法，因为我们在 HTML 文件中将表单的请求方式设置成了 POST。另外，调用 **req.getParameter** 方法时，传进去的参数名要和  form 表单中 input 标签的 name 一致。

**3.**配置 web.xml 文件，注册 LoginServlet 并添加 URL 映射。

```
	<servlet>
		<servlet-name>LoginServlet</servlet-name>
		<servlet-class>cc.lixiaoyu.helloweb.LoginServlet</servlet-class>
	</servlet>
	<servlet-mapping>
		<servlet-name>LoginServlet</servlet-name>
		<url-pattern>/login</url-pattern>
	</servlet-mapping>
```

这里需要注意的一个地方在于 url-pattern 的值需要和 HTML 文件里 form 表单的 action 的值一致，否则无法映射成功。

**4.**运行。我们将项目运行起来，在 HTML 页面中输入用户名 Owen，密码 123456，点击登录。实际效果如图：


![img2.png](https://i.loli.net/2019/08/29/A69rVXcFdWOhomI.jpg)

### 结语

这篇笔记介绍了 HttpServlet 的相关方法，用源码解释了一些现象，并实现了一个简易的用户登录示例。这篇笔记就到这里，下篇笔记见。







