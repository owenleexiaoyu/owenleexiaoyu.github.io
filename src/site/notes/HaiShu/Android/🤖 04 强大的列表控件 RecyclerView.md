---
{"dg-publish":true,"permalink":"/HaiShu/Android/🤖 04 强大的列表控件 RecyclerView/","tags":["编程","Android"],"noteIcon":"","created":"2024-08-31","updated":"2026-07-14T08:23:25.327+08:00","dg-note-properties":{"date":"2024-08-31","tags":["编程","Android"]}}
---


| 2017.10.19 | 完成初稿                             |
| ---------- | -------------------------------- |
| 2024.3.22  | 加入海树，调整排版和部分文字                   |
| 2024.4.2   | 重写部分内容                           |
| 2024.8.31  | 使用 Kotlin 重写代码，并更新博客，增加了多布局样式的内容 |

## 前言

移动设备屏幕比较小，能展示的内容不多，如果有大量数据需要展示时，通常需要以列表来展示。

在早期的 Android 开发中，会使用 `ListView` 和 `GridView` 控件来实现大量数据的展示，但目前这个两个控件已被淘汰，最常见的做法是使用 `RecyclerView`。RecyclerView 相比 ListView 和 GridView 性能有很大提升。

## RecyclerView 用法

RecyclerView 只关注 Item 的创建与回收，对于 Item 的布局方式、Item 的点击事件处理、动画效果、Item 分隔等等一律不关注， 这就是为什么 RecyclerView 的流畅度特别好的原因。

### 声明布局控件

首先需要在布局文件中声明 RecyclerView 这个控件。因为该控件是 Google 新推出的一个控件，为了兼容之前的 Android 版本，所以这个控件是放在 `AndroidX` 的兼容库当中，因此需要添加相应的依赖，并且在引用时需要写完整的包名。

```groovy
// build.gradle
implementation 'androidx.recyclerview:recyclerview:1.3.2'
```

```xml
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <androidx.recyclerview.widget.RecyclerView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:id="@+id/recycler_view" />
</FrameLayout>
```

在 Activity 中通过 `findViewById` 来找到 RecyclerView 控件：

```kotlin
val recycleView = findViewById<RecyclerView>(R.id.recycler_view)
```

### 自定义 Item 布局

需要为 Item 建立一个布局文件，我们新建一个 `item_drama.xml`，代码如下：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="160dp"
    android:orientation="horizontal">

    <ImageView
        android:layout_width="120dp"
        android:layout_height="match_parent"
        android:layout_margin="8dp"
        android:id="@+id/cover"
        android:background="@color/colorPrimary"
        android:src="@drawable/ic_launcher_foreground"
        />
    
    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="match_parent"
        android:orientation="vertical"
        android:layout_marginStart="8dp"
        android:gravity="center_vertical">
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:textSize="20sp"
            android:id="@+id/title"
            tools:text="《闪电侠》"
            />
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:textSize="16sp"
            android:id="@+id/desc"
            android:layout_marginTop="10dp"
            tools:text="更新至第 1 集"
            />
    </LinearLayout>
</LinearLayout>
```

效果如图所示：

![Item 布局](https://img.lixiaoyu.life/blog-res/2026/07/c8d655b01d3f87c29f02a8e1cddaebff.png)

### 创建 Adapter 映射数据和 UI

Adapter 是数据适配器，将数据源中的数据字段映射到 Item 布局的元素里。

新建一个 `DramaAdapter` 继承自 `RecyclerView.Adapter`，同时它还需要一个继承自 `RecyclerView.ViewHolder` 的泛型参数。在 DramaAdapter 类中创建一个内部类 `DramaViewHolder`，继承 `RecyclerView.ViewHolder`。`RecyclerView.ViewHolder` 的构造函数中需要一个 View 参数，对应的是一个变量 `itemView` ，用来表示列表中的每一个 Item 的根视图。我们只需要在自己的 ViewHolder 中添加 Item 布局中的需要绑定数据的控件，比如 TextView，ImageView 等等。同时需要重写自定义 ViewHolder 的构造方法，通过 findViewById() 的方法将 ViewHolder 的各个属性与相应的控件绑定在一起，这样可以避免每次访问控件时，都需要进行 findViewById() 的操作。

```kotlin
class DramaAdapter : RecyclerView.Adapter<DramaAdapter.DramaViewHolder>() {

