---
title: ScrollView与ListView滚动冲突事件解决
subtitle: 解决方法转载自他人博客
date: 2017-05-17 23:20
categories: 技术
thumbnail: http://image.wufazhuce.com/FnIWBJ64nrtBgfTRgMFgIZguVvWw
tag: ["Android"]
---
在写项目时，有这样一个需求是Scrollview中嵌套一个ListView，使得ListView不可滚动，只进行item点击事件的处理，但是发现单纯的控件嵌套是无法实现预期效果的，ListView的高度会变得只有一个item的高度大小，为了解决这个问题，在网上找到一篇博客，介绍了解决方法。本人能力有限，只能将该方法复制过来，为之后类似的情况做个备份。

```java
在计算listview总高度并设置
ListView listView = (ListView) findViewById(id);
MyAdapter adapter = new MyAdapter("初始化你的适配器");
listView.setAdapter(adapter);
setListViewHeightBasedOnChildren(listView);(在setAdapter后调用自定义的方法)
//方法如下
private void setListViewHeightBasedOnChildren(ListView listView) {

ListAdapter listAdapter = listView.getAdapter();
if (listAdapter == null) {
return;
}

int totalHeight = 0;
for (int i = 0; i < listAdapter.getCount(); i++) {
View listItem = listAdapter.getView(i, null, listView);
listItem.measure(0, 0);
totalHeight += listItem.getMeasuredHeight();
}

ViewGroup.LayoutParams params = listView.getLayoutParams();
params.height = totalHeight
+ (listView.getDividerHeight() * (listAdapter.getCount() - 1));
listView.setLayoutParams(params);
}
```

**使用该方法需要注意：子ListView的每个Item必须是LinearLayout，不能是其他的，因为其他的Layout(如RelativeLayout)没有重写onMeasure()，所以会在onMeasure()时抛出异常。**

最后附上博客地址：
> http://www.cnblogs.com/misybing/p/5046541.html