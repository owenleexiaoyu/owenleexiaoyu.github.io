---
title: Android 网络编程系列（六）Volley 网络框架入门
date: 2017-10-25 22:46
tag: ["Android 网络编程"]
categories: 技术
thumbnail: https://i.loli.net/2019/08/29/L6nGkoHU2IheMsp.jpg
---

### 前言

上篇文章中我们对 HttpUrlConnection 的相关用法稍作介绍，可以看到如果不对它进行封装，那么每次使用时就必须写很多重复的代码，并且需要自己创建线程进行网络连接，获取到响应结果后还需要切换回主线程来更新  UI。这样的过程已经足够麻烦，如果在获取网络图片或者进行文件下载的场景时，更是需要借助 AsyncTask 等进行实现，这样繁杂的步骤显然是不利于开发的。

Google 在 2013 年的 IO 大会上针对 Android 中缺少一个功能强大、体验良好的网络加载类这个问题，推出了我们今天介绍的主角——Volley。Volley 框架可以说是将AsyncHttpClient、Universal-Image-Loader 等第三方网络加载框架和图片加载框架的优点集于一身。既将网络加载功能封装的非常简单，又能够实现非常复杂的网络加载任务，比如图片压缩和缓存。Volley 的含义翻译过来是万箭齐发，它非常适合于处理那些数据量不大但通信极为频繁的网络请求任务，但在涉及通信数据量很大的任务中（如文件下载），Volley 的表现就要差很多。下图是 IO 大会上介绍 Volley 时配图：
 
