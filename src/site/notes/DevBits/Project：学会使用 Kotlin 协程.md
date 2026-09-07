---
{"dg-publish":true,"permalink":"/DevBits/Project：学会使用 Kotlin 协程/","tags":["Project"],"noteIcon":"","created":"2026-07-23","updated":"2026-07-27T10:06:03.945+08:00","dg-note-properties":{"date":"2026-07-23","tags":["Project"]}}
---

## 目标

这个项目的目标是系统学习 Kotlin 协程的使用和一些关键概念。

## 学习资料

主要学习资料：
- [扔物线 Kotlin 协程实战视频教程](https://www.bilibili.com/cheese/play/ss23102?query_from=0&search_id=11653036323236179272&search_query=%E6%89%94%E7%89%A9%E7%BA%BF+Kotlin+%E5%8D%8F%E7%A8%8B&csource=common_hpsearch_null_null&spm_id_from=333.337.search-card.all.click)，包含以下 5 个部分
	1. 协程基础和关键知识
	2. 结构化并发
	3. CoroutineScope/CoroutineContext
	4. Channel 和 Flow
	5. 协作、互斥锁和共享变量
这次会学 1，2，3，5 这几部分，第 4 部分 Flow 的知识另起一个项目来学习。

学习过程中遇到不明白的会问 AI。

## 时间线

要求：在 2026 年 7 月内完成。

## 任务拆分

> 截至 7/23，3.3 从挂起函数里获取 CoroutineContext 已学完，还剩 9 节课没学

7/23
- [x] 3.4 coroutineScope() 和 supervisorScope()
- [x] 3.5 再谈 withContext()
- [x] 3.6 CoroutineName
7/24
- [x] 3.7 CoroutineContext 的加减和 get()
- [x] 3.8 自定义 CoroutineContext
7/25
- [x] 5.1 协程间的协作和等待
- [x] 5.2 select()
7/26
- [x] 5.3 互斥锁和共享变量
- [x] 5.4 ThreadLocal

## 学习笔记

[[DevBits/扔物线 Kotlin 协程实战笔记（1）协程基础与关键知识\|扔物线 Kotlin 协程实战笔记（1）协程基础与关键知识]]
[[DevBits/扔物线 Kotlin 协程实战笔记（2）结构化并发\|扔物线 Kotlin 协程实战笔记（2）结构化并发]]
[[DevBits/扔物线 Kotlin 协程实战笔记（3）CoroutineScope 和 CoroutineContext\|扔物线 Kotlin 协程实战笔记（3）CoroutineScope 和 CoroutineContext]]
[[DevBits/扔物线 Kotlin 协程实战笔记（5）协作、互斥锁和共享变量\|扔物线 Kotlin 协程实战笔记（5）协作、互斥锁和共享变量]]
