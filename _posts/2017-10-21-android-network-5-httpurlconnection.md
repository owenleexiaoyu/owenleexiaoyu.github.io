---
layout: post
title: Android 网络编程系列（五）使用 HttpUrlConnection
tag: ["Android 网络编程"]
date: 2017-10-21 19:22
categories: 技术
cover: http://image.wufazhuce.com/FqcoLETqyqG2MdZ7gtryKosMGUve
subtitle: 学习一下 Android 原生的网络访问方式。
---
### 前言

在我们的应用中支持网络功能是绝对有必要的，大部分的应用程序都需要从服务器获取网络数据然后显示在界面中。前两篇文章我们介绍了 WebView 的一些用法和知识点。但是并非所有的网络功能都能通过 Webview 来实现，比如我们从服务器获取一段 json 数据，其中包含了我们想要的信息，这时候，我们就不能使用Webview 了，而是需要直接获取到一个 Http 请求的响应数据。我们可以使用 HttpUrlConnection 或者其他的第三方网络框架来实现网络访问。

在 Android 6.0 之前，原生的有两种方式可以进行网络请求，HttpClient 和 HttpUrlConnection，HttpClient 的 API 多而复杂，拓展困难，因此这种方式在 Android 6.0 之后就被官方移除了。HttpUrlConnection 的 API 简单，体积较小，非常适合 Android 开发，也是官方推荐的网络请求方式。我们这篇文章就来看看 HttpUrlConnection 的相关知识。

### HttpUrlConnection 用法

使用 HttpUrlConnection 来进行网络请求大致上可以分为4个步骤：

1. 获取到 HttpUrlConnection 对象
2. 进行全局的网络设置并建立 Http 连接
3. 进行数据处理
4. 关闭连接

我们依次来看看这些步骤中需要做哪些工作：

#### 获取到 HttpUrlConnection 对象

使用 URL 对象的 openConnection（）方法获取到 HttpUrlConnection 对象，这个对象是我们进行网络请求的核心。

网络请求在响应时间上具有很大的不确定性，如果将网络请求放在主线程中执行时，过长的耗时操作会阻塞主线程，导致程序卡死。因此，网络请求都应该放在子线程中执行。

如以下示例代码：

```
URL url = new URL("http://lixiaoyu.cc");
HttpURLConnection conn = (HttpURLConnection) url.openConnection();
```

#### 进行全局的网络设置并建立 Http 连接

获取到 HttpUrlConnection 对象后，就可以调用这个对象的一些方法，进行一些网络设置，比如设置连接超时时间，读取超时时间，网络请求方式等。如以下代码所示：

```
//设置网络请求方式，如GET、POST、HEAD等
conn.setRequestMethod("GET");

//设置连接超时时间
conn.setConnectTimeout(8000);

//设置读取超时时间
conn.setReadTimeout(8000);

//设置Http请求头部
conn.setRequestProperty("Accept-Encoding", "identity");

//设置可以读取输入流
conn.setDoInput(true);

//设置可以读取输出流，在使用POST向服务器提交数据时必须要将该方法设置为true
conn.setDoOutput(true);

//进行Http连接，必须写在setDoInput（）方法后面
conn.connect();
```

#### 进行数据处理

进行数据处理包括两个方面，一个是从服务器读取相应数据，一个是向服务器发送数据（POST 方法会用到），分别对应之前的 setDoInput() 和 setDoOutput() 方法。

**从服务器读取数据**

先来看看从服务器读取数据，通过调用 HttpUrlConnection 对象的一些方法可以获取到服务器发送给客户端的相应信息，如状态码、响应内容长度、包含了响应内容的输入流等等。如以下示例代码：

```
//获取响应状态码，如 200 表示成功等
int responseCode = conn.getResponseCode();

//获取包含响应内容的输入流
InputStream in = conn.getInputStream();

//获取响应内容长度
int contentLength = conn.getContentLength();
```

在获取输入流之后，就可以利用 Java 中的 IO 流的知识对该输入流进行流处理，从而得到我们想要的数据。（这部分代码在完整示例代码中给出）

