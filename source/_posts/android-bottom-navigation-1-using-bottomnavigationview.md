---
title: BottomNavigationView 用法：实现底部导航栏
tags: ["Android"]
categores: 技术
date: 2018-08-30 22:07
thumbnail: http://image.wufazhuce.com/FgfqsDTUlunbenRoMgQAjw0UDDx8
---

#### 前言

BottomNavigationView 是 Android 官方提供的底部导航控件，这篇文章来学习一下它的用法。

按照 MD 设计的规范，底部导航栏的 item 最好在 3-5 个之间。

如果 BottomNavigationView 中的 item 数量超出5个，会出现异常：

> Caused by: java.lang.IllegalArgumentException: Maximum number of items supported by BottomNavigationView is 5. Limit can be checked with BottomNavigationView#getMaxItemCount()

所以 item 的个数一定不能超过 **5** 个。

#### 准备

BottomNavigationView 是放在 design 包中的控件，使用前需要导入**com.android.support:design**这个包。

#### 主要属性

**android:background**

> 整个 BottomNavigationView 的背景色，设置背景色之后，切换选项时依旧会有水波纹效果（设置背景色也是为了将底部导航和上方的内容进行分割区分）

**app:itemBackground**

> item 的背景色。设置之后在切换选项时将无法看到水波纹效果

**app:itemIconTint**

> item 图标的颜色。可以是单一颜色，也可以是颜色 selector。建议设置 selector，当未选中时指定一种颜色，选中时再指定另一种颜色。该selector 定义在 res/color 目录下。（未设置该属性时，默认未选中状态为深灰色，选中状态时的颜色为当前主题的 colorPrimary 颜色）

**itemTextColor**

> item 文本的颜色。效果和上面 itemIconTin t一致）

**app:menu**

> 所引用的 menu 菜单。

#### 主要方法

**setOnNavigationItemSelectedListener（）**

> 设置 item 被选中时的监听器

**getMenu( )**

> 获取所引用的 menu 菜单对象

#### 使用步骤

**1. 布局文件**

在布局文件中添加 BottomNavigationView 控件，设置相关属性。

```
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:id="@+id/second_textview"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:gravity="center"
        android:textSize="14sp"
        app:layout_constraintBottom_toTopOf="@+id/second_bottom_navbar"
        app:layout_constraintTop_toTopOf="parent" />
    <android.support.design.widget.BottomNavigationView
        android:elevation="5dp"
        android:translationZ="5dp"
        android:layout_width="match_parent"
        android:layout_height="?attr/actionBarSize"
        android:id="@+id/second_bottom_navbar"
        app:menu="@menu/bottom_nav"
        app:itemIconTint="@color/icon_color_selector"
        app:itemTextColor="@color/icon_color_selector"
        app:layout_constraintBottom_toBottomOf="parent"
        android:background="@color/colorAccent">
    </android.support.design.widget.BottomNavigationView>
</android.support.constraint.ConstraintLayout>
```

**2. 引用的 menu 文件**

在 res/menu 目录下新建文件，添加 menu 菜单。

```
<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:id="@+id/bottom_home"
        android:icon="@mipmap/ic_home_gray"
        android:title="首页"/>
    <item android:id="@+id/bottom_system"
        android:icon="@mipmap/ic_system_gray"
        android:title="体系"/>
    <item android:id="@+id/bottom_nav"
        android:icon="@mipmap/ic_nav_gray"
        android:title="导航"/>
    <item android:id="@+id/bottom_project"
        android:icon="@mipmap/ic_project_gray"
        android:title="项目"/>
</menu>
```

**3. color 的 selector 文件**

在 res/color 目录下新建文件，使用 selector 标签实现多种颜色。

```
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:color="@android:color/white" android:state_selected="true"/>
    <item android:color="@color/light_gray" android:state_selected="false"/>
</selector>
```

**4. Java 代码**

在 Activity 中实例化 BottomNavigationView 控件，添加 item 选中监听器等方法。

```
public class SecondActivity extends AppCompatActivity{
    BottomNavigationView bottomNavigationView;
    TextView textView;
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_second);

        bottomNavigationView = findViewById(R.id.second_bottom_navbar);
        textView = findViewById(R.id.second_textview);
        textView.setText(bottomNavigationView.getMenu().getItem(0).getTitle());
        bottomNavigationView.setOnNavigationItemSelectedListener(
                new BottomNavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem menuItem) {
                textView.setText(menuItem.getTitle());
                return true;
            }
        });
    }
}
```

#### 补充

1. 在 setOnNavigationItemSelectedListener() 方法中，一定要将回调方法 **onNavigationItemSelected()** 的返回值设为 **true**，不然 item 不能正常切换。

2. 总的 item 不能超过5个，当 item 数量在3个以内时，每个 item 都会显示图标的文字，如果item的数量是4个或5个时，只有选中的item才会显示图标的文字，没选中的item只显示图标。

3. 可拓展性不强，不能实现在item右上角加上小红点这样的场景。

#### 效果

![img1](https://i.loli.net/2019/08/29/z6gDh9Ara71VCTq.gif)



