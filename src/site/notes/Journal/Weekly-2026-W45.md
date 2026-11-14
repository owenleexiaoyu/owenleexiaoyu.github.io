---
{"dg-publish":true,"permalink":"/Journal/Weekly-2026-W45/","tags":["随笔","WeeklyNotes"],"noteIcon":"","created":"2026-11-02","updated":"2026-11-12T22:41:04.632+08:00","dg-note-properties":{"date":"2026-11-02","tags":["随笔","WeeklyNotes"]}}
---


# 本周任务

- [ ] 把徐泾看房的随笔写完
- [ ] 把海昌公园的游记写完，对应照片视频整理完
- [ ] 写完家庭记账 App 的产品设计

---

# 周一 2026-11-02

昨天发现我的个人网站打不开了，显示 Invalid SSL certificate，error code 526，这好像和我在 [[NightWrite/261028 尝试 Fast Note Sync 同步 Obsidian 笔记\|261028 尝试 Fast Note Sync 同步 Obsidian 笔记]] 里配置 HTTPS 反向代理时，把 Cloudflare 上域名的 SSL 验证从 Full 改为 Full strict 有关。让 AI 帮忙排查了一下，确实是的。Github 上没有配置 Enfore HTTPS，所以被 Cloudflare 拦下来了。 看了下 Github 个人网站 Repo 里 Custom Domain 有个 Enfore HTTPS 选项，是置灰的，不可勾选。解决方式是先把域名里指向 Github IP 的 A 记录代理关掉，然后补齐了官方提供的四个 IP（之前只配了解析到一个 IP）。在 Github 个人网站的 Repo 设置里，重新添加 Custom domain，等待它确认 DNS 解析结果，并签发 Let's Encrypt 证书，这时候就可以勾选 Enfore HTTPS 了，勾选上，再重新访问个人网站地址，就可以打开了。

这周我们的宝宝 12 周啦，周五有 NT 检查，TA 现在和一颗青柠一般大。

# 周二 2026-11-03

把 10 月份账记完了，也补齐了 9 月的记录。

# 周三 2026-11-04

把 KnowledgeCamp 这个 Obsidian 插件的代码保存到了 Github，并完成了记录的文章。

# 周四 2026-11-05

把 [[Inbox/261101 第五次徐泾看房\|261101 第五次徐泾看房]] 的过程写完了，还有和业务聊价格的部分没有写。

# 周五 2026-11-06

[[NightWrite/261106 第二次产检 NT 检查\|261106 第二次产检 NT 检查]]

下午 4 点左右，我和小萌、高磊开车回玉山，明天是妈妈 50 岁生日，回家给妈妈过生日。

# 周末 2026-11-07~08

[[Inbox/261107 妈妈 50 岁生日🎂\|261107 妈妈 50 岁生日🎂]]