**向服务器提交数据**

我们常常使用 POST 方法向服务器提交一个表单，在向服务器提交数据时，需要先通过 HttpUrlConnection 对象的 getOutputStream() 方法获取到输出流对象，在通过输出流对象的 write() 方法向服务器写数据。POST 方法的每条数据都以键值对的形式提交，数据之间用 “&” 进行分隔。如以下示例代码：

```
//将网络请求方法改为 POST
conn.setRequestMethod("POST");
//设置支持输出流
conn.setDoOutput(true);
//获取 HttpUrlConnection 的输出流对象
OutputStream out = conn.getOutputStream();
//给这个输出流添加一个处理流，方便操作
DataOutputStream dos = new DataOutputStream(out);
//使用 writeBytes() 方法将数据提交到服务器
dos.writeBytes("username=admin&password=123456");
//进行 Http 连接
conn.connect();
```

#### 关闭连接

在我们完成了所有数据写入和读取的流操作后，应该调用 disconnect() 方法关闭 Http 连接。

```
//关闭 Http 连接
conn.disconnect();
```

### 实例一：获取网站源码

在 layout 文件中放置一个 Button 和一个 TextView，我们希望点击 Button 后，获取到某个网站的 HTML 源码，并以文本的形式展示在 TextView 中。这个实例较为简单，就直接将代码贴出，关键部分会有注释。

layout 文件中，Button 指定了一个名为 getCode 的 onClick（）方法，可以直接在 Activity 中实现这个方法，进行 Button 的点击事件监听。
```
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">
    <Button
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:onClick="getCode"
        android:text="获取网页源代码"/>
    <TextView
        android:id="@+id/main_content"
        android:layout_width="match_parent"
        android:layout_height="match_parent"/>
</LinearLayout>
```

在 Activity 中：

```
//处理 Button 的点击事件
public void getCode(View view) {
    new Thread(new Runnable() {
        @Override
        public void run() {
            try {
		        URL url = new URL("http://lixiaoyu.cc");
                //获取 HttpURLConnection 对象
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();

                //设置请求方法为 GET
                conn.setRequestMethod("GET");
                //设置连接超时时间为 8 秒
                conn.setConnectTimeout(8000);
                //设置读取超时时间为 8 秒
                conn.setReadTimeout(8000);
                //支持输入流
                conn.setDoInput(true);

                //获取响应状态码
                int responseCode = conn.getResponseCode();
                Log.i(TAG, "responseCode=" + responseCode);
                //获取输入流
                InputStream in = conn.getInputStream();
                //将输入流封装成 BufferedReader
                BufferedReader reader = new BufferedReader(new InputStreamReader(in));
                StringBuffer sb = new StringBuffer();
                String line;
                while ((line = reader.readLine()) != null) {
                    sb.append(line);
                }
                //将 StringBuffer 的数据转化成 String，在主线程中设置到 TextView 上
                showCode(sb.toString());
	        } catch (MalformedURLException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }).start();
}

private void showCode(final String s) {
    //必须在主线程中操作 UI
    runOnUiThread(new Runnable() {
        @Override
        public void run() {
            tvCode.setText(s);
        }
    });
}
```

程序运行的结果如图所示：

