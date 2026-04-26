---
{"dg-publish":true,"permalink":"/NightWrite/一些配置和插件让 Obsidian 更好用/","title":"一些配置和插件让 Obsidian 更好用","tags":["随笔","Obsidian"],"noteIcon":"","created":"2025-06-03","updated":"2025-06-10T09:45:26.977+08:00"}
---

之前提到，我目前已经将 [[NightWrite/Obsidian 作为主力笔记软件\|Obsidian 作为主力笔记软件]]，这是因为在使用一些插件后，Obsidian 带给我的使用体验非常好。这里就来稍微写下我对 Obsidian 的一些配置，以及正在使用的几个非常好用的插件。

# 一些配置

目前我只针对字体进行了一定配置，其他都保持默认。字体选择的是 [霞鹜文楷](https://github.com/lxgw/LxgwWenKai)，这是一款非常好看的开源中文字体。
下载 LXGWWenKaiMono-Regular.ttf 文件并安装到系统中，然后在 Obsidian 的设置 > 外观 > 字体中，设置「界面字体」和「正文字体」。
![](https://img.lixiaoyu.life/blog-res/2025/06/72979d3bd1c002fa9bf481aaed164022.png)
# 好用的插件

接下来介绍下我正在使用的一些非常好用的插件。
## Daily notes

Obsidian 官方的核心插件中有一个 Daily notes 插件，可以快速创建一个当前日期的日记笔记，我一般称为 Journal。
常规的使用是通过最左侧工具栏中的点击 Daily notes Icon 或者通过「Commend + P」快捷键唤出命令面板，输入 Daily notes，可以看到一条命令：Daily notes: Open today's daily note，点击该命令，就会打开今天的日记笔记，如果没有则会直接创建。

![](https://img.lixiaoyu.life/blog-res/2025/06/fec5a7dfaf5c7b5ba65bf0d45a0e6f93.png)

![](https://img.lixiaoyu.life/blog-res/2025/06/276e5fe633809a37d4e0edfd57ab0f57.png)

Daily notes 插件提供了几个简单的设置，都挺实用的：
- 笔记标题的格式：默认是 YYYY-MM-DD，比如 2025-06-04，可以进行一定调整，比如我设置成 `[Journal]-YYYY-MM-DD`，最终的笔记的标题是 Journal-2025-06-04
- 笔记文件存放目录：我建立了一个 Journal 目录，所有的日记笔记都会创建在该目录下
- 笔记模版的路径：可以使用某个模板笔记来在创建时自动应用模板，比如我有个日记模版是包含一个 TODO 的标题，以及几个待办的 Checkbox，这样就可以方便地创建日记并在其中记录日常任务
## Calendar

日历插件可以和官方的 Daily notes 插件完美结合，日历插件会在右侧展示一个日历视图，上面会显示该月的日期，高亮当前的日期，如果某一天创建了日记笔记， 还会在日期下显示一个小圆点，点击日期可以快速跳转到这天的日记，非常丝滑。日历视图左侧还可以显示当前处于第几周，点击某一周，可以创建一个周记笔记（Weekly Notes）。如果我们觉得每天记日记笔记没啥可写的话，每周创建一个周记笔记来记录这一周的发生的事也是个不错的选择。

![](https://img.lixiaoyu.life/blog-res/2025/06/26e3a6532783d3aeb4f9f2a499fdd1da.png)

创建周记时，我进行了两个配置，让整体体验更上一层楼。一个是配置周记的标题。

![image.png](https://img.lixiaoyu.life/blog-res/2025/06/48e5e7b90437911bee41d27f14e81f34.png)

配置为 `[Weekly]-gggg-[W]ww` ，生成的标题是 `Weekly-2025-W24`， 24 是指今年的第几周。

第二个是配置周记的模板。

![image.png](https://img.lixiaoyu.life/blog-res/2025/06/73433d4b5202dae1386a5e9d9cac9516.png)

我希望模板中自动添加 周一~周日的大纲标题，并且跟上具体的时间，这样能清晰地知道这周是几月几号到几月几号，因为像 W24，W25 的第几周还是不太清晰。

模板的内容如下，用形如 `{{monday:YYYY-MM-DD}}` 的模板标记来生成这周某一天的日期。
```
// WeeklyNote.md

# 周一 {{monday:YYYY-MM-DD}}



# 周二 {{tuesday:YYYY-MM-DD}}



# 周三 {{wednesday:YYYY-MM-DD}}



# 周四 {{thursday:YYYY-MM-DD}}



# 周五 {{friday:YYYY-MM-DD}}



# 周六 {{saturday:YYYY-MM-DD}}



# 周日 {{sunday:YYYY-MM-DD}}
```

创建出来的周记内容是这样的：

![image.png](https://img.lixiaoyu.life/blog-res/2025/06/1c8df69617a77adcd90c12f33a3c51ec.png)


## Kanban

看板插件可以用来管理自己的任务。我们可以添加多个列表，来代表任务的不同状态，然后在列表里添加任务卡片。当一个任务做完时，可以将这个卡片从「进行中」拖到「已完成」。
![](https://img.lixiaoyu.life/blog-res/2025/06/79c78c64ed3515e8fe36fd95b325a20f.png)

## Excalidraw

Excalidraw 是一个非常优秀的白板绘图工具，可以借助它画出很不错的流程图。
我之前在一篇笔记中借助 Excalidraw 画了一个示意图，用来演示方位：
![](https://img.lixiaoyu.life/blog-res/2025/05/52e417f8e22628c21b5ee6e9f9a8ade8.png)

## Pinned Notes

Pinned Notes 插件可以将一个笔记 Pin 在侧边栏里，还可以更改 Icon。Icon 的来源是 https://lucide.dev/ 这个网站。

## Editing Toolbar

这个插件可以在输入框上方显示 Markdown 语法的工具栏，对于一些难记的 Markdown 语法，比如删除线、下划线、高亮、表格等还是挺有用的。

![](https://img.lixiaoyu.life/blog-res/2025/06/13a33f94977408bcdc2979bd53b4912e.png)

## Image auto upload

Image auto upload 插件可以配合 PicGo 将笔记中的图片自动上传到图床中。