    //... 省略其他代码

    inner class DramaViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val cover: ImageView = itemView.findViewById(R.id.cover)
        val title: TextView = itemView.findViewById(R.id.title)
        val desc: TextView = itemView.findViewById(R.id.desc)
    }
}
```

Adapter 中有三个方法需要复写，`getItemCount()`，`onCreateViewHolder()`，`onBindViewHolder()`。

`getItemCount()` 表示获取 RecyclerView 中 Item 的个数，在 Adapter 中应该有个 List 类型的成员变量，用于表示数据源列表，`getItemCount()` 返回这个 List 的长度即可，例如：

```kotlin
// DramaAdapter.kt

private val dataList: MutableList<Drama> = mutableListOf()

override fun getItemCount(): Int {
    return dataList.size
}
```

Adapter 中最为关键的两个方法就是 `onCreateViewHolder()` 和 `onBindViewHolder()`。

`onCreateViewHolder()` 方法用来创建 ViewHolder 实例，在 onCreateViewHolder() 方法中通过 `LayoutInflater` 将自定义的 Item 布局文件加载进来，转换为 View 对象，再创建一个 ViewHolder 对象用来保存 View，最后返回该 ViewHolder 对象。

```kotlin
override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): DramaViewHolder {
    val view = LayoutInflater.from(parent.context)
        .inflate(R.layout.item_drama, parent, false)
    return DramaViewHolder(view)
}
```

`onBindViewHolder()` 方法用来给 RecyclerView 的每个子项设置数据，根据传入的 position 从数据源列表拿到对应的 Item 数据，并通过 holder 的各个属性设置相应的数据，完成数据到 UI 的映射。

```kotlin
override fun onBindViewHolder(holder: DramaViewHolder, position: Int) {
    val drama = dataList[position]
    if (drama.coverUrl.isNotEmpty()) {
        Glide.with(holder.itemView.context)
            .load(drama.coverUrl)
            .into(holder.cover)
    }
    holder.title.text = drama.title
    holder.desc.text = drama.desc
}
```

### 设置 RecyclerView 的布局方式

我们已经完成了数据与视图的绑定，但是不要忘了我们之前所说的 RecyclerView 只关注于 Item 的创建与回收，而对于布局等等问题并不关注。所以为了解决布局的问题， 需要使用`布局管理器（LayoutManager）`来设置 RecyclerView 的布局样式，LayoutManager 是一个抽象类，Recyclerview 库中内置了几种它的实现类，分别呈现不同的布局效果。

-   **`LinearLayoutManager`**：线性的布局，有 HORIZONTAL 和 VERTICAL 两种，可以实现普通竖向 ListView 的效果与横向 ListView 的效果，如以下两张图：

| ![纵向列表](https://img.lixiaoyu.life/blog-res/2026/07/e7115590c4310e9b2f3e9c5f4d3dc40e.png) | ![横向列表](https://img.lixiaoyu.life/blog-res/2026/07/985e787601eafaf71346d810b74395a8.png) |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |

-   **`GridLayoutManager`**：实现网格的效果

![网格效果](https://img.lixiaoyu.life/blog-res/2026/07/b114ad8e5aa6f82e2af8f92d53059aef.png)

-   **`StaggeredGridLayoutManager`**：实现酷炫的瀑布流的效果

![瀑布流效果](https://img.lixiaoyu.life/blog-res/2026/07/62a79afa590c809a7a1f92f8c155f642.png)

也正是由于布局样式与 Adapter 之间是分开的，所以我们可以修改极小部分的代码就可以在 ListView，GridView 的样式中自由切换，还可以瞬间实现极为炫酷的瀑布流的效果。只需让我们的 RecyclerView 设置不同的 LayoutManager 就好了。我们也可以自定义 LayoutManager 实现其他列表布局效果。

> 注意：不同的 LayoutManager 下，Item 布局也要做适当的调整来实现最佳的展示效果。比如上面的例子中垂直方向线性排列时，封面图片和标题等文本是左右排列的；在水平方向线性排列或者网格、瀑布流排列时，封面图片和标题等文本是上下排列的。

```kotlin
// 垂直方向线性排列
recyclerView.layoutManager = LinearLayoutManager(this)
// 或
recycleView.layoutManager = LinearLayoutManager(this, RecyclerView.VERTICAL, false)

