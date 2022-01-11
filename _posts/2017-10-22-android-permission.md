title: Android 6.0 动态申请权限
layout: post
date: 2017-10-22 12:10
tag: ["Android"]
categories: 技术
cover: http://image.wufazhuce.com/FqCW8TpOXYXPPWbSvx9185vjf34Y
---
### 前言

在 Android 6.0 之前，我们进行权限申请只需要在 AndroidManifest.xml 文件中使用 < uses-permission > 标签列出需要的权限名称即可。比如：

```
<uses-permission android:name="android.permission.INTERNET"/>
```

这样做对于开发人员来讲是便捷的，但对用户来讲却是存在隐患的。现在的很多应用都存在着胡乱申请权限的现象，也不管这些权限用没用到，如果用户不同意这些不合理的权限就直接不能安装这款应用。通常情况下，普通用户都不会非常关注所安装应用的权限情况，这就让应用有了获取用户手机隐私的可能。

为了弥补这个隐患，在 Android 6.0 就推出了动态权限的概念，即光在 AndroidManifest.xml 文件申明了某项权限还不够，在应用运行过程中，用户的某个操作需要这个权限的支持时，需要提示用户是否允许这个权限。用户可以随意选择允许或者拒绝这个权限的申请。如果用户拒绝了该权限的申请，下次需要这个权限时，还是会提示用户进行选择。这样用户就可以拒绝掉一些不合理的、可能涉及隐私的权限，从而提高了安全性。

这篇文章，我们就来介绍一下动态申请权限的相关知识。

### 普通权限和危险权限

在推出动态权限的概念时，Google 将我们手机上所用到的权限按照对用户的安全性划分程两类，普通权限和危险权限。普通权限是指不涉及用户个人隐私信息的权限，如网络权限、手机震动权限等。危险权限即那些涉及用户隐私信息的权限，如获取手机联系人权限、打电话权限、定位权限等。普通权限只需要在 AndroidManifest.xml 文件中进行申明即可，危险权限则需要动态申请。毕竟如果所有的权限都要动态申请的话，也太麻烦了。

Android 中的危险权限共有 24 个，分为 9 组，其余的都是普通权限。

下图列出了所有的危险权限：

![img1](https://i.loli.net/2019/08/29/DsAb7XYfOte9yzV.jpg)

当用户动态授权了某一个权限组中的一个危险权限，同组的所有危险权限都会自动被授权。免去了重复申请的繁杂。

### 动态申请权限过程

动态申请危险权限的过程如以下流程图所示：

![img2](https://i.loli.net/2019/08/29/K7xFEtO6ywiBYTu.jpg)

下面我们以打电话为例，用代码来看看每步的内容。假设页面上有一个按钮，点击按钮就可以拨打电话，我们可以用隐式 Intent 来实现直接拨打电话的功能，不过需要 CALL_PHONE 这个权限的支持，而这个权限是一个危险权限。

1. 在 AndroidManifest.xml 文件中申明权限。这个步骤还是必须的，因为我们的应用需要适配 6.0 以下版本的机型。

```
<uses-permission android:name="android.permission.CALL_PHONE"/>
```

2. 运行时判断某个权限是否已经被授权。本来我们在按钮的点击事件中只需要调用一个我们自己写的函数 callPhone() 即可，但现在必须加以判断，如果用户之前已经授权过 CALL_PHONE 这个权限，就调用 callPhone()  函数，如果还未被授权，则需去申请这个权限。

```
btnCall = findViewById(R.id.main_call);
btnCall.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View view) {
        if(ContextCompat.checkSelfPermission(MainActivity.this,
                Manifest.permission.CALL_PHONE) != PackageManager.PERMISSION_GRANTED){
            ActivityCompat.requestPermissions(MainActivity.this,
                    new String[] {Manifest.permission.CALL_PHONE},1);
        } else {
            callPhone();
        }
    }
});
```

```
private void callPhone() {
    try{
        Intent intent = new Intent(Intent.ACTION_CALL, Uri.parse("tel:1008611"));
        startActivity(intent);
    } catch (SecurityException e){
        e.printStackTrace();
    }
}
```

3.  弹出提示框让用户选择授权还是拒绝授权，用户选择后会回调 onRequestPermissionsResult() 方法，在这个方法中可以获取用户选择结果。如果用户授权 CALL_PHONE 权限，就再调用 callPhone() 方法，如果用户拒绝了该权限，则打印一些提示告知用户。

```
Override
public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
    switch (requestCode){
        case 1:
            if(grantResults.length > 0 &&
                    grantResults[0] == PackageManager.PERMISSION_GRANTED){
                callPhone();
            }else{
	            Toast.makeText(MainActivity.this, "你拒绝了权限申请", Toast.LENGTH_SHORT).show();
		    }
            break;
    }
}
```

用户同时也可以在设置 → 权限管理中找到某个应用，查看该应用所申请的所有权限，然后自行选择开启或关闭这些权限。关闭后，应用运行时需要某个危险权限的支持，还会重复上述几个步骤，请用户再次授权。

### 结束语

这篇文章中简单介绍了运行时权限的概念和使用过程。 Github 上也有一些封装好的动态权限申请的第三方库，可以帮助我们更加简单地进行权限申请。如果想了解更多的相关知识，可以去看看这些开源库的源码实现。




