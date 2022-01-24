---
layout: post
title: 「转」 Activity 里 fragment 切换到其他 fragment 页面
tags: ["Android"]
categories: 技术
date: 2018-11-09 18:23
cover: https://s2.loli.net/2022/01/24/VrfuNn2A71KqH9y.jpg
---

作者：简单专注 
来源：CSDN 
原文：https://blog.csdn.net/qibanxuehua/article/details/60765968

---

#### 一、概述：

我主要写的是一个 fragment 页面上的按钮点击切换到下一个 fragment 的页面，覆盖掉前一个 fragment 页面，不是主 activity 的按钮去控制切换不同的 fragment。

说明：所用到的类 FragmentManager 和 FragmentTransaction 都是 v4 包下的，便于兼容。这里的切换是点击在 fragment 的页面上的按钮去切换，而 fragment 最好有主 Activity 来控制，所以便想到了在主Activity 里面设置点击切换的方法，根据 FragmentTransaction 去添加 fragment 设置它们的 tag 值，其方法就是 add() ，点击的时候根据不同的 tag 来切换。

#### 二、主 Activity 的代码

```
public class MainActivity extends FragmentActivity {

    FragmentManager fm;
    FragmentTransaction ft;
    Fragment mCurrentFragment;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        fm = getSupportFragmentManager();
        ft = fm.beginTransaction();
        Fragment1 fragment1 = new Fragment1();
        Fragment2 fragment2 = new Fragment2();
        Fragment3 fragment3 = new Fragment3();
        /**
         * 在这里进行添加页面，设置fragment的TAG值
         */
        ft.add(R.id.fl_main, fragment1, "fragment1").add(R.id.fl_main, fragment2, "fragment2").hide(fragment2)
                .add(R.id.fl_main, fragment3, "fragment3").hide(fragment3).commit();


    }

    /**
     * 主activity进行控制不同的fragment
     *
     * @param fromTag
     * @param toTag
     */
    public void switchFragment(String fromTag, String toTag) {
        Fragment from = fm.findFragmentByTag(fromTag);
        Fragment to = fm.findFragmentByTag(toTag);
        if (mCurrentFragment != to) {
            mCurrentFragment = to;
            FragmentTransaction transaction = fm.beginTransaction();
            if (!to.isAdded()) {//判断是否被添加到了Activity里面去了
                transaction.hide(from).add(R.id.fl_main, to).commit();
            } else {
                transaction.hide(from).show(to).commit();
            }
        }
    }
}
```

#### 三、 三个不同的 fragment 页面和基类 BaseFragment

1. 基类

```
public abstract class BaseFragment extends Fragment {
    //上下文
    public MainActivity mActivity;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        mActivity = (MainActivity) getActivity();
        View view = initView();
        return view;
    }

    /**
     * 主界面的抽象方法初始化view
     *
     * @return
     */
    public abstract View initView();

}
```

2. 三个 fragment 的页面相同，只展示一个，其他类似。

```
public class Fragment1 extends BaseFragment {
    private Button btn;
    private View view;

    @Override
    public View initView() {
        if (view == null) {
            view = View.inflate(mActivity, R.layout.fragment1, null);
            btn = (Button) view.findViewById(R.id.btn_1);
            btn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    mActivity.switchFragment("fragment1", "fragment2");
                }
            });
        }
        return view;
    }
}
```

3. 主界面布局文件 activity_main.xml 文件

```
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:gravity="center"
    android:orientation="vertical">

    <Button
        android:id="@+id/btn_1"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="页面1" />

</LinearLayout>
```

4. fragment 的布局，其他类似

```
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:gravity="center"
    android:orientation="vertical">

    <Button
        android:id="@+id/btn_1"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="页面1" />

</LinearLayout>
```

