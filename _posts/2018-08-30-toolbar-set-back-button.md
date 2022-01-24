---
layout: post
title: Toolbar设置返回按钮
tags: ["Android"]
categores: 技术
date: 2018-08-30 21:07
cover: https://s2.loli.net/2022/01/24/HZq2AI6knu4NYRd.jpg
---

#### 1. 使用系统自带的返回按钮样式

```
getSupportActionBar().setDisplayHomeAsUpEnabled(true);//左侧添加一个默认的返回图标
getSupportActionBar().setHomeButtonEnabled(true); //设置返回键可用
```


添加之后，如果发现图标的颜色是黑色 ，则需要在 style.xml 中添加如下属性：

```
<!-- 溢出菜单图标颜色，可以自己设置成任意的颜色-->
<item name="colorControlNormal">@android:color/white</item>
```

#### 2. 自定义返回按钮颜色与样式

**第一种方法：**

- 在布局文件中添加属性设置
```
app:navigationIcon="@mipmap/title_bar_back"
```
- 或者代码设置

```
mToolbar.setNavigationIcon();
```

**第二种方法：**

```
ActionBar actionBar = getSupportActionBar();
actionBar.setDisplayHomeAsUpEnabled(true);
actionBar.setHomeAsUpIndicator(R.mipmap.ic_back);
```

