---
title: Android 网络编程系列（七）Volley 自定义 Request
tags: ["Android 网络编程"]
categories: 技术
date: 2018-07-02 20:31:00
thumbnail: http://image.wufazhuce.com/Fmm7NQEJJHG0W-3cVhAgTL5LjEpg
---

上篇文章介绍了Volley框架的基本用法，包括StringRequest、JsonRequest、ImageRequest、ImageLoader等用法。这篇文章我们自己实现自定义Request，以适用于多样化的场景。

#### XMLRequest

我们知道网络数据通常有两种格式，一种是Json、一种是XML。因为Volley中已经有了JsonRequest，所以我们现在来自己实现一个XMLRequest。

先看看StringRequest是怎么实现的：
```
public class StringRequest extends Request<String> {

    /** Lock to guard mListener as it is cleared on cancel() and read on delivery. */
    private final Object mLock = new Object();

    // @GuardedBy("mLock")
    private Listener<String> mListener;

    public StringRequest(int method, String url, Listener<String> listener,
            ErrorListener errorListener) {
        super(method, url, errorListener);
        mListener = listener;
    }

    public StringRequest(String url, Listener<String> listener, ErrorListener errorListener) {
        this(Method.GET, url, listener, errorListener);
    }

    @Override
    public void cancel() {
        super.cancel();
        synchronized (mLock) {
            mListener = null;
        }
    }

    @Override
    protected void deliverResponse(String response) {
        Response.Listener<String> listener;
        synchronized (mLock) {
            listener = mListener;
        }
        if (listener != null) {
            listener.onResponse(response);
        }
    }

    @Override
    protected Response<String> parseNetworkResponse(NetworkResponse response) {
        String parsed;
        try {
            parsed = new String(response.data, HttpHeaderParser.parseCharset(response.headers));
        } catch (UnsupportedEncodingException e) {
            parsed = new String(response.data);
        }
        return Response.success(parsed, HttpHeaderParser.parseCacheHeaders(response));
    }
}
```
可以看到，StringRequest里面的代码非常少，大部分工作都在其父类中进行了实现。

自定义一个Request的基本步骤为：
1. 创建一个成功响应的回调Listener
2. 写构造函数
3. 覆盖父类中的抽象方法，解析网络请求结果和回调响应成功的数据。

下面是XMLRequest的代码：

```
public class XMLRequest extends Request<XmlPullParser> {

    //锁
    private Object mLock = new Object();

    //请求成功的回调
    private Response.Listener<XmlPullParser> listener;

    //带有请求方式的构造函数
    public XMLRequest(int method, String url, Response.Listener<XmlPullParser> listener,
                      Response.ErrorListener errorListener) {
        super(method, url, errorListener);
        this.listener = listener;
    }
    //默认请求方式为GET的构造函数
    public XMLRequest(String url, Response.Listener<XmlPullParser> listener,
                      Response.ErrorListener errorListener) {
        this(Method.GET, url,listener, errorListener);
    }

    //解析网络请求结果
    @Override
    protected Response<XmlPullParser> parseNetworkResponse(NetworkResponse response) {
        try {
            String xmlString = new String(response.data,
                    HttpHeaderParser.parseCharset(response.headers));
            XmlPullParserFactory factory = XmlPullParserFactory.newInstance();
            XmlPullParser xmlPullParser = factory.newPullParser();
            xmlPullParser.setInput(new StringReader(xmlString));
            return Response.success(xmlPullParser, HttpHeaderParser.parseCacheHeaders(response));
        } catch (UnsupportedEncodingException e) {
            return Response.error(new ParseError(e));
        } catch (XmlPullParserException e) {
            return Response.error(new ParseError(e));
        }
    }
    //回调成功的请求
    @Override
    protected void deliverResponse(XmlPullParser response) {
        synchronized (mLock){
            listener.onResponse(response);
        }
    }

    //取消请求
    @Override
    public void cancel() {
        super.cancel();
        synchronized (mLock){
            listener = null;
        }
    }
}
```

这里我们使用Pull方法来解析XML数据，这里用到了XmlPullParser这个类。首先定义了一个泛型为XmlPullParser的回调监听器Listener对象，用于回调请求成功的数据（请求失败的回调都是一样的，但是请求成功时返回的数据类型不同，回调也不一样）。在构造函数中为回调赋值，构造函数同样模仿StringRequest中的写法，三个参数的构造函数调用四个参数的构造函数。在继承了Request这个父类后，必须要覆盖它的两个抽象方法，分别是**parseNetworkResponse() **和**deliverResponse()**，下面来介绍一下这两个方法的作用。

**protected Response<T> parseNetworkResponse(NetworkResponse response)**

这个方法是用于解析网络请求的响应结果，根据响应结果，调用不同的响应方法。在XmlRequest中，首先获取到Response中的响应数据，再将其解析成XmlPullParser的格式，然后调用响应成功的方法，如果数据出错（请求不成功，解析出错等情况），就调用响应失败的方法。

**protected void deliverResponse(T response)**

这个方法是用于回调响应成功的数据，可以看到这个函数的参数中已经携带了上个函数解析好的响应数据了（比如StringRequest响应数据就是String类型，XmlRequest是XmlPullParser类型）。这个函数则是将这个数据回调给实例化Request的Activity进行数据的进一步处理，通常是将解析好的数据显示在UI上。

后面的文章中我们会介绍这两个函数背后的原理以及整个Volley的流程。

#### GsonResquest

其实经过上个XMLRequest的实现，我们已经大致了解了自定义Request的要点。下面再贴一下GsonRequest的实现，Gson是Google开源的一个JSON数据解析框架，能够自动地将一段JSON数据映射成一个实体类的对象。当然实际上这个Request并不需要定制，只需要在StringRequest的响应结果中加上Gson即可（因为可能只需要Json数据的其中一部分）。

以下是具体实现：

```
public class GsonRequest<T> extends Request<T> {
    private Response.Listener<T> listener;
    private Gson mGson;
    private Class<T> mClass;

    public GsonRequest(int method, String url, Class<T> clazz, Response.Listener<T> listener,
                       Response.ErrorListener errorListener) {
        super(method, url, errorListener);
        mGson = new Gson();
        this.mClass = clazz;
        this.listener = listener;
    }

    public GsonRequest(String url, Class<T> clazz, Response.Listener<T> listener,
                       Response.ErrorListener errorListener) {
        this(Method.GET, url, clazz, listener, errorListener);
    }


    @Override
    protected Response<T> parseNetworkResponse(NetworkResponse response) {
        try {
            String jsonString = new String(response.data,
                    HttpHeaderParser.parseCharset(response.headers));
            return Response.success(mGson.fromJson(jsonString,mClass),
                    HttpHeaderParser.parseCacheHeaders(response));
        } catch (UnsupportedEncodingException e) {
            return Response.error(new ParseError(e));
        }
    }

    @Override
    protected void deliverResponse(T response) {
        listener.onResponse(response);
    }
}
```

其中需要注意的一个点是，要增加一个类型为Class< T >的成员变量mClass，并在构造函数中赋值。这是因为在parseNetworkResponse()方法的**mGson.fromJson(jsonString,mClass)**这行代码中需要显式指定JSON所要映射的实体类类型。

#### 结语

这篇自定义Request就到这里了，文章大部分内容都来源于郭霖老师下面这篇博客：

[Android Volley完全解析(三)，定制自己的Request](http://blog.csdn.net/guolin_blog/article/details/17612763)
