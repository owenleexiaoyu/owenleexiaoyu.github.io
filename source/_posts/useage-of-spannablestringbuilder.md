---
title: SpannableStringBuilder 的使用
date: 2019-10-15 12:00
categories: 技术
tags: ["Android"]
thumbnail: http://image.wufazhuce.com/FmD7ikmfvGysRZ-P66hxqdbL3B7B
---

#### 前言

最近在做需求的时候，经常会有一个文本内，需要单独高亮其中一部分，并且支持这部分的单独点击事件。

要实现这样的功能通常有下面几种实现方式：

1. 使用多个 TextView 进行拼接显示
2. 在 TextView 中加载 Html
3. 使用 SpannableString / SpannableStringBuilder

第一个方案的灵活性不足，这里不考虑。

第二个方案则是使用 HTML 标签包裹字符串，然后使用 Html.fromHtml(str) 得到渲染后的字符串，设置给 TextView。这种方法，处理点击事件比较麻烦，如果想弹出本地的弹窗或者跳转到另一个Activity，可能需要通过 JS 注入的方式进行实现。

所以最常使用的方案是第三个，SpannableString 或 SpannableStringBuilder 的功能非常强大，可以让一个 TextView 变得丰富多彩，下面来具体看看。

#### SpannableStringBuilder 和 SpannableString


SpannableStringBuilder 和 SpannableString 都可以用来显示富文本，它们的关系就像 StringBuilder 和 String 的关系一样，SpannableStringBuilder 可以拼接字符串，SpannableString 不可以。它们都实现了 Spannable接口。

![img1](https://i.loli.net/2019/10/15/9IoCVQvbYZhXrRD.png)

**Span**

SpannableStringBuilder 主要通过 `setSpan(Object what, int start, int end, int flags)` 这个方法设置不同的 Span，改本文本样式，setSpan 方法可以`多次调用`。

参数解释：

start：开始位置下标
end：结束位置下标，不包含

what：各种 Span 实例

下面表格中列出部分可用的 Span：

| Span      |     含义 |   备注   |
| :--------: | :--------:| :------: |
| BackgroundColorSpan    |   设置文本背景颜色 |  参数传入一个int类型的颜色值即可  |
| ForegroundColorSpan    |   设置文本颜色 |  参数传入一个int类型的颜色值即可  |
| ClickableSpan    |   设置点击事件 |  需要继承这个类重写onClick方法  |
| StrikethroughSpan    |   设置删除线效果 |  无参  |
| UnderlineSpan    |   设置下划线效果 |  无参  |
| AbsoluteSizeSpan    |   设置文字的绝对大小 |  第一个参数为字体大小，只有这一个参数时，单位为px，第二个参数dip，默认为false，设为true时，第一个参数size的单位是dp  |
| RelativeSizeSpan    |   设置文字的相对大小 |    |
| StyleSpan    |   设置文字粗体、斜体 |  Typeface.BOLD为粗体，Typeface.ITALIC为斜体， Typeface.BOLD_ITALIC为粗斜体，作为参数传入即可 |
| ImageSpan    |   设置图片 |  将[start,end)范围内的文字替换成参数传入的图片  |
| MaskFilterSpan  | 修饰效果，如模糊(BlurMaskFilter)浮雕 |  |
| RasterizerSpan  | 光栅效果 |  |
| SuggestionSpan  | 相当于占位符 |  |
| DynamicDrawableSpan  | 设置图片，基于文本基线或底部对齐 |  |
| ScaleXSpan | 基于x轴缩放 ||
| SubscriptSpan | 下标（数学公式会用到） ||
| SuperscriptSpan | 上标（数学公式会用到） ||
| TextAppearanceSpan | 文本外貌（包括字体、大小、样式和颜色） ||
| TypefaceSpan | 文本字体 ||
| URLSpan | 文本超链接||

flag：取值有以下四个

| flag      |     含义 |
| :-------- | :--------|
| SPAN_EXCLUSIVE_EXCLUSIVE    |  在文本前面或后面插入新的文本时，都不会应用该样式（前面不包括，后面不包括） |
| SPAN_EXCLUSIVE_INCLUSIVE | 在文本前插入新的文本不会应用该样式，而在文本后插入新文本会应用该样式（前面不包括，后面包括） |
| SPAN_INCLUSIVE_EXCLUSIVE | 在文本前插入新的文本会应用该样式，而在文本后插入新文本不会应用该样式（前面包括，后面不包括） |
| SPAN_INCLUSIVE_INCLUSIVE | 在文本前面或后面插入新的文本时，都会应用该样式（前面包括，后面包括） |

EXCLUSIVE：排除的，即不包含 ，INCLUSIVE：包含的。大多使用第一个，前后均不包含。

**示例**

选择了其中几个常用 Span 做了个简单示例，代码如下：

```
class SpannableAcitivity : AppCompatActivity() {

    val textStr = "夜阑卧听风吹雨，铁马冰河入梦来"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_spannable)
        var builder = SpannableStringBuilder().also {
            it.append(textStr)
            it.setSpan(ForegroundColorSpan(Color.BLUE), 0, 1, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
            it.setSpan(BackgroundColorSpan(Color.RED), 1, 3, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
            it.setSpan(object : ClickableSpan() {
                override fun onClick(widget: View) {
                    Toast.makeText(this@SpannableAcitivity, "听风吹雨", Toast.LENGTH_SHORT).show()
                }
            }, 3, 7, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
            it.setSpan(StrikethroughSpan(), 8, 9, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
            it.setSpan(UnderlineSpan(), 9, 10, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
            it.setSpan(AbsoluteSizeSpan(50), 10, 11, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
            it.setSpan(StyleSpan(Typeface.BOLD), 11, 12, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
            it.setSpan(ImageSpan(this@SpannableAcitivity, R.mipmap.ic_launcher),
                12, 13, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
        }
        spannable_tv.text = builder
        spannable_tv.movementMethod = LinkMovementMethod.getInstance()
    }
}
```

效果如图：

![img2](https://i.loli.net/2019/10/15/nWfrHUcSgwVQ6kL.png)

**ClickableSpan 注意**

在使用 ClickableSpan 时，需要注意以下几点：

1. 有默认颜色和下滑线，如果想修改颜色或去掉下划线，需要重写 updateDrawState方法。

```
@Override public void updateDrawState(@NonNull TextPaint ds) {
    super.updateDrawState(ds);
    ds.setColor(getResources().getColor(R.color.color_black));
    ds.setUnderlineText(false);
}
```

2. 设置 ClickableSpan 后，TextView 需要加一行`textView.setMovementMethod(LinkMovementMethod.getInstance());`，否则ClickableSpan部分点击事件不起作用。

3. 设置 ClickableSpan，可能会与 TextView 本身的onClick事件有冲突。

#### 参考资料

[Android-TextView设置多种颜色及部分点击事件](https://blog.csdn.net/qq_33703877/article/details/77461280)

[【Android】强大的SpannableStringBuilder](https://www.jianshu.com/p/f004300c6920)
