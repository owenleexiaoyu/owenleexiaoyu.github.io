---
{"dg-publish":true,"permalink":"/NightWrite/将 Obsidian 笔记发布成博客/","title":"将 Obsidian 笔记发布成博客","tags":["随笔","知识管理","Obsidian"],"noteIcon":"","created":"2025-05-16T10:22:10.019+08:00","updated":"2025-06-05T09:26:47.645+08:00"}
---

在将 [[NightWrite/Obsidian 作为主力笔记软件\|Obsidian 作为主力笔记软件]] 之后，不可避免开始想两个问题：
- 笔记如何多端同步？
- 如何将笔记发布为在线网站，也就是个人博客？
其实这两个问题对应也是 Obsidian 提供的付费服务：Obsidian Publish 和 Obsidian Sync

这里就来记录下我最近针对将 Obsidian 笔记发布成博客或者说在线数字花园（Digital Garden）所折腾的一些经历。首先官方的 Obsidian Publish 是付费的，这自然不在体验范围内，我开始在网上寻找开源代替方案。

这里先描述下我想达成的效果：
- 本地笔记存放在 Obsidian Vault 中
- 可以发布单个或者某些笔记
- 博客上可以支持 Obsidian 双向连接的跳转，显示反向链接
- 博客的样式最好好看些，或者支持替换

