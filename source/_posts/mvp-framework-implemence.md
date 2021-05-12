---
title: 实现一个 MVP 框架
tags: ["Android"]
categories: 技术
date: 2019-05-10 21:00
thumbnail: http://image.wufazhuce.com/FmIMiZkb91qepjnqAKyekOe_ZXOi
---

#### 前言

在 WanAndroid 这个项目中用到了目前 Android 开发中比较流行的 MVP + Retrofit + RxJava 这样的组合进行开发，今天这篇文章就来复盘一下项目中 MVP 这部分的实践。因为之前看了很多关于 MVP 的博客，各有各的实现方式。我结合了Google MVP 示例 和一些其他的博客，在项目中实现了自己的 MVP 框架，目前在项目里用得还是比较稳定的，因此把这个框架的实现方式记录下来，方便以后的开发。

#### MVC 和 MVP 的对比

既然要用 MVP，不得不提的一点就是它和 MVC 架构模式之间的对比，以及各自的优缺点。MVC 模式指的是比较传统的 Model - View - Controller 这样的架构，Model 表示数据层，用于数据的获取和加工；View 表示界面层，用相应控件来展示数据；Controller 表示控制层，是数据层和界面层之间的桥梁，Controller 控制数据和界面之间的对应关系，以及处理相关的事件逻辑。在 Android 开发中，Activity 或 Fragment 通常承担的是 Controller 的角色，但是它同时也承担了 View 的角色，我们在 Activity（或 Fragment） 中来初始化控件，为控件加载数据，处理控件的点击等事件，并将逻辑代码都写在Activity（或 Fragment）中，这样就导致 Activity（或 Fragment）异常臃肿，耦合严重。所以在这样的情况下出现了 MVP 模式，MVP 模式（Model - View - Presenter）是 MVC 模式的一个变种，它将Activity 中的业务逻辑全部分离出来，让 Activity 只做 UI 逻辑的处理，所有跟 Android API 无关的业务逻辑由 Presenter 层来完成。

在MVP模式下，Activity 或 Fragment 作为 View 层，只负责处理 UI，没有实际的逻辑代码。Model 层还是用于数据的获取及加工。Presenter 层用于连接Model层和View层的业务处理层，既能调用 UI 逻辑，又能请求数据，该层为纯 Java 类，不涉及任何Android API。三层之间的调用顺序为View → Presenter → Model。

MVP 模式的缺点是会增加代码量，需要额外写很多的类和接口。

