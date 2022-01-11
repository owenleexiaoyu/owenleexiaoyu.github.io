---
layout: post
title: 解决Android Studio不停indexing的问题
tags: ["Android","Android Studio"]
categories: 技术
date: 2018-08-11 12:00
cover: http://image.wufazhuce.com/FhUGpJBjkcod8DHH7OSieT-8ODKz
---

不知怎么回事，某次加载一个新项目的时候，AS就一直会不停地indexing，非常频繁，一秒钟indexing好几下，和抽风了一样，代码也不能正常运行。重启几次也没有用，上网查了一下资料，可以这样解决：

File->Invalidate Caches/Restart

完美。

