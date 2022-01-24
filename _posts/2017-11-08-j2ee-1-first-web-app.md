---
layout: post
title: Java EE 学习笔记（1）Java EE 简介与第一个 Web 应用程序
tags: ["J2EE"]
categories: 技术
date: 2017-11-08 12:46
cover: https://s2.loli.net/2022/01/24/bYlI1sQxWjHJi9V.jpg
---
### Java EE 简介

Java EE 的全称是 Java Enterprise Edition（Java 企业版），也称 J2EE。针对开发企业级应用的需求，Sun 公司在 Java SE（Java 标准版）基础上推出了 Java EE。Java EE 并不是一门编程语言，而是一种体系结构，或者说是一种开发规范。

它将企业应用程序分成多个不同的层，每层都定义一些容器组件来规范这层的作用。典型的 Java EE 结构的应用包括如下四层：客户层、表示逻辑层（Web 层）、业务逻辑层和企业信息系统层。

![img1.png](https://i.loli.net/2019/08/30/64v1ZfBimMP395R.jpg)

### 准备工作

在开始开发 Java EE 应用之前，需要做一些准备工作。主要有以下四步：

**1. 安装 JDK**
Java EE 是建立在 Java SE 基础之上的，所以 JDK 和 JRE 的安装必不可少。

主要的步骤为：
- [在 Oracle 官网](http://www.oracle.com/technetwork/java/javase/downloads/index.html)下载JDK安装包。目前最新的 JDK 版本是 1.9，我们可以选择比较稳定的 1.8 版本，注意选择符合自己电脑操作系统的版本。

![img2.png](https://i.loli.net/2019/08/30/siMdIGZ9RHPQkxO.jpg)

- 下载完毕后，点击安装包进行安装，安装位置随自己选择。

![img3.png](https://i.loli.net/2019/08/30/RbhVQM6tZFADuXl.jpg)

- 配置环境变量。

单击「计算机」→「属性」→「高级系统设置」，单击「环境变量」。

新建变量名为「**JAVA_HOME**」的环境变量，变量值为 **JDK 的安装路径**，如图：

![img4.png](https://i.loli.net/2019/08/30/hwTp6R8ldK7Py1N.jpg)

![img5.png](https://i.loli.net/2019/08/30/NsFDGu8YgAwVSxn.jpg)

编辑「**Path**」环境变量，在原变量值的最后面加上「**;%JAVA_HOME%\bin**」（注意最前面的分号不能缺省 ），如图：

![img6.png](https://i.loli.net/2019/08/30/kIgrhyTtKae9FnY.jpg)

![img7.png](https://i.loli.net/2019/08/30/aThFVn2J8YlA6Xm.jpg)

新建「**CLASSPATH**」环境变量，值为「**.;%JAVA_HOME%\lib;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar**」，如图：

![img8.png](https://i.loli.net/2019/08/30/Jx4rV1iKtMfE87k.jpg)

- 配置好环境变量后，在命令行输入 **java -version** 来查看是否安装成功。

如果出现 java 的版本信息，则安装成功；如果提示 java 不是命令则安装失败。

![img9.png](https://i.loli.net/2019/08/30/tq5aQUMJlL1AnbF.jpg)

**2. 安装 Eclipse**

安装好 JDK 之后，我们还需要有一个开发工具，也就是 IDE。在这里推荐使用Eclipse j2ee 版本或者 Intellij IDEA  专业版。Intellij IDEA 专业版是收费的，免费的社区版不支持 Web 应用开发，如果有经济实力的话这是非常好的选择。这里我们选择 Eclipse j2ee 版本作为开发工具。

在[ Eclipse 官网](http://www.eclipse.org/)下载适合系统的 Eclipse 压缩文件，下载后直接解压到 D 盘或其他位置即可使用，这里就不细述。

![img10.png](https://i.loli.net/2019/08/30/LPAsfNjDUQE4mok.jpg)

**3. 安装 Tomcat**

我们开发的 Web 应用需要运行在 Web 服务器上，Web 服务器负责将来自客户端的 Web 请求传递给 Web 组件，Web 组件再对请求生成动态响应内容回复给客户端。常见的 Web 服务器有：Tomcat、Jetty、Resin、JBoss 等，我们选择开源、稳定的 Tomcat 服务器。

在[ Tomcat 官网](http://tomcat.apache.org/)下载适合系统的 Tomcat 压缩文件，版本最好和安装的 JDK 版本一致，我们选择 Tomcat 1.8，下载后同样直接解压就可以使用。

![img11.png](https://i.loli.net/2019/08/30/LanAgINtkdqCVZG.jpg)

解压完毕后，在浏览器中输入 **localhost:8080**，如果出现如下界面则表示 Tomcat 安装成功了。

![img12.png](https://i.loli.net/2019/08/30/EIKtuhOYypoUPSB.jpg)

**4. 在 Eclipse 中配置 Tomcat**

最后还需要在 Eclipse 中配置 Tomcat 服务器，以便于我们在 Eclipse 中直接运行Web项目。

打开「Windows」→「Preferences」，选择「Server」→「Runtime Environment」。添加一个 Tomcat 服务器。如图：

![img13.png](https://i.loli.net/2019/08/30/2bduzLKjsUl3DoP.jpg)

选择之前下载的 Tomcat 版本（如图中 v8.0）

![img14.png](https://i.loli.net/2019/08/30/IbFzis7Z2rpMe48.jpg)

在 Tomcat 下载目录选项中填入之前下载的 Tomcat 解压后路径。并且选择 JRE 环境。

![img15.png](https://i.loli.net/2019/08/30/YVGZcMTAe8wiQl7.jpg)

配置结束后，可以在 Eclipse 最右侧找到 Server 选项卡，点击其中的运行按钮，就可以将 Web 服务器启动起来，到此准备工作就完成了。

![img16.png](https://i.loli.net/2019/08/30/4KDLeQbMhoF6GjX.jpg)

### 第一个 Web 程序

准备工作做完，就可以开始第一个 Web 程序的编写了。在 Eclipse 中新建一个 Dynamic Web Project（动态 Web 项目），建好后文件目录如图：

![img17.png](https://i.loli.net/2019/08/30/TkHmWlM1y62CfE5.jpg)
 
 在 Project 中新建一个 JSP 文件，可以看到它和 HTML 文件整体上非常相似，可以显示一个网页。具体的原理后续会解释，现在我们只需在 < body > 标签下写上内容，然后简单测试下效果即可。（这里用 h1 标签包装了一段话 Hello Web！）
```
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
	<h1>Hello Web!</h1>>
</body>
</html>
```

之后右击这个 JSP 文件，选择「Run on Server」，让它运行在我们配置好的 Tomcat 服务器上。效果如图：

![img18.png](https://i.loli.net/2019/08/30/9NDbyA84ZRlxuWX.jpg)

第一个 Web 应用程序就实现了，想想还是有点激动的。这篇笔记就到这里了，我们下篇笔记再会。

