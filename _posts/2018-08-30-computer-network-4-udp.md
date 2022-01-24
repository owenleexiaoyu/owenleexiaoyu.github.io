---
layout: post
title: 计算机网络面试（4）UDP 协议
tags: ["计算机网络"]
categories: 笔试面试
date: 2018-08-30 13:07
---
#### UDP 概述

用户数据报协议 UDP 只在 IP 协议的服务上增加了很少的功能，就是复用分用和差错检测。

#### UDP 特点

**1. 无连接**

发送数据之前不需要建立连接，发送结束后也无需关闭，因此减少了开销和发送数据之前的时延。

**2. 尽最大努力交付**

即不保证可靠交付，主机不需要维持复杂的连接状态表。

**3. 面向报文**

对应用层的报文，直接添加首部后就向下交付给 IP 层，既不合并，也不拆分，而是会保留这些报文的边界。因此，应用层需要控制报文的长度，保证 IP 层的效率。

![img1](https://i.loli.net/2019/08/29/FSftAMuJVCOnPrl.jpg)

**4. 没有拥塞控制**

网络出现拥塞时，不会使源主机的发送速率降低，对于某些实时应用来说非常重要。（很多实时应用：IP 电话、视频会议等，要求源主机以恒定的速率发送数据，并且允许在网络拥塞时丢失一些数据，却不允许数据有太大的时延）

**5. 支持一对一、一对多、多对一、多对多的交互通信**

**6. 首部开销小**

UDP 首部只有 8 字节，比 TCP 的 20 字节要短。

#### UDP 的首部格式

UDP 有两个字段：数据字段和首部字段。首部字段很简单，分为 4 个部分，每个部分 2 个字节，一共只有 8 个字节。

1. **源端口**：源端口号，在需要对方回信时选用。
2. **目的端口**：目的端口号，在终点交付报文时必须使用。
3. **长度**：UDP 用户数据报的长度，最小值是 8（仅有首部）
4. **检验和**：检测 UDP 用户数据报在传输中是否有错，有错就丢弃。

![img2.png](https://i.loli.net/2019/08/29/VR8oxZCTqDaJKOw.jpg)

当接收方收到 UDP 用户数据报时，根据首部的目的端口，把 UDP 用户数据报通过相应端口，交给应用进程。

![img3.png](https://i.loli.net/2019/08/29/o3l7bcLC5H4xXNI.jpg)

如果接收方 UDP 发现收到的报文目的端口不正确（即不存在对应于该端口号的应用进程），就丢弃该报文，并由 IMCP 协议发送「端口不可达」的差错报文给发送方。

#### 计算校验和

UDP 计算校验和时，要在 UDP 用户数据报前增加 12 字节的伪首部，形成一个临时的 UDP 用户数据报，校验和就是根据这个临时的 UDP 用户数据报来计算的。伪首部既不疾步向下传送也不向上递交，仅仅是为了计算校验和。