// 水平方向线性排列
recycleView.layoutManager = LinearLayoutManager(this, RecyclerView.HORIZONTAL, false)

// 网格布局
recycleView.layoutManager = GridLayoutManager(this, 3)

// 瀑布流布局
recycleView.layoutManager = StaggeredGridLayoutManager(3, RecyclerView.VERTICAL)
```

### 处理 Item 的点击事件

在 RecyclerView 中没有提供类似 OnItemClickListener 和 OnItemLongClickListener 的接口，需要我们自己在 Adapter 中实现 item 的点击事件处理。虽然这样有一点麻烦，但也是有好处的。过去在 ListView 中，OnItemClickListener 是子项整体的点击事件，如果 Item 中有一个 Button 时，那么如何处理这个 Button 的点击事件是非常麻烦的，而在 RecyclerView 中我们就可以为 Item 中的任何一个控件设置单独的点击事件处理逻辑。

可以在 onCreateViewHolder() 中为 Item 及 Item 中的子 View 设置点击事件，使用 `ViewHolder.getBindingAdapterPosition()` 可以获取这个 ViewHolder 在 Adapter 中的 Position：

```kotlin
override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): DramaViewHolder {
    val view = LayoutInflater.from(parent.context)
        .inflate(R.layout.item_drama_horizontal, parent, false)
    val holder = DramaViewHolder(view)
    holder.itemView.setOnClickListener {
        Toast.makeText(parent.context, "你点击了第${holder.bindingAdapterPosition}项", Toast.LENGTH_SHORT).show()
    }
    holder.cover.setOnClickListener {
        Toast.makeText(parent.context, "你点击了第${holder.bindingAdapterPosition}项的封面", Toast.LENGTH_SHORT).show()
    }
    return holder
}
```

也可以将点击事件放到 ViewHolder 的构造函数中：

```kotlin
inner class DramaViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
    val cover: ImageView = itemView.findViewById(R.id.cover)
    val title: TextView = itemView.findViewById(R.id.title)
    val desc: TextView = itemView.findViewById(R.id.desc)

    init {
        itemView.setOnClickListener {
            Toast.makeText(it.context, "你点击了第${bindingAdapterPosition}项", Toast.LENGTH_SHORT).show()
        }
        cover.setOnClickListener {
            Toast.makeText(it.context, "你点击了第${bindingAdapterPosition}项的封面", Toast.LENGTH_SHORT).show()
        }
    }
}
```

效果如下：

| ![](https://img.lixiaoyu.life/blog-res/2026/07/0f9828f539cbceb628e939c0102842cf.png) | ![](https://img.lixiaoyu.life/blog-res/2026/07/083c93f3b889834ac4c869cb08f124a6.png) |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |

### Item 的增加和删除

在 Adapter 中增加 public 的方法供外界调用，修改 Adapter 中保存的数据源，并调用 `notifyItemInserted()` 或 `notifyItemRemoved()` 方法来刷新 UI。

```kotlin
// DramaAdapter.kt