![img1](https://i.loli.net/2019/08/29/L6nGkoHU2IheMsp.jpg)

### 导入 Volley 

Volley 并不在 Android SDK 中，所以如果要使用 Volley 就必须在项目中导入 Volley 这个库。Volley 没有官方的Maven repository 或者 Jcenter repository，所以必须依赖于 Volley 的源代码。

在项目中导入 Volley 主要有这样几种方式：

**1. 下载 volley 的源码并将其作为项目的一个 module。**

在 Android Studio 中我们可以将第三方的代码作为我们项目工程的一个 module。这个做法是最合适的，不仅可以直接在 IDE 中查看 Volley 的源码，还可以在源码基础是上进行修改。

第一步，下载 Volley 源码，使用 Git 可以轻松实现这一步：

```
git clone https://github.com/google/volley.git
```

第二步：在 Android Studio 中选择「File」→「New」→「Import Module」，然后选择下载好的 Volley 文件夹。这样就导入了 Volley 的源码作为我们项目中的一个 module。

第三步：选择「File」→「Project Structure」，将 Volley module 作为我们 app module 的依赖。

![img3](https://i.loli.net/2019/08/29/3qbXsMdgejhLmlW.jpg)

经过上述三步，就可以顺利地在我们自己的代码中使用 Volley 的功能了。

**2.  在依赖列表中添加如下一段依赖：**

```
compile 'com.mcxiaoke.volley:library-aar:1.0.15'
```

这是官方 repository 的一个镜像，最简单直接，但不被官方所支持。

**3. 将打包好的 jar 文件添加到项目 libs 目录下。**

点击[这里](http://download.csdn.net/detail/sinyu890807/7152015)下载 CSDN 上打包好的 jar 文件。
 
### Volley 基础用法

#### 1. StringRequest 的使用

在项目中成功导入 Volley 后，下面我们就来进入正题，学习一下 Volley 的相关用法。Volley 的总体设计思路是基于一个 RequestQueue（请求序列），开发者只需要创建适合应用场景的 Request，并将其添加到 RequestQueue 即可实现网络请求。

结合这个设计思路，我们很快就可以提取出 Volley 通用的使用步骤：

1. 创建 RequestQueue 对象。
2. 创建 Request 对象，通常是 Request 的子类对象。
3. 将 Request 对象添加到 RequestQueue 中。

首先来看看 StringRequest 的使用。它是 Request 的一个子类，顾名思义这个 Request 会返回一段字符串类型的响应数据。

我们按照上述的三个步骤来进行说明。

**创建 RequestQueue 对象**

使用 Volley.newRequestQueue() 方法创建 RequestQueue 对象，传入当前的上下文（Context）。

```
RequestQueue mQueue = Volley.newRequestQueue(this);
```

RequestQueue 可以缓存所有的 Http 请求，并且适合高并发的网络请求，所以不需要为每个 Http 请求都创建一个 RequestQueue 对象，通常在一个 Activity 中创建一个全局的 RequestQueue 对象，甚至如果你的应用程序网络功能很少时，整个应用中只需有一个 RequestQueue 对象即可（对应 Application）。

**创建 StringRequest 对象**

接下来需要我们指定具体请求的内容，所以我们新建一个 StringRequest 对象，如以下代码所示：

```
//获取控件
TextView tvCode = (TextView) findViewById(R.id.string_code);
//请求的 URL 地址
String url = "http://lixiaoyu.cc";
//创建 StringRequest 对象
StringRequest request = new StringRequest(url, new Response.Listener<String>() {
    @Override
    public void onResponse(String response) {
        tvCode.setText(response);
    }
}, new Response.ErrorListener() {
    @Override
    public void onErrorResponse(VolleyError error) {
        error.printStackTrace();
        tvCode.setText("出错了");
    }
});
```

StringRequest 共有两个构造方法，一个有 3 个参数，用于默认以 GET 方式发送网络请求，这 3 个参数分别是：

> **String url**：请求的网址
> **Listener< String> listener**：响应成功的回调函数
> **ErrorListener errorListener**：响应失败的回调函数

例如上面代码中，网址为我的个人博客网站的 URL，响应成功时直接将该页面的 HTML 代码显示在 TextView 中，响应失败则在 TextView 显示一段错误提示。（上述两个回调函数都是直接在主线程中执行，所以不需要我们自己去切换线程，太方便了）

如果需要使用 POST 方法向网页提交数据，就需要使用 4 个参数的构造方法。参数分别为：

> **int method**：网络请求方式，取值可以是 Request.Method.POST，Request.Method.HEAD 等
> **String url**
> **Listener<String> listener**
> **ErrorListener errorListener**

后 3 个参数与上面都是一致的。使用 POST 时，我们需要将数据发送给服务器，Volley 并没有设计在构造方法中加入类似 Params 这种参数，但是 Volley 在处理 POST 请求时，会调用 StringRequest 的父类 Request 的 getParams() 方法，我们可以在这个方法中加入想要提交到服务器的数据。如以下代码所示：

```
//获取控件
TextView tvCode = (TextView) findViewById(R.id.string_code);
//请求的 URL 地址
String url = "http://ip.taobao.com/service/getIpInfo.php";
StringRequest request = new StringRequest(Request.Method.POST, url,
                new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                tvCode.setText(response);
            }
        },
        new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                tvCode.setText("出错了");
            }
        }){
    @Override
    protected Map<String, String> getParams() throws AuthFailureError {
        Map<String, String> map = new HashMap<>();
        map.put("ip","192.168.0.188");
        return map;
    }
};
```

在代码中，首先指定构造方法的第一个参数为 POST，然后其他参数的设置与之前一致。覆盖父类中的 getParams() 方法，通过 Map 构造想要提交的数据，最后返回给 Request。

**将 StringRequest 对象添加到 RequestQueue 中**

最后一步就是将 Request 对象添加到 RequestQueue 中，RequestQueue 就能自动处理这个请求，并将相应结果发送到请求的回调函数中。如以下代码所示：

```
mQueue.add(request);
```

#### 2. JsonRequest 的使用

网络请求的相应结果通常是 XML 格式和 Json 格式，在 Android 开发中很多时候都是 Json 格式。Volley 中定义了 JsonRequest 来方便、快速地实现响应结果为 Json 的网络请求。JsonRequest 是一个抽象类，有两个子类，JsonObjectRequest 和 JsonArrayRequest，返回结果分别是 JsonObject 对象和 JsonArray 对象。

JsonRequest 的使用方式和 StringRequest 有着高度的一致性，我们以 JsonObjectRequest 为例（JsonArrayRequest 用法完全一样）：

```
/**
 * 1.创建全局的 RequestQueue，为了显示方便写在一块了
 */
mQueue = Volley.newRequestQueue(this);
/**
 * 2.创建 JsonObjectRequest 对象，设置 URL，这里使用了 Gank 的 API 接口
 * 和请求一起 POST 到服务器的 JsonObject 对象，这里设置为 null，
 * 响应成功或失败的回调函数
 */
String url = "http://gank.io/api/random/data/Android/2";
JsonObjectRequest request = new JsonObjectRequest(url, null,
                new Response.Listener<JSONObject>() {
    @Override
    public void onResponse(JSONObject response) {
        Log.i("TAG", "onResponse: " + response.toString());
        try {
            boolean isError = response.getBoolean("error");
            if (!isError) {
                JSONArray results = response.getJSONArray("results");
                JSONObject index = results.getJSONObject(0);
                String title = index.getString("desc");
                tvJson.setText(title);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
   }
},new Response.ErrorListener() {
    @Override
    public void onErrorResponse(VolleyError error) {
        tvJson.setText("出错了");
    }
});
/**
 * 3.将 JsonObjectRequest 对象添加到 RequestQueue 中
 */
mQueue.add(request);
```

通过上面的代码可以看到，使用步骤是完全一致的，只是在响应成功时回调函数的泛型从 String 类型变成了 JsonObject 类型，我们在这个回调函数中就可以对获取到的 Json 数据进行处理，提取出想要的信息。

### 使用 Volley 加载网络图片

Volley 的另一个强大功能就体现在能够非常方便地进行网络图片的加载，并且能够对图片进行压缩、缓存等处理，不用担心图片过大时所导致的内存泄漏等问题。

使用 Volley 来加载网络图片主要有三种方式，一是使用  ImageRequest，二是使用 ImageLoader，三是使用 NetworkImageView 这个自定义控件。下面依次来介绍一下。

**使用 ImageRequest**

由于加载网络图片也是非常常见的网络请求之一，所以 Volley 中也封装了专门用于图片加载的 ImageRequest，它同样是 Request 的子类，所以使用方法和上述的 StringRequest、JsonRequest 一模一样。示例代码如下：

```
ImageView imageView = (ImageView) findViewById(R.id.image_img);
RequestQueue queue = Volley.newRequestQueue(this);
String imgUrl = "http://image.wufazhuce.com/FiBzmwDotMhGiJjSuqi1Lg5h_Zjm";
ImageRequest request = new ImageRequest(imgUrl, new Response.Listener<Bitmap>() {
    @Override
    public void onResponse(Bitmap response) {
        imageView.setImageBitmap(response);
    }
}, 0, 0, Bitmap.Config.RGB_565, new Response.ErrorListener() {
    @Override
    public void onErrorResponse(VolleyError error) {
        imageView.setImageResource(R.mipmap.ic_launcher);
    }
});
queue.add(request);
```

如果加载图片成功就设置给 ImageView，如果加载失败就在 ImageView 上显示一张默认的图片。ImageRequest 使用时需要注意其构造方法，它有两个构造方法，一个有 6 个参数，一个有 7 个参数，直接看看最全参数列表：

> **String url**：需要加载的图片地址
> **Response.Listener< Bitmap> listener**：响应成功的回调，比如设置给 ImageView
> **int maxWidth**：图片的最大宽度
> **int maxHeight**：图片的最大高度，如果图片的实际宽高超过设置的最大宽高值，会对图片进行压缩，以指定大小进行显示，最大宽高均设置为 0 表示不进行任何压缩。
> **ScaleType scaleType**：图片的缩放方式，这个参数可以省略，默认是以整体向中心缩放的方式
> **Config decodeConfig**：图片 Bitmap 的编码方式，值为 Bitmap.Config 类中的常量，有 RGB_565， ARGB_8888等值。
> **Response.ErrorListener errorListener**：响应失败的回调，比如给 ImageView 设置一张默认显示的图片

实际运行效果如下：

![img4](https://i.loli.net/2019/08/29/4k2e8OGniMBfPIW.gif)

**使用 ImageLoader**

ImageLoader 内部同样是用 ImageRequest 实现的，并且能够在此基础上实现图片的缓存，还可以过滤掉重复的链接，避免重复发送请求，比 ImageRequest 更加高效。 

ImageLoader 的用法就和前面提到的 Request 子类的用法有所不同。步骤主要有：

**1. 创建一个 RequestQueue 对象。**这步与上述一致，不用多说。

```
RequestQueue mQueue = Volley.newRequestQueue(this);
```
**2. 创建一个 ImageLoader 对象。**传入 RequestQueue 对象和 ImageCache 对象作为参数，这里先创建一个空的 ImageCache 实例。

```
ImageLoader loader = new ImageLoader(queue, new ImageLoader.ImageCache() {
    @Override
    public Bitmap getBitmap(String url) {
        return null;
    }

    @Override
    public void putBitmap(String url, Bitmap bitmap) {

    }
});
```

**3. 获取一个 ImageListener 对象。**使用 ImageLoader 的 getImageListener() 方法可以获取到 ImageListener 对象，在参数中设置需要加载图片的 ImageView，默认图片和加载失败显示的图片。

```
ImageView imageView = (ImageView) findViewById(R.id.image_img);

ImageLoader.ImageListener listener = ImageLoader.getImageListener(imageView, R.mipmap.ic_launcher,R.mipmap.ic_launcher_round);
```

4. 调用 ImageLoader 的 get() 方法加载图片，传入网络图片地址、ImageListener 对象以及最大宽高。

```
loader.get(imgUrl, listener,200,200);
```

实际运行效果如图所示，和 ImageRequest 不同， ImageLoader 会先在 ImageView 上显示设置的默认图片，等图片加载成功后进行替换，若加载失败则显示设置的失败图片。

![img5](https://i.loli.net/2019/08/29/1pMKONT5RUjx2vl.gif)

我们这里虽然实现了与 ImageRequest 相同效果的功能，但是并没有将 ImageLoader 的优势发挥出来，因为我们在创建 ImageLoader 时第二个参数是 ImageCache 的一个空实现。我们应该在这里对图片进行缓存处理。

以下这段代码来自郭神的 Volley 文章，演示了使用 LruCache 来缓存图片，避免重复加载和内存泄漏。

```
public class BitmapCache implements ImageCache {  
  
    private LruCache<String, Bitmap> mCache;  
  
    public BitmapCache() {  
        int maxSize = 10 * 1024 * 1024;  
        mCache = new LruCache<String, Bitmap>(maxSize) {  
            @Override  
            protected int sizeOf(String key, Bitmap bitmap) {  
                return bitmap.getRowBytes() * bitmap.getHeight();  
            }  
        };  
    }  
  
    @Override  
    public Bitmap getBitmap(String url) {  
        return mCache.get(url);  
    }  
  
    @Override  
    public void putBitmap(String url, Bitmap bitmap) {  
        mCache.put(url, bitmap);  
    }  
  
}
ImageLoader imageLoader = new ImageLoader(mQueue, new BitmapCache());    
```

**使用 NetworkImageView**

NetworkImageView 是 Volley 中的一个自定义控件，继承自 ImageView，拥有 ImageView 的全部功能，并且实现了加载网络图片的功能。它的用法也可以大致分为如下几步：

**1. 创建一个 RequestQueue 对象。**
**2. 创建一个 ImageLoader 对象。**

以上两步就不用多说了，和 ImageLoader 中是一样的。

```
RequestQueue mQueue = Volley.newRequestQueue(this);
ImageLoader loader = new ImageLoader(queue, new ImageLoader.ImageCache() {
    @Override
    public Bitmap getBitmap(String url) {
        return null;
    }

    @Override
    public void putBitmap(String url, Bitmap bitmap) {

    }
});
```
**3. 在布局文件中申明 NetworkImageView 控件。**

```
<com.android.volley.toolbox.NetworkImageView
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:layout_margin="20dp"
    android:id="@+id/networkiv"/>
```
**4. 在 Activity 中对控件进行实例化。**同时可以进行一些自定义的设置。

```
ImageView imageView = (NetworkImageView) findViewById(R.id.networkiv);

imageView.setDefaultImageResId(R.mipmap.ic_launcher);
        imageView.setErrorImageResId(R.mipmap.ic_launcher_round);
```

这里我们同样设置了默认显示的图片和加载失败时显示的图片。

**5. 调用NetworkImageView的setImageUrl() 方法加载图片。**将网络图片地址和 ImageLoader 对象传入即可。

```
String imgUrl = "http://image.wufazhuce.com/FiBzmwDotMhGiJjSuqi1Lg5h_Zjm";
imageView.setImageUrl(imgUrl, loader);
```

这里有一个需要注意的地方是，在 ImageRequest 和 ImageLoader 中，我们都可以指定图片的最大宽高，而在 NetworkImageView 中，并没有相应的实现。这是因为 NetworkImageView 是一个控件，在申明控件时就会进行宽高的设置，NetworkImageView 会将加载的图片宽高和控件宽高进行比较，如果超过就会进行压缩，如果控件的宽高都指定为 wrap_content，则不会压缩。

### 结语

这篇文章中比较详细地介绍了 Volley 的来历和基础的用法，包括获取普通的字符串数据和 Json 格式的数据，以及如何使用 Volley 加载网络图片。在有关图片缓存的部分，因为不了解 LruCache 的有关内容，所以引用了部分其他人的代码，以作示例。

谢谢，下篇文章见。

### 参考资料

> 郭霖：初识Volley的基本用法
> http://blog.csdn.net/guolin_blog/article/details/17482095
>  郭霖：使用Volley加载网络图片
> http://blog.csdn.net/guolin_blog/article/details/17482165
> 刘望舒：Volley 用法全解析
> http://liuwangshu.cn/application/network/3-volley.html
> 泡在网上的日子：Android 网络通信框架Volley简介
> http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2014/1018/1800.html
> 泡在网上的日子：网络请求库Volley详解
> http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2015/0526/2934.html





































