---
{"dg-publish":true,"permalink":"/Journal/Weekly-2026-W29/","tags":["随笔","WeeklyNotes"],"noteIcon":"","created":"2026-07-13","updated":"2026-07-20T10:00:28.599+08:00","dg-note-properties":{"date":"2026-07-13","tags":["随笔","WeeklyNotes"]}}
---


# 本周任务

- [ ] Kotlin 协程教程除 Flow 外全部看完，并做笔记
- [ ] Objective-C 内容复习完毕，<font color="#00b050">在工作上修复两个 iOS 问题</font>
- [x] 把 HaiShu Android 里四篇博客的排版优化完毕 
- [ ] 把西安团建、<font color="#00b050">旺山徒步</font>、婚礼文章中的图片补充完整
- [ ] 写出两天云南蜜月旅行的日记
- [ ] <font color="#00b050">digital-garden 更新模板代码</font>，并思考自己的魔改如何兼容未来上游的更新
- [ ] digital-garden 表格显示效果优化
- [ ] WanAndroid 迁移一个新的页面

---

# 周一 2026-07-13

- 学了 Kotlin 协程教程 [[DevBits/扔物线 Kotlin 协程实战笔记（2）结构化并发#9 Coroutine Exception Handle \| S2C9 CoroutineExceptionHandler 的使用]]
- 中午在公司复习了 Objective-C 的类和对象的知识，并修复一个 iOS 上的 UI 问题

# 周二 2026-07-14

- 优化了 HaiShu Android 里四篇博客的排版，将本地图片上传到图床。
- owenleexiaoyu.github.io 项目添加了一个 upstream（https://github.com/oleeskild/digitalgarden），并 rebase 上游的 Git 记录，之前自己对这个网站的一些修改被损坏了，导致现在的效果很诡异。要进一步修复这些问题：
	- 自己明确需要的改动，添加一个标记，列出这个改动的作用，之后同步上游时，需要在解冲突时保留
	- 自己新增的文件不会受到影响，也要列出作用
	- 一部分效果的优化应该要用更加通用的方案进行实现，比如主题优化，就不要去改原来的样式，而是新增自己的样式去覆盖；一些效果上我觉得更好的，尝试给原仓库提 PR，争取合入原来的仓库
- 已将旺山徒步图片补充完整

# 周三 2026-07-15

- 学习了 Kotlin 协程教程 [[DevBits/扔物线 Kotlin 协程实战笔记（2）结构化并发#10 异常结构化管理的本质 \| S2C10 协程异常结构化管理的本质]]
- [open-notebook：NotebookLM 的开源替代](https://www.zdoc.app/zh/lfnovo/open-notebook)
- 半年绩效评估今天开始啦，我感觉这次我的绩效应该还是个 M。

# 周四 2026-07-16

- 用 [[DevBits/用 OC 写一个 iOS 计算器 App\|用 OC 写一个 iOS 计算器 App]]，今天把 UI 画出来了
- [superpowers skill](https://github.com/obra/superpowers)

# 周五 2026-07-17

- 晚上参加了公司的一个燃脂搏击的团课。周五人比较少，10 个人报课，但实际加我只有 3 人到了。拳击动作节奏很快，不过勉强能跟上。练完出了很多汗，强度上我觉得比周四的 HIIT 稍低一些，之后可以多多参加。

# 周六 2026-07-18

今天高磊出发开启了自驾西藏之旅，有点东西。

[[NightWrite/260718 浦东滨江骑行\|260718 浦东滨江骑行]]

# 周日 2026-07-19

- 今天上海杨浦电闪雷鸣加暴雨，一声惊雷，家里的电闸都跳闸了。本来和 Bob 约了下午 4 点打球，但暴雨一直下，我们下楼后，发现小区里积水已经超过了脚踝，走在水里，天上闪着雷鸣，心里非常慌，生怕一到闪电下来把我们烤焦了。打的车快到的时候临时取消了这场球局。外面实在太夸张，电瓶车在路上水直接没过半个轮胎，很多车在水里缓缓行驶，水都要到底盘了。
-  今天继续 [[DevBits/用 OC 写一个 iOS 计算器 App\|用 OC 写一个 iOS 计算器 App]]，今天写的是计算器逻辑部分 ，写完这部分后， 这个计算器 App 差不多写完了。