//添加子项
fun addItem(position: Int, drama: Drama) {
    if (position >= 0 && position < dataList.size) {
        dataList.add(position, drama)
        notifyItemInserted(position)
    }
}
// 删除子项
fun removeItem(position: Int) {
    if (position >= 0 && position < dataList.size) {
        dataList.removeAt(position)
        notifyItemRemoved(position)
    }
}
```

### 添加分隔

关于 Item 的分隔，一个简单的实现的方法是在自定义的 Item 布局中添加整体的 Margin。

### 实现多种布局样式

RecyclerView 可以轻松实现 Item 有多种布局样式。

首先，新建一种新的布局。创建一个 `item_drama_second.xml` 文件，内容如下：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
  xmlns:tools="http://schemas.android.com/tools"
  android:layout_width="match_parent"
  android:layout_height="wrap_content"
  android:orientation="vertical">

  <LinearLayout
    android:layout_width="wrap_content"
    android:layout_height="match_parent"
    android:orientation="horizontal"
    android:layout_marginStart="8dp"
    android:layout_marginTop="8dp">
    <TextView
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:textSize="20sp"
      android:id="@+id/title"
      tools:text="《闪电侠》"
      />
    <TextView
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:textSize="16sp"
      android:id="@+id/desc"
      android:layout_marginStart="10dp"
      tools:text="更新至第 1 集"
      />
  </LinearLayout>
  <LinearLayout
    android:layout_width="match_parent"
    android:layout_height="100dp"
    android:orientation="horizontal">
    <ImageView
      android:layout_width="0dp"
      android:layout_height="match_parent"
      android:layout_weight="1"
      android:layout_margin="8dp"
      android:id="@+id/cover"
      android:background="@color/colorPrimary"
      android:src="@drawable/ic_launcher_foreground"
      />
    <ImageView
      android:layout_width="0dp"
      android:layout_height="match_parent"
      android:layout_weight="1"
      android:layout_margin="8dp"
      android:id="@+id/cover2"
      android:background="@color/colorAccent"
      android:src="@drawable/ic_launcher_foreground"
      />
    <ImageView
      android:layout_width="0dp"
      android:layout_height="match_parent"
      android:layout_weight="1"
      android:layout_margin="8dp"
      android:id="@+id/cover3"
      android:background="@android:color/holo_orange_light"
      android:src="@drawable/ic_launcher_foreground"
      />
  </LinearLayout>
</LinearLayout>
```

新的布局效果如下：

![新布局效果](https://img.lixiaoyu.life/blog-res/2026/07/ee52dbb2d52e88caa5e407e3690592ac.png)

在 Adapter 中，有一个 `getItemViewType()` 的方法，这个方法表示某个 Item 的视图类型，它不是个抽象方法，只有单布局时，不需要重写，当需要支持多布局时，就需要重写这个方法：

```kotlin
// DramaAdapter.kt

override fun getItemViewType(position: Int): Int {
    return if (position == 2 || position == 4) {
        2
    } else {
        1
    }
}
```

这个方法的参数是 Item 在列表中的 Position，可以根据 Position 来确定这个 Item 对应哪种布局，为每种布局指定一个不同的 ViewType。

在 Adapter 的 `onCreateViewHolder()` 方法中，有个参数就是 viewType：

```java
@NonNull
public abstract VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType);
```

可以根据参数中的 viewType 的值，来引入不同的布局文件创建视图。

```kotlin
// DramaAdapter.kt

override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): DramaViewHolder {
    val view = when (viewType) {
        2 -> LayoutInflater.from(parent.context)
            .inflate(R.layout.item_drama_second, parent, false)
        else -> LayoutInflater.from(parent.context)
            .inflate(R.layout.item_drama_vertical, parent, false)
    }
    return DramaViewHolder(view)
}
```

最终效果如下：

![多样式](https://img.lixiaoyu.life/blog-res/2026/07/656f10f9ac87e8cd66e40e1025f8afa1.png)

## 结束语

在上述步骤完成后，一个简单的 RecyclerView 的 Demo 也就完成了，对于添加、删除 Item 的动画效果等，在这里暂不做介绍。