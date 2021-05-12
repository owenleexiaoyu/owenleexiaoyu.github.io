---
title: 认识更强大的滚动控件—— RecyclerView
tag: ["Android"]
date: 2017-10-19 23:44
categories: 技术
thumbnail: http://image.wufazhuce.com/Fri24Znzymu84n6uJSv3IqjiPosq
subtitle: 对 RecyclerView 的知识进行一个整理。
---
### 前言

既然在 Android 中已经有了 ListView 和 GridView 这样的控件，那么我们为什么还要去使用 RecyclerView 这个控件呢？首先的一点就在于之前的 ListView 和 GridView 的性能并不是非常好。尽管两者都有自己的缓存机制，但还是有可以改进的空间，比如使用 ViewHolder 来避免过多使用 **findViewById** 这样一个非常耗时的操作。而在 RecyclerView 中，直接将 ViewHolder 作为 RecyclerView  的一个子类，强制开发者使用它进行代码的优化。

### RecyclerView 用法

RecyclerView 只关注与 item 的创建与回收，对于 item 的布局方式、item 的点击事件处理、动画效果、item 分隔等等一律不关注，这就是为什么 RecyclerView 的流畅度特别好的原因。

#### 1. 申明布局控件

同 ListView 相似，首先需要在布局文件中申明 RecyclerView 这个控件。因为该控件是 Google 新推出的一个控件，为了兼容之前的 Android 版本，所以这个控件是放在 support.v7 的兼容库当中，因此需要添加相应的依赖，并且在引用时需要写完整的包名。

```
compile 'com.android.support:recyclerview-v7:24.2.1'
```

```
<android.support.v7.widget.RecyclerView
    android:id="@+id/id_recyclerView"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
```

#### 2. 在代码中引用控件，自定义 item 布局
```
//在 Activity 中通过 findViewById 来找到控件
recycleView = (RecyclerView) findViewById(R.id.id_recyclerView);
```
建立自定义的 item 布局和 ListView 中过程完全一致，在此不贴代码了，附上效果图：