在网上找到了这两篇文章：
[Obsidian 目前最完美的免费发布方案 渐进式教程 by oldwinter](https://publish.obsidian.md/chinesehelp/01+2021%E6%96%B0%E6%95%99%E7%A8%8B/obsidian+%E7%9B%AE%E5%89%8D%E6%9C%80%E5%AE%8C%E7%BE%8E%E7%9A%84%E5%85%8D%E8%B4%B9%E5%8F%91%E5%B8%83%E6%96%B9%E6%A1%88+%E6%B8%90%E8%BF%9B%E5%BC%8F%E6%95%99%E7%A8%8B+by+oldwinter)
[Flowershow：免费的 Obsidian 笔记发布服务，实现你的数字花园网站](https://utgd.net/article/20663/)

我先尝试了一下 Flowershow。
## Flowershow

https://flowershow.app/
Flowershow 可以将 Markdown 文档发布为在线博客网站。

整体流程为：
- 使用 Vercel 在 Github 上创建一个项目，存放网站代码，其中包含一个 content 目录，这个目录里存放要发布的 Markdown 文件，Vercel 作为这个项目的部署平台，每次代码有变更，就可以自动触发网站的编译和发布，并且提供了一个能在线访问的网址。
- 提供了一个 Flowershow 的 Obsidian 插件，配置 Github 用户名，第一步中的项目名和 Github Personal access token（用来访问和操作这个项目），插件可以将 Obsidian 中的一篇笔记上传到 Github 项目的 content 目录下，触发网站构建，这样就能将笔记展示在网站里了

这个流程非常丝滑，我参考文章完成了上面两步配置，在 Obsidian 中将笔记上传到项目中，这时候出问题了，上传到了项目的根目录下，而不是 content 目录。这样网站就找不到对应的文章，也就不能展示。在我手动将文章移动到 content 目录下后，才可以正常展示。

后面查看他们的文档得知，他们现在在做 Flowershow Cloud 的解决方案，代替了 Vercel 部署，最新的教程是在 Flowershow Cloud 上建立项目，插件也更新为只支持 Flowershow Cloud 方案（两者代码推送的目录不同）。Flowershow Cloud 有免费和付费两种模式，个人项目是免费的，商业项目是付费的，付费也能解锁一些高级用法，比如搜索。之前之所以没有按照最新的教程来实践，其实是有点不放心他们，相比而言，Vercel 更加能接受一些。

我尝试卸载最新的 Obsidian Flowershow 插件，然后手动安装老版本插件，但无法上传成功，可能有一些问题存在。后面我借助 Obsidian 的另一个插件 [Enveloppe](https://github.com/Enveloppe/obsidian-enveloppe) ，这个插件就是负责将 Obsidian 的笔记上传到某个 Github 仓库中，它是支持配置上传的目录的。所以，这两者结合，也是挺方便地达到想要的效果。
网站地址：[https://jewel-notes.vercel.app/](https://jewel-notes.vercel.app/)
![](https://img.lixiaoyu.life/blog-res/2025/05/d2c26de2b0676493aea16e2cabf13187.png)

我不会采用该方案作为我的发布方案，因为目前该团队是希望将 Flowershow 打造成一个收费项目，免费版的功能也受限，对于使用 Vercel 的自托管方式也不积极了。
## Digital Garden

https://github.com/oleeskild/obsidian-digital-garden

另一个我觉得做的挺不错的项目是 Digital Garden，它的使用姿势基本上和 Flowershow 是一样的，在 Github 上创建项目，在 Vercel 上部署，通过 Obsidian Digital Garden 插件将笔记上传到项目的特定目录下，就可以进行展示了。
这个项目的 UI 更加接近 Obsidian 本地的 UI，并且还可以支持切换 Obsidian 的主题。功能上也不少，可以展示笔记的文件树、跳转双链、展示反向链接、支持搜索、展示 Graph 等。

最让我感觉心动的是基于它的一个网站：[https://teresawatts.com/](https://teresawatts.com/)，这效果也太赞了。
![](https://img.lixiaoyu.life/blog-res/2025/05/31b48ca76aed77dce45a87a38941bdb9.png)

我准备采用该方案作为目前的发布方案。该方案包含三个角色：
- Github Repo - [digital-garden](https://github.com/owenleexiaoyu/digital-garden): 存放博客网站代码和文章
- [Vercel project](https://vercel.com/owenleexiaoyus-projects/digital-garden)：当 digital-garden 项目有代码提交，会触发流水线，编译并发布网站
- Obsidian Digital Garden Plugin：设置网站的一些元数据（比如网站标题、ICON、主题等），将本地 Obsidian 笔记上传到 Github 项目的特定文件夹中

配置过程如下：
1. Digital Garden 提供了一个 Github 仓库模板（[digital-garden](https://github.com/oleeskild/digitalgarden)），打开该项目，能在 REAME 中看到一个 Vercel 的按钮，点击这个按钮就会自动帮我们创建一个 Github 仓库，可以设为私有仓库，同时会在 Vercel 上建立一个对这个仓库的项目，用于执行 CI 流程。
2. 在 Github 设置 > Developer Settings > Personal access token，给 Digital Garden 的 Obsidian 插件申请一个 Access token，用来从 Digital Garden 插件中向 Github 仓库提交改动，比如把文章推送到仓库中，修改网站的一些配置等。推荐使用新出的 Fine-grained tokens，它可以配置这个 Token 只能访问某个特定的仓库，安全性更好。生成 Token 后，复制 Token，在下一步需要用到。
3. 在 Obsidian 社区插件市场中下载 Digital Garden 插件，打开设置页，必须的配置有三项，Github 用户名、Github 仓库名、Access Token，依次填写好后，设置页中 Github Authentication（required）后面还会显示一个 ✅，表示配置成功，非常贴心。到此这个插件就配置成功了。设置页下面还有其他主题、功能的配置，这里不赘述了。
![](https://img.lixiaoyu.life/blog-res/2025/06/bf5f48215ab9099694bf60fb2861dad5.png)

发布笔记的流程也非常简单，在 Obsidian 中直接写，然后在笔记的 Meta Info 里添加一个 `dg-publish: true` 的信息，然后点击 Commend + P，唤出命令面板，搜索 Digital Garden，能找到一条命令是 Digital Garden: Publish Single Note，点击该命令就可以将笔记发布啦。
![](https://img.lixiaoyu.life/blog-res/2025/06/540426a166c154b4bb2869b72d138e66.png)
我们需要创建一个首页笔记，这样在打开博客网站时，直接看到的就是这篇笔记，设置首页笔记的方式也很简单，给一篇笔记 Meta Info 中加上 `dg-home: true` 和 `dg-publish: true` 的信息即可。首页笔记只能有一个，所以其他笔记就不要加 dg-home 信息了。

此外，我还在我的域名管理平台上，申请了一个二级域名，映射到 Vercel 提供的原始域名上，这样就可以使用自己的域名来打开网站了。这是我的网站地址：[Jewel Notes](https://jewel.lixiaoyu.life/)，效果如下：
![](https://img.lixiaoyu.life/blog-res/2025/05/a3c3afc1dbe241e19ff171c40a61d83c.png)

## 其他开源选择

除了这两个，我还看了一些其他的方案，有些很强大，但是配置稍显复杂，不太容易上手；有些已经不再维护，有些则刚刚开源。真的可以说是百花齐放，百家争鸣。
### Quartz
https://github.com/jackyzha0/quartz
这个看起来功能非常强大，也不仅限于 Obsidian 使用，但感觉配置起来有点复杂，并且是需要使用 CLI 来进行发布。我目前更加希望使用 Obsidian 的插件。

### Perlite
https://github.com/secure-77/Perlite/

### MindStone
https://github.com/TuanManhCao/digital-garden
这个项目挺久没有更新了，看着基础功能都是有的，也是使用本地命令来执行。

### Yasow
https://github.com/khoeos/Yasow
这是在 Reddits 上发现的一款还处于比较早期的工具。看了下 Demo 网站，其实效果还是不错的，不过文档还不完善，没有一个使用文档。