![image](https://i.loli.net/2019/05/11/5cd6b6395d16d.png)

#### 框架实现

##### 基类实现

首先需要实现 Model、View、Presenter 各自的基类，用于提供最底层的抽象方法。

**BaseModel**

```
public interface BaseModel {
}
```

**BaseView**

```
public interface BaseView{
    /**
     * 展示加载进度
     */
    void showLoading();


    /**
     * 隐藏加载进度
     */
    void hideLoading();
}
```

这里提供了两个方法，可以用来在页面加载时显示进度条和隐藏进度条。

```
public abstract class BasePresenter<V extends BaseView> {

    protected Reference<V> mViewRef;//View 接口类型的弱引用
    
    public void attachView(V view){
        mViewRef = new WeakReference<>(view);
    }

    protected V getView(){
        return mViewRef.get();
    }

    public boolean isViewAttached(){
        return mViewRef != null && mViewRef.get() != null;
    }

    public void detachView(){
        if(mViewRef != null){
            mViewRef.clear();
            mViewRef = null;
        }
    }

    public abstract  void start();
}
```

BasePresenter 中有一个 BaseView 子类的对象作为成员变量，attachView() 方法用来关联具体的 View 实现类，也就是 Activity 或者 Fragment，这里对它进行一个弱引用的封装，避免内存泄漏的问题。

**BaseActivity**

Fragment 相关的基类设计和 Activity 是类似的，这里就以 Activity 为例。BaseActivity 是在开发过程中必须的一个基类，这个类中封装了一些最为基础的功能，为每一个子类 Activity 提供服务。这里简单贴一下项目中写的 BaseActivity 的实现：

```
/**
 * 基类Activity，处理一些公共逻辑
 */
public abstract class BaseActivity extends AppCompatActivity {

    private Unbinder unbinder;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(attachLayout());
        unbinder = ButterKnife.bind(this);
        initData();
        initView();
    }

    /**
     * 解绑ButterKnife
     */
    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (unbinder != null && unbinder != Unbinder.EMPTY) {
            unbinder.unbind();
            unbinder = null;
        }
    }

    /**
     * 初始化数据
     */
    protected abstract void initData();

    /**
     * 初始化View控件
     */
    protected abstract void initView();

    /**
     * 加载布局文件
     *
     * @return
     */
    protected abstract int attachLayout();

    /**
     * 处理返回按钮事件
     *
     * @param item
     * @return
     */
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                finish();
                break;
        }
        return true;
    }

    /**
     * 判断用户是否登录
     *
     * @return
     */
    protected boolean isLogined() {
        return new DataManager().getLoginState();
    }
}
```

这里介绍一下类中的一些方法，在 BaseActivity 中用到了 ButterKnife 框架，在 onCreate() 方法中进行了 ButterKnife 的绑定，在 onDestroy() 方法中进行解绑，这样在具体的 Activity 中就无需重复的绑定和解绑，可以直接使用 @BindView 等注解。

另外在 BaseActivity 中定义了3个抽象方法：
 
- initData()：进行数据的初始化
- initView()：进行控件的初始化
- attachLayout()：绑定布局文件

这三个抽象方法主要是用来规范 Activity 的初始化工作，让代码更加公整。

至于对返回按钮的处理和判断用户是否登录这些功能，要看具体的项目来定，这里不细说。

**MVPBaseActivity**

为了应用 MVP 模式，添加了一个 MVPBaseActivity，这个类和 BaseActivity 作用类似，在其基础上加入了 View 和 Presenter 的互相关联。我的考虑是，在项目中，有些界面逻辑非常简单，没有必要使用 MVP 模式（减少代码量），用 MVC 模式即可，这时候就可以让 Activity 继承 BaseActivity。对于业务逻辑复杂的界面，就可以继承 MVPBaseActivity，使用 MVP 模式来进行业务解耦。

```
public abstract class MVPBaseActivity<P extends BasePresenter>
        extends BaseActivity implements BaseView{

    protected P mPresenter;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        mPresenter = createPresenter();
        mPresenter.attachView(this);
        super.onCreate(savedInstanceState);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mPresenter.detachView();
    }

    protected abstract P createPresenter();
}
```

MVPBaseActivity 继承自 BaseActivity，在它的基础上添加了对 MVP 的支持，主要实现是添加了一个 BasePresenter 子类的泛型对象作为成员变量，然后在 onCreate() 方法中进行 Presenter 和 View 的绑定，在 onDestroy() 方法中解除绑定。

##### 具体业务实现

实现了所有的基类后，就可以针对具体业务来应用 MVP 模式了，设想这样一个简单的首页逻辑，在 App 首页可以用一个列表展示所有文章，可以点击列表中的按钮来收藏文章和取消收藏文章，点击列表项还可以打开文章的详情页。我们需要实现的类有以下几个：

**HomeContract**

```
public interface HomeContract {
    interface Model extends BaseModel{
        Observable<Optional<ArticlePage>> getArticleList(int page);
        Observable<Optional<String>> collectArticle(int articleId);
        Observable<Optional<String>> unCollectArticle(int articleId);
    }

    interface View extends BaseView{

        /**
         * 显示文章列表
         * @param articles
         */
        void showArticleList(List<ArticlePage.Article> articles);

        /**
         * 显示收藏文章
         * @param position
         * @param success
         */
        void showCollectArticle(boolean success, int position);

        /**
         * 显示取消收藏
         * @param position
         * @param success
         */
        void showCancelCollectArticle(boolean success, int position);

        /**
         * 显示打开文章详情
         * @param article
         */
        void showOpenArticleDetail(ArticlePage.Article article);
	}

    abstract class Presenter extends BasePresenter<View>{

        /**
         * 获取文章列表
         */
        public abstract void getArticleList();

        /**
         * 打开文章详情页
         * @param article
         */
        public abstract void openArticleDetail(ArticlePage.Article article);


        /**
         * 收藏文章
         * @param position
         * @param article
         */
        public abstract void collectArticle(int position, ArticlePage.Article article);

        /**
         * 取消收藏文章
         * @param position
         * @param article
         */
        public abstract void cancelCollectArticle(int position, ArticlePage.Article article);

    }
}
```

HomeContract 是个契约接口，它是 Google 给的 MVP 示例中的写法，将 MVP 中三个部分的抽象定义都约束在一个接口中。这样写的好处我觉得主要是让代码结构更加清晰，并且可以减少不必要的类文件（三个类文件放到一个中）。在契约接口中有三个子接口（Presenter 是抽象类），在子接口中分别定义了各自的方法定义，然后创建具体的实现类来实现这些接口。这样一个 MVP 框架就写好了。下面看看实际如何利用框架来实现业务功能：

**HomeModel**

HomeModel 是 HomeContract.Model 的实现类，用来发送请求获取数据。

```
public class HomeModel implements HomeContract.Model{

    private WanAndroidService mService;

    public HomeModel(){
        mService = RetrofitHelper.getInstance().getWanAndroidService();
    }

    @Override
    public Observable<Optional<ArticlePage>> getArticleList(int page) {
        return BaseModelFactory.compose(mService.getArticleList(page, null));
    }

    @Override
    public Observable<Optional<String>> collectArticle(int articleId) {
        return BaseModelFactory.compose(mService.collectArticle(articleId));
    }

    @Override
    public Observable<Optional<String>> unCollectArticle(int articleId) {
        return BaseModelFactory.compose(mService.unCollectArticleFromArticleList(articleId));
    }
}
```

在项目中用到了 Retrofit 来封装网络请求，并使用 RxJava 实现异步，后续文章会具体介绍这方面的实现。

**HomePresenter**

HomePresenter 继承自 HomeContract.Presenter，是负责逻辑的具体实现类。

```
public class HomePresenter extends HomeContract.Presenter {

    private HomeModel homeModel;

    private int mCurrentPage = 0;

    public HomePresenter(){
        this.homeModel = new HomeModel();
    }


    @Override
    public void getArticleList() {
        mCurrentPage = 0;
        getTopArticles();
        homeModel.getArticleList(mCurrentPage).subscribe(new Consumer<Optional<ArticlePage>>() {
            @Override
            public void accept(Optional<ArticlePage> articlePage) throws Exception {
                getView().showArticleList(articlePage.getIncludeNull().getArticleList());
            }
        });

    }

    @Override
    public void loadMoreArticle() {
        mCurrentPage++;
        homeModel.getArticleList(mCurrentPage).subscribe(new Consumer<Optional<ArticlePage>>() {
            @Override
            public void accept(Optional<ArticlePage> articlePage) throws Exception {
                getView().showLoadMore(articlePage.getIncludeNull().getArticleList(), true);
            }
        }, new Consumer<Throwable>() {
            @Override
            public void accept(Throwable throwable) throws Exception {
                ToastUtil.showToast("获取文章列表数据失败");
            }
        });
    }

    @Override
    public void openArticleDetail(ArticlePage.Article article) {
        getView().showOpenArticleDetail(article);
    }

    @Override
    public void collectArticle(final int position, ArticlePage.Article article) {
        homeModel.collectArticle(article.getId()).subscribe(new Consumer<Optional<String>>() {
            @Override
            public void accept(Optional<String> s) throws Exception {
                getView().showCollectArticle(true, position);
            }
        }, new Consumer<Throwable>() {
            @Override
            public void accept(Throwable throwable) throws Exception {
                getView().showCollectArticle(false, position);
            }
        });
    }

    @Override
    public void cancelCollectArticle(final int position, ArticlePage.Article article) {
        homeModel.unCollectArticle(article.getId()).subscribe(new Consumer<Optional<String>>() {
            @Override
            public void accept(Optional<String> s) throws Exception {
                getView().showCancelCollectArticle(true, position);
            }
        }, new Consumer<Throwable>() {
            @Override
            public void accept(Throwable throwable) throws Exception {
                getView().showCancelCollectArticle(false, position);
            }
        });
    }

    @Override
    public void start() {
        mCurrentPage = 0;
        getArticleList();
    }
}
```

HomePresenter 中有一个 HomeModel 的成员变量，用于调用 Model 层的方法。

**HomeFragment**

```
public class HomeFragment extends MVPBaseFragment<HomeContract.Presenter> implements HomeContract.View{

    @BindView(R.id.fhome_smart_refresh)
    SmartRefreshLayout mSmartRefreshLayout;
    com.youth.banner.Banner mBanner;
    @BindView(R.id.fhome_recyclerview)
    RecyclerView mRecyclerView;

    private ArticleAdapter mAdapter;
    public static HomeFragment newInstance(){
        return new HomeFragment();
    }

    @Override
    public void onResume() {
        super.onResume();
        mPresenter.start();
    }


    @Override
    protected void initData() {

    }

    @Override
    protected void initView(View view) {

        //初始化Adapter
        mAdapter = new ArticleAdapter(R.layout.item_recyclerview_article,
                new ArrayList<ArticlePage.Article>(0));
        mAdapter.setOnItemClickListener(new BaseQuickAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(BaseQuickAdapter adapter, View view, int position) {
                ArticlePage.Article article = mAdapter.getData().get(position);
                mPresenter.openArticleDetail(article);
            }
        });
        mAdapter.setOnItemChildClickListener(new BaseQuickAdapter.OnItemChildClickListener() {
            @Override
            public void onItemChildClick(BaseQuickAdapter adapter, View view, int position) {
                    //如果文章已经被收藏了，就取消收藏，如果没有收藏，就收藏
                if(mAdapter.getItem(position).isCollect()){
                    mPresenter.cancelCollectArticle(position, mAdapter.getItem(position));
                }else{
                    mPresenter.collectArticle(position, mAdapter.getItem(position));
                }
            }
        });

        //设置RecyclerView的Adapter和布局管理器
        mRecyclerView.setAdapter(mAdapter);
        mRecyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));

        //设置SmartRefreshLayout的Header
        mSmartRefreshLayout.setRefreshHeader(new MaterialHeader(getActivity()));
        //设置下拉刷新的监听器
        mSmartRefreshLayout.setOnRefreshListener(new OnRefreshListener() {
            @Override
            public void onRefresh(RefreshLayout refreshLayout) {
                mPresenter.getArticleList();
            }
        });

    @Override
    protected int attachLayout() {
        return R.layout.fragment_home;
    }

    @Override
    public void showArticleList(List<ArticlePage.Article> articles) {
        mAdapter.addData(articles);
        mSmartRefreshLayout.finishRefresh();
    }


    @Override
    public void showCollectArticle(boolean success, int position) {
        if(success){
            ToastUtil.showToast("收藏文章成功");
            mAdapter.getData().get(position).setCollect(true);
            mAdapter.notifyDataSetChanged();
        }else{
            ToastUtil.showToast("收藏文章失败");
        }
    }

    @Override
    public void showCancelCollectArticle(boolean success, int position) {
        if(success){
            ToastUtil.showToast("取消收藏文章成功");
            mAdapter.getData().get(position).setCollect(false);
            mAdapter.notifyDataSetChanged();
        }else{
            ToastUtil.showToast("取消收藏文章失败");
        }
    }

    @Override
    public void showOpenArticleDetail(ArticlePage.Article article) {
        //携带Title和URL跳转到ArticleDetailActivity
        ArticleDetailActivity.actionStart(getActivity(),
                article.getTitle(), article.getLink());
    }

    @Override
    public void showLoading() {

    }

    @Override
    public void hideLoading() {

    }

    @Override
    protected HomeContract.Presenter createPresenter() {
        return new HomePresenter();
    }
}
```

在 HomeFragment 中，需要在 createPresenter() 方法中返回一个对应的 HomePresenter 对象，用于和 HomeFragment 绑定。

#### 结语

关于项目中 MVP 框架的内容就是这些，MVP 和 Retrofit、 RxJava 组合的剩余部分内容之后文章中再来介绍。