![img1.png](https://i.loli.net/2019/08/29/tirIV6f8jSL1Y7v.jpg)

### 实例二：下载文件

在上篇 WebView 的文章中讲到在 Webview 下载文件可以有两种方式，一时通过隐式 Intent 调用系统浏览器进行下载，一种是拿到文件的 URL 后自己创建线程进行下载，上篇文章中只介绍了第一种方法，这里就介绍第二种方法的实现。其实原理非常简单，就是在获取到文件 URL 后，使用 HttpUrlConnection 进行网络请求，通过其对象的输入流读取到该文件的二进制数据，将二进制数据保存为相应格式的文件即可。

完整代码如下：

```
public class WebActivity extends AppCompatActivity {
    private WebView mWebView;
    private String mUrl = null;
    private static final String TAG = "WebActivity";
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_haha);
        mWebView = (WebView) findViewById(R.id.webview);
        mWebView.getSettings().setJavaScriptEnabled(true);
        //加载豌豆荚应用市场的网页
        mWebView.loadUrl("http://wandoujia.com");
        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });
        //设置下载监听器
        mWebView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String s1, String s2, String s3, long l) {
                //如果URL以“.apk”结尾，就进行下载
                if (url.endsWith(".apk")) {
                    mUrl = url;
                    //程序运行在Android 6.0以上的系统中，所以在读写SD卡时需要动态申请权限
                    if(ContextCompat.checkSelfPermission(WebActivity.this,
                            Manifest.permission.WRITE_EXTERNAL_STORAGE)
                            != PackageManager.PERMISSION_GRANTED){
                        ActivityCompat.requestPermissions(WebActivity.this,
                                new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1);
                    }else{
                        //如果已经申请该权限，则直接下载
                        downloadApk(mUrl);
                    }
                }
            }
        });
    }

    /**
     * 下载Apk文件的方法
     * @param url
     */
    private void downloadApk(final String url) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                //获取SD卡的目录
                File sdCard = Environment.getExternalStorageDirectory();
                //通过URL拿到apk文件名
                String apkName = url.substring(url.lastIndexOf("/"));
                //在SD卡的根目录下新建一个文件
                File apkFile = new File(sdCard, apkName);
                try {
                    if (!apkFile.exists()){
                        apkFile.createNewFile();
                    }else{
                        apkFile.delete();
                        apkFile.createNewFile();
                    }
                    FileOutputStream fos = new FileOutputStream(apkFile);
                    HttpURLConnection conn = (HttpURLConnection) (new URL(url)).openConnection();
                    conn.setRequestMethod("GET");
                    conn.setDoInput(true);
                    conn.setConnectTimeout(80000);
                    conn.setReadTimeout(80000);
                    conn.connect();
                    InputStream in = conn.getInputStream();
                    //新建一个byte数组buffer，将输入流中读到的数据写入buffer中
                    byte [] buffer = new byte[1024 * 1024];
                    //每次读到的数据长度
                    int len;
                    while ((len = in.read(buffer)) != -1) {
                        //将每次读取到的数据写入SD卡中的文件里
                        fos.write(buffer,0,len);
                    }
                    Log.i("TAG", "download success");
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

    /**
     * 权限申请的回调函数
     * @param requestCode
     * @param permissions
     * @param grantResults
     */
    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        switch (requestCode){
            case 1:
                if (grantResults.length > 0 &&
                        grantResults[0] == PackageManager.PERMISSION_GRANTED){
                    //用户已同意该权限的申请
                    if (mUrl != null){
                        downloadApk(mUrl);
                    }
                }else{
                    //用户拒绝了权限的申请
                    Toast.makeText(this, "你拒绝了权限申请", Toast.LENGTH_SHORT).show();
                }
                break;
        }
    }
}
```

### 将 HttpUrlConnection 封装成工具类

每次有网络请求时，如果都使用上面的方式来实现，效率显然是极低的，因为每次我们都要把所有的代码都再写一遍。更好的想法就是将网络请求封装成一个工具类，每次要用的时候直接调用这个工具类的相关方法。我对 HttpUrlConnection 进行了一个简单的封装。

在 HttpUtils 这个工具类中，提供了四个 public 的静态方法：
> String httpGet(String url)
> String httpGet(String url, HttpCallback callback)
> String httpPost(String url, List< PostParam > paramList)
> String httpGet(String url, List< PostParam > paramList, HttpCallback callback)

前两个是 GET 方法，后两个是 POST 方法。具体的区别请看代码以及注释。

HttpUtils 类：

```
public class HttpUtils {

    /**
     * GET 方法，返回字符串类型的响应内容,返回值为空表示失败，不为空表示成功了
     * @param url 网址
     * @return
     */
    @Nullable
    public static String httpGet(String url){
        HttpResponse response = baseGet(url);
        if(response.getCode() == 200){
            //成功
            Log.i(TAG, "httpGet: 成功");
            return response.getContent();
        }else{
            //失败
            Log.i(TAG, "httpGet: 失败---" + response.getCode());
            return null;
        }
    }

    /**
     * GET方法，使用一个回调接口，成功则回调onSuccess方法，失败则回调onError方法
     * @param url 网址
     * @param callback 回调接口
     * @return
     */
    @Nullable
    public static String httpGet(String url, HttpCallback callback){
        HttpResponse response = baseGet(url);
        if(response.getCode() == 200){
            //成功
            Log.i(TAG, "httpGet: 成功");
            callback.onSuccess(response.getContent());
        }else{
            //失败
            Log.i(TAG, "httpGet: 失败---" + response.getCode());
            callback.onError(response.getCode(), new Exception());
        }
        return null;
    }

    /**
     * 基础的GET实现，不对外公布此方法，仅仅是被上面两个方法调用
     * 返回的HttpResponse类，包含状态码和响应内容。
     * @param url 网址
     * @return
     */
    private static HttpResponse baseGet(String url){
        HttpURLConnection conn = getHttpUrlConnection(url);
        HttpResponse response = new HttpResponse();
        BufferedReader reader;
        try {
            //设置请求方式
            conn.setRequestMethod("GET");
            //建立连接
            conn.connect();
            //获取状态码
            response.setCode(conn.getResponseCode());
            reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuffer sb = new StringBuffer();
            String line;
            while ((line = reader.readLine()) != null){
                sb.append(line);
            }
            //获取响应内容
            response.setContent(sb.toString());
            //关闭流
            reader.close();
            //关闭连接
            conn.disconnect();
        } catch (ProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }

    /**
     * POST 方法，返回字符串类型的响应内容,返回值为空表示失败，不为空表示成功了
     * @param url  网址
     * @param paramList Post提交的参数列表，键值对形式
     * @return
     */
    @Nullable
    public static String httpPost(String url, List<PostParam> paramList){
        HttpResponse response = basePost(url, paramList);
        if(response.getCode() == 200){
            //成功
            Log.i(TAG, "httpPost: 成功");
            return response.getContent();
        }else{
            //失败
            Log.i(TAG, "httpPost: 失败---" + response.getCode());
            return null;
        }
    }

    /**
     * POST方法，使用一个回调接口，成功则回调onSuccess方法，失败则回调onError方法
     * @param url 网址
     * @param paramList post提交的参数列表
     * @param callback 回调接口
     * @return 返回值无意义
     */
    @Nullable
    public static String httpPost(String url, List<PostParam> paramList, HttpCallback callback){
        HttpResponse response = basePost(url, paramList);
        if(response.getCode() == 200){
            //成功
            Log.i(TAG, "httpPost: 成功");
            callback.onSuccess(response.getContent());
        }else{
            //失败
            Log.i(TAG, "httpPost: 失败---" + response.getCode());
            callback.onError(response.getCode(), new Exception());
        }
        return null;
    }

    /**
     * 基础的POST实现，不对外公布此方法，只被上面两个POST方法调用
     * @param url 网址
     * @param paramList 提交的参数列表
     * @return
     */
    private static HttpResponse basePost(String url, List<PostParam> paramList){
        HttpURLConnection conn = getHttpUrlConnection(url);
        HttpResponse response = new HttpResponse();
        String post = parseParamList(paramList);
        BufferedReader reader;
        try {
            //设置请求方式
            conn.setRequestMethod("POST");
            //获取输出流并转化为处理流
            DataOutputStream dos = new DataOutputStream(conn.getOutputStream());
            //写入参数
            dos.writeUTF(post);
            //建立连接
            conn.connect();
            //获取状态码
            response.setCode(conn.getResponseCode());
            reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuffer sb = new StringBuffer();
            String line;
            while ((line = reader.readLine()) != null){
                sb.append(line);
            }
            //获取响应内容
            response.setContent(sb.toString());
            //关闭流
            reader.close();
            //关闭连接
            conn.disconnect();
        } catch (ProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }

    /**
     * 将参数列表转化成一段字符串
     * @param paramList
     * @return
     */
    @NonNull
    private static String parseParamList(@NonNull List<PostParam> paramList){
        StringBuffer sb = new StringBuffer();
        for (PostParam param :
                paramList) {
            if(sb == null){
                sb.append(param.toString());
            }else{
                sb.append("&"+param.toString());
            }
        }
        return sb.toString();
    }

    /**
     * 获取HttpUrlConnection对象，并进行基础网络设置
     * @param url
     * @return
     */
    private static HttpURLConnection getHttpUrlConnection(String url){
        HttpURLConnection conn = null;
        try {
            //获取HttpURLConnection对象
            URL mUrl = new URL(url);
            conn = (HttpURLConnection) mUrl.openConnection();
            //进行一些通用设置
            conn.setConnectTimeout(80000);
            conn.setReadTimeout(80000);
            conn.setRequestProperty("Conection","Keep-Alive");
            conn.setDoInput(true);
            conn.setDoOutput(true);
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return conn;
    }

    /**
     * 回调接口，有两个方法，分别在成功和失败时回调
     */
    public interface HttpCallback{
        void onSuccess(String response);
        void onError(int responseCode, Exception e);
    }

    /**
     * Post提交的参数类
     * 包含String类型的name和String类型的value
     */
    public class PostParam{
        private String name;
        private String value;
        public PostParam(String name, String value){
            this.name = name;
            this.value = value;
        }

        public String getName() {
            return name;
        }

        public String getValue() {
            return value;
        }

        @Override
        public String toString() {
            return name+"="+value;
        }
    }
}
```

HttpResponse 类

```
/**
 * 包含网络请求的响应状态码和响应内容
 */
public class HttpResponse {
    private int code;
    private String content;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
```

有了这个工具类，我们实现实例一的功能，就可以这样来写：

```
public void getCode(View view) {
    new Thread(new Runnable() {
        @Override
        public void run() {
            String url = "http://www.cnmooc.org";
            String response = HttpUtils.httpGet(url);
            if(response != null){
                showCode(response);
            }
        }
    }).start();
}
private void showCode(final String s) {
    //必须在主线程中操作UI
    runOnUiThread(new Runnable() {
        @Override
        public void run() {
            Log.i(TAG, "run: code--->"+s);
            tvCode.setText(s);
        }
    });
}
```

或者使用带回调接口的GET方法：

```
public void getCode(View view) {
    new Thread(new Runnable() {
        @Override
        public void run() {
            String url = "http://www.cnmooc.org";
	        HttpUtils.httpGet(url, new HttpUtils.HttpCallback() {
                @Override
                public void onSuccess(String response) {
                    showCode(response);
                }

                @Override
                public void onError(int responseCode, Exception e) {
                    e.printStackTrace();
                }
            });
	    }
    }).start();
}
private void showCode(final String s) {
    //必须在主线程中操作UI
    runOnUiThread(new Runnable() {
        @Override
        public void run() {
            Log.i(TAG, "run: code--->"+s);
            tvCode.setText(s);
        }
    });
}
```

### 结束语

这篇文章中对 HttpUrlConnection 的用法、使用示例以及如何封装一个简单的 Http 工具类做了一个介绍，对于了解 HttpUrlConnection 的相关内容还是有所帮助的。接下来是学习一些第三方网络框架的使用和原理，下篇文章应该是关于 Volley 的一些使用介绍，敬请期待。

再见。

### 参考资料

这篇文章的参考资料主要有：

> 郭霖《第一行代码（第二版）》

> 郭霖：Android 访问网络，使用 HttpURLConnection 还是 HttpClient？
> http://blog.csdn.net/guolin_blog/article/details/12452307

> 刘望舒：Android 网络编程（二）HttpClient 与 HttpURLConnection
> http://liuwangshu.cn/application/network/2-httpclienthttp-urlconnection.html

感恩。




