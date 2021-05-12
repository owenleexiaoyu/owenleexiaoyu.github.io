---
title: ViewStub 使用与布局优化技巧
date: 2019-10-15 20:00
categories: 技术
tags: ["Android"]
thumbnail: http://image.wufazhuce.com/FuR1aijLdZMXfDTjVHNHQFKXnXoV
---

#### 前言

最近在需求中使用到了 ViewStub 来动态加载布局，所以总结一下 ViewStub 的使用和常用的布局优化技巧。

#### ViewStub

当界面中有些子布局需要满足某些条件才展示时，通常我们会采用将这个子布局的 visibility 设为 gone 或 invisible，隐藏这个布局；当条件满足时，设为 visible，让其显示。这样操作比较简单，但是性能表现一般。因为即使 View 隐藏了，还是在布局中，仍会被父容器绘制，仍会创建对象和实例化、设置属性。

Android 中提供了一个轻量级的控件——ViewStub，它是一个不可见的，大小为 0 的视图，可以在运行时动态加载布局资源。当 ViewStub 被设为 Visible 或者调用 inflate方法时，填充资源，然后 ViewStub 本身就被该布局资源替换掉，ViewStub 被从 ViewTree 中移除。这个资源布局在加载时会使用 ViewStub 中定义的 layout 属性去覆盖原来的对应属性，比如 width、height、margin 等。可以通过 inflatedId 属性来定义或重写被填充布局的 id。

下面简单写了一个示例，来演示 ViewStub 的使用，代码如下：

Activity 的代码：

```
class StubAcitivity : AppCompatActivity() {

    lateinit var viewStub: ViewStub
    var inflatedView: View? = null
    var stubImageView: ImageView? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_stub)
        viewStub = findViewById(R.id.view_stub)
    }

    fun showViewStub(view: View) {
        try {
            inflatedView = viewStub.inflate()
        } catch (e: Exception) {
            viewStub.visibility = View.VISIBLE
        }

        stubImageView = inflatedView?.findViewById(R.id.stub_img) as ImageView
        stubImageView?.setImageResource(R.mipmap.ic_launcher)
    }

    fun changeViewStub(view: View) {
        stubImageView?.setImageResource(R.drawable.android10)
    }

    fun hideViewStub(view: View) {
        viewStub.visibility = View.INVISIBLE
    }
}
```

Activity 对应的布局文件：

```
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical" 
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal">
        <Button
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="显示ViewStub"
            android:onClick="showViewStub"/>

        <Button
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="更改ViewStub"
            android:onClick="changeViewStub"
            android:layout_marginLeft="20dp"
            android:layout_marginRight="20dp"/>

        <Button
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="隐藏ViewStub"
            android:onClick="hideViewStub"/>
    </LinearLayout>

    <ViewStub
        android:id="@+id/view_stub"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout="@layout/layout_stub"/>
</LinearLayout>
```

ViewStub 引用的 layout 布局文件：

```
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <ImageView
        android:id="@+id/stub_img"
        android:layout_width="300dp"
        android:layout_height="300dp"/>
</LinearLayout>
```

效果如下：

![img1](https://i.loli.net/2019/10/15/GvakQmqE1cC6NIJ.gif)

下面来总结下 ViewStub 的使用方式：

1. 使用 layout 属性引用填充的布局文件，不能在 xml 中通过加子控件的方式添加，它是自闭合的（以`/>`结尾）。

2. 调用方式和普通的 View 一样，在调用 inflate 方法时，返回被填充的 View，可以对 View 中的控件再进行处理，如果不用处理时，可以直接使用 setVisibility 方法。

3. inflate 方法只能被调用一次，再次调用时会抛出异常，因为在第一次 inflate 之后，ViewStub 被从视图树中移除，就获取不到他的父布局，而在 inflate 方法中需要获取父布局，所以会出错。因此通常需要加 try-catch 进行处理，在 catch 中使用 setVisibility 方法来显示填充的布局。setVisibility 方法中使用了弱引用，可以避免异常抛出。

4. 可以在 ViewStub 中重写填充布局的 layout_ 开头的属性，比如 width、height、layout_margin 等，非 layout 的属性不能重写，并且重写 margin 等属性，必须要先重写 width 和 height 这两个属性，不然不会生效。

5. 在 ViewStub 所加载的布局中不可以使用 merge 标签的，因此有可能导致加载出来的布局存在着多余的嵌套结构。

#### 其他的布局优化技巧

**使用 include 标签进行布局文件重用**

include 标签是很常用的一个标签，它使用 layout 属性引用另一个布局文件，将其添加到 include 标签所在的父容器中。开发中可以把一些公共的布局提取成一个单独的文件，然后使用 include 标签引用，来减少重复编写布局的工作。同样可以在 include 标签中对引用布局的根节点属性进行重写。

```
<include
	android:layout_width = "match_parent"
	android:layout_height = "wrap_content"
	android:layout="@layout/title_bar"/>
```

**使用 merge 标签减少布局嵌套**

我们知道 Android 中 View 的布局嵌套的越多，绘制时间就会越长，性能也越差，所以在`编写布局时要尽量减少布局的嵌套层次`。

include 标签也有一个缺点，就是可能产生多余的嵌套层次。比如：

activity.xml

```
<LinearLayout>
	<include layout="@layout/my_layout"/>
</LinearLayout>
```

my_layout.xml

```
<LinearLayout>
	<TextView/>
</LinearLayout>
```

那么最终结果是：

```
<LinearLayout>
	<LinearLayout>
		<TextView/>
	</LinearLayout>
</LinearLayout>
```

其中第二个 LinearLayout 就是产生的多余嵌套了。

这时候可以使用 merge 标签来配合 include 减少嵌套层次。

my_layout.xml

```
<merge>
	<TextView/>
</merge>
```

那么结果是：

```
<LinearLayout>
	<TextView/>
</LinearLayout>
```

其实 merge 就是将其中的子控件直接填充到 include 所在的位置。这样就不会存在多余的嵌套层次了。

使用 merge 标签需要注意以下几点：

1. merge 标签必须是布局文件的根节点
2. merge 不是View，通过LayoutInflater.inflate来加载布局时，第二个参数必须选择一个父容器，第三个参数必须为 true，必须要给 merge 标签下的子View指定一个父节点。
3. 对 merge 标签设置的属性无效

**尽可能让布局扁平，减少布局嵌套**

优先使用 ConstraintLayout（首选）或 RelativeLayout 来编写布局，可以有效地降低布局的嵌套层次。使用 LinearLayout、FrameLayout 会有比较多的布局嵌套。

**避免使用 layout_weight属性**

layout_weight 属性经常被使用在需要几个控件几等分父布局时，是比较实用的一个属性。但是对每个设置了这个属性的布局、控件，系统都会执行两次测量过程，在一些需要重复渲染布局的场合（RecyclerView中）会变得严重。因此要避免使用这个属性，相同效果可以改用 ConstraintLayout 或 RelativeLayout 来实现。

#### 参考资料

[ViewStub--使用介绍](https://www.jianshu.com/p/175096cd89ac)

[Android最佳性能实践(四)——布局优化技巧](https://blog.csdn.net/guolin_blog/article/details/43376527)

[Android 布局优化 Merge的使用](https://www.jianshu.com/p/69e1a3743960)

[Android最佳实践之UI篇](http://sr1.me/best-practice-for-android-ui)