![img2.png](https://i.loli.net/2019/08/29/7jGQDq5NSt9RYB4.jpg)

#### 3. 新建 Adapter

根据 demo 的内容，我们新建 DramaAdapter 继承自 RecyclerView.Adapter，泛型为自定义的继承自 RecyclerView.ViewHolder 的内部类 DramaHolder，其父类中已经有了一个元素 itemView 对应列表中的每一个 item，所以我们自己只需要在 holder 中添加 item 布局中的每个控件，比如 TextView，ImageView 等等。同时需要复写自定义 ViewHolder 的构造方法，通过 findViewById 的方法将 holder 的各个属性与相应的控件绑定在一起，这样就可以避免过多的 findViewById 的操作，例如在我的 demo 中：
```
public DramaHolder(View itemView) {
      super(itemView);
    icon = (ImageView) itemView.findViewById(R.id.item_icon);
    name = (TextView) itemView.findViewById(R.id.item_name);
    progress = (TextView) itemView.findViewById(R.id.item_progress);
}
```

Adapter 中有三个方法需要复写，getItemCount ()，onCreateViewHolder ()，onBindViewHolder ()。

在 Adapter 中应有 List 类型成员变量，用于接收 Activity 中的数据源，getItemCount 返回 List 的长度即可，例如：

```
@Override
public int getItemCount() {
    return mDramaList.size();
}
```
Adapter 中最为关键的两个方法就是 onCreateViewHolder 和 onBindViewHolder，这两个方法的作用相当与我们在使用 ListView 自定义 Adapter 继承自 BaseAdapter 时复写的 getView () 方法作用是一致的，但是有所区别的就是 ListView 所接收的都是 View 类型的对象，而 RecyclerView 接收的都是 ViewHolder 对象。

在 onCreateViewHolder() 法中通过 LayoutInflater 将自定义的 item 布局转为 View 对象，再将该对象与一个 Viewholder 对象相关联，并返回该 ViewHolder 对象。

```
@Override
public DramaAdapter.DramaHolder onCreateViewHolder(ViewGroup parent, int viewType) {
    View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.recyclerview_list_item,parent,false);
    DramaHolder holder = new DramaHolder(view);
    return holder;
}
```
onBindViewHolder() 方法是真正将数据源与视图关联起来的函数所在了，根据传入的 position 拿到数据源中的 item 的各项数据，并通过 holder 的各个属性设置相应的数据，完成 Adapter 的功能。

```
@Override
public void onBindViewHolder(final DramaAdapter.DramaHolder holder, int position) {
    Drama drama = mDramaList.get(position);
    holder.icon.setImageResource(drama.getIconId());
    holder.name.setText(drama.getName());
    holder.progress.setText(drama.getProgress());
}
```

#### 4. 设置 RecyclerView 的布局方式

我们现在所完成的工作是将数据与视图进行绑定，但是不要忘了我们之前所说的 RecyclerView 只关注于 item 的创建与回收，而对于布局等等问题并不关注。所以为了解决布局的问题，Android 中使用布局管理器（LayoutManager）来设置 RecyclerView 的布局样式， LayoutManager 是一个抽象类，Android 中内置了几种它的实现类，分别呈现不同的布局效果。
    
> **LinearLayoutManager**
    线性的布局，有 HORIZONTAL 和 VERTICAL 两种，可以实现普通的 ListView 的效果与横向 ListView 的效果，如以下两张图：
    
![img3.png](https://i.loli.net/2019/08/29/FIhwkntsVD5UZqR.jpg)
---

![img4.png](https://i.loli.net/2019/08/29/No3YPUvt5afkruB.jpg)

> **GridLayoutManager**
    实现之前 GridView 的效果

![img5.png](https://i.loli.net/2019/08/29/ijLo5vmdrWbxCnR.jpg)

> **StaggeredGridLayoutManager**
    实现酷炫的瀑布流的效果

![img6.png](https://i.loli.net/2019/08/29/Y1FRaygJXKTLu2z.jpg)

也正是由于布局样式与 Adapter 之间是分开的，所以我们可以修改极小部分的代码就可以在 ListView，GridView 的样式中自由切换，还可以瞬间实现极为炫酷的瀑布流的效果。只需让我们的 RecyclerView 设置不同的 LayoutManager 就好了。

```
recycleView.setLayoutManager(new LinearLayoutManager(this,LinearLayoutManager.VERTICAL,false));

recycleView.setLayoutManager(new LinearLayoutManager(this,LinearLayoutManager.HORIZONTAL,false));

recycleView.setLayoutManager(new GridLayoutManager(this,3));

recycleView.setLayoutManager(new StaggeredGridLayoutManager(3, StaggeredGridLayoutManager.VERTICAL));
```

#### 5. 处理 item 的点击事件

在 RecyclerView 中并没有 ListView 中的 OnItemClickListener 和 OnItemLongClickListener 的接口，所以我们需要自己在 Adapter 中实现 item 的点击事件处理。虽然这样有一点麻烦，但也是有好处的，在 ListView 中，如果一个 item 中有一个 Button 时，那么如何处理这个 Button 的点击事件是非常麻烦的，而在 RecyclerView 中我们就可以为 item 中的任何一个控件设置独有的点击事件处理逻辑。这个点击事件的处理逻辑很显然应该在 onBindViewHolder() 方法中进行实现。

- **直接实现**

```
//在这里我就对 item 中的图片设置了一个点击事件的处理，以及对整个 item 的 Click 处理和 longClick 处理
@Override
public void onBindViewHolder(final DramaAdapter.DramaHolder holder, int position) {
    Drama drama = mDramaList.get(position);
    holder.icon.setImageResource(drama.getIconId());
    holder.name.setText(drama.getName());
    holder.progress.setText(drama.getProgress());
    holder.icon.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            Toast.makeText(v.getContext(),"你点击了第"+holder.getLayoutPosition()+"项的图片",Toast.LENGTH_SHORT).show();
        }
    });
    holder.itemView.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            Toast.makeText(v.getContext(),"你点击了第"+holder.getLayoutPosition()+"项",Toast.LENGTH_SHORT).show();
        }
    });
    holder.itemView.setOnLongClickListener(new View.OnLongClickListener() {
        @Override
        public boolean onLongClick(View v) {
            removeItem(holder.getLayoutPosition());
            return true;
        }
    });
}
```

- **使用接口实现**

通过接口将点击事件的处理转移到 Activity 中而不是在 Adapter 中显然是一种更好的方式。

首先定义一个接口：

```
public interface OnItemClickListener{
	void onItemClick(View v, int position);
	void onItemLongClick(View v, int position);
}
```

给我们自定义的 Adapter 增加 OnItemClickListener 类型的成员变量，并添加 setter 方法：

```
class DramaAdapter extends RecyclerView.Adapter<DramaViewHolder> {
	OnItemClickListener mListener;
	public void setOnItemClickListener(OnItemClickListener listener){
		this.mListener = listener;
	}
}
```

在 onBindViewHolder() 方法中，在 holder 的 itemView 等控件的点击或长点击事件中，调用接口成员变量 mListener 的 onItemClick() 或 onItemLongClick() 方法。

```
@Override
public void onBindViewHolder(final DramaAdapter.DramaHolder holder, int position) {
    ···
    holder.itemView.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            if(mListener != null){
	            mListener.onItemClick(v, position);
            }
        }
    });
    holder.itemView.setOnLongClickListener(new View.OnLongClickListener() {
        @Override
        public boolean onLongClick(View v) {
            if(mListener != null){
	            mListener.onItemLongClick(v, position);
	            return true;
            }
            return false;
        }
    });
}
```

#### 6. item 的增加和删除

在 Adapter 中实现两个权限为 public 的方法供在 Activity 中调用：

```
//添加子项
public void addItem(int position){
    Drama newOne = new Drama(R.mipmap.ic_launcher,"新的剧集","新的进度");
    mDramaList.add(position,newOne);
    notifyItemInserted(position);
}
public void removeItem(int position){
    if (position < mDramaList.size()){
        mDramaList.remove(position);
        notifyItemRemoved(position);
    }
}
```

> 在这里需要重点说明的是最后的
     **notifyItemInserted(position);**
    **notifyItemRemoved(position);**
    在执行添加 item 必须通过 notifyItemInserted(position) 来刷新视图
    在执行删除 item 必须通过 notifyItemRemoved(position) 来刷新视图
    而不是之前在 ListView 中使用 notifyDataSetChanged() 的方法。

### 结束语

在上述六个步骤完成后，一个简单的 RecyclerView 的 demo 也就完成了，而对于 item 之间的分隔以及添加、删除 item 的动画效果等，在这里暂不做介绍，在我进一步学习之后会有新的手记来记录这方面的知识。关于 item 的分隔，一个简单的实现的方法是在自定义的 item 布局中添加整体的 margin；而对于动画效果，有默认的样式，个人觉得效果还是不错的，不做深入研究的话是已经可以满足需求了。