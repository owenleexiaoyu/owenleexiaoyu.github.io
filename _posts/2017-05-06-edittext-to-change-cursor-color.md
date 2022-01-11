---
layout: post
title: EditText修改光标颜色
date: 2017-05-06 16:40:25
tags: ["Android"]
categories: 技术
cover: http://image.wufazhuce.com/FuIWuuh082Xm5_i0LdwJiD3zZC2Y
subtitle: 实现Android中EditText光标颜色的自定义
---
自定义EditText的光标颜色，需要在EditText的XML代码中加入如下一条属性：
```
android:textCursorDrawable=""
```
其中的参数如果为**@null**，则光标颜色与字体颜色相同，宽度为最窄。
而要实现自己自定义的样式，则需要在drawable文件夹下新建一个样式XML文件editcursor.xml。其中的代码为：
```
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <solid android:color="#00bb9c"/>
    <size android:width="2dp"/>
</shape>
```
将这个drawable样式文件设置要edittext的该属性中，就实现了光标样式的自定义：
```
android:textCursorDrawable="@drawable/editcursor"
```
**注意：该属性中不能直接写颜色，因为没有宽度的话，光标是无法显示的。**
    
最后附上效果图（光标颜色被改为深绿色）

![img1.png](https://i.loli.net/2019/08/29/PFS249lBREqNnXM.jpg)