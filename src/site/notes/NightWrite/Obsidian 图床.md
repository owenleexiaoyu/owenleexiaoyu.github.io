---
{"tags":["随笔","图床","Obsidian"],"date":"2021-01-02","dg-publish":true,"permalink":"/NightWrite/Obsidian 图床/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-06-05T09:53:37.624+08:00","updated":"2025-06-07T12:10:32.330+08:00"}
---

![](https://s2.loli.net/2022/05/23/RbwjYPrGOfqdAs9.png)

经过昨天的  [[NightWrite/Obsidian 初体验\|Obsidian 初体验]]，已经可以上手使用 Obsidian 来写笔记了，不过有个问题其实以前也很困扰我，那就是图床。

最早我使用过七牛云的图床，结果后来不让用了，搬运之前博客里的图片废了好大的劲，还用过微博的图床，也停用了。现在用的是 sm.ms 这个免费图床，目前是还在维护的。

今天就准备折腾一下图床，首先是通过 [Obsidian 图床工具](https://publish.obsidian.md/chinesehelp/01+2021%E6%96%B0%E6%95%99%E7%A8%8B/%E5%9B%BE%E5%BA%8A%E5%B7%A5%E5%85%B7) 这篇博客被安利了一个软件 [PicGo](https://picgo.github.io/PicGo-Doc/)。这是一个图片上传工具，可以方便地把本地的图片上传到配置好的图床，内置就支持多种图床，如：sm.ms、七牛云、阿里云等，还可以下载插件上传到其他的第三方图床，如 Gitee 等。

这里遇到一个坑，安装好 PicGo 之后，点击软件一直没反应，搞得我还卸载重装好几遍，后来在它 Github 的 issue 里看到，需要右键状态栏里的小图标，然后选择「打开详细窗口」，才可以打开主界面。也是真的坑。

然后我又照着 [如何使用Typora配置免费的gitee图床](https://zhuanlan.zhihu.com/p/338554751) 这篇文章，搞了一个 Gitee 的仓库来作为存放图片的图床，选择 Gitee 的原因一个是 sm.ms 这种不知道啥时候会停止服务，还是大公司比较安全，另一个原因就是 Github 是国外的，访问速度堪忧，并且还可能会被墙掉。

中途一些脑残操作略过不表，经过这一番折腾，现在已经可以使用顺利使用图床了。

然后再总结一下使用方式：

1. 截图（这个我用的最多）、或者选取图片
2. 打开 PicGo，点击「剪切板图片」，可以快捷上传；或者使用「Command+Shift+P」快捷键上传
3. PicGo 可以设置上传成功后，自动拷贝 Markdown 格式的图片 URL，直接在 Obsidian 中粘贴即可

---

更新：掌握了更加高效的操作方式。

给 Typora 配置了一下上面文章提到的东西，发现可以直接截图或者复制图片后，在 Typora 中粘贴，这时会弹出一个小弹窗，点一下「上传图片」，就可以直接通过 PicGo 上传到图床了，这可太方便了。于是就试着在 Obsidian 插件广场上找找，看看有没有类似的插件，结果还真让我找到一个：[Image auto upload Plugin](https://github.com/renmu123/obsidian-image-auto-upload-plugin)，通过调用 PicGo 的接口，可以实现和 Typora 一样的效果。

操作方式就很简单了：**截图或复制图片，在 Obsidian 文章中直接粘贴，就会直接上传了，便捷程度 5 颗星。**

