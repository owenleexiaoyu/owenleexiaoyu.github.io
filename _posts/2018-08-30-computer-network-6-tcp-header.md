---
layout: post
title: 计算机网络面试（6）TCP 首部
tags: ["计算机网络"]
categories: 笔试面试
date: 2018-08-30 15:07
cover: https://s2.loli.net/2022/01/24/YytSaMEqh2fR91W.jpg
---

TCP 的全部功能都体现在它首部中各字段的作用，因此，只有弄清TCP首部各字段的作用才能掌握 TCP 的工作原理。

TCP 报文段首部的前 20 字节是固定的，后面有 4n 字节是根据需要而增加的，因此 TCP 首部的最小长度是 20 字节。

![img1.png](https://i.loli.net/2019/08/29/sT2qc9CENYbGaJr.jpg)

**源端口和目的端口（Source Port、Destination Port）：**

分别占 2 个字节，表示源端口号和目的端口号；用于区别主机中的不同进程，而 IP 地址是用来区分不同的主机的，源端口号和目的端口号配合上 IP 首部中的源 IP 地址和目的 IP 地址就能唯一的确定一个 TCP 连接；

**序号（seq，Sequence Number）：**

占 4 字节，用来标识从 TCP 发送端向 TCP 接收端发送的数据字节流，它表示在这个报文段中的的第一个数据字节在数据流中的序号；主要用来解决**网络报乱序**的问题。

**确认号（ACKnum，Acknowledgment Number）**：

占 4 字节，包含发送确认的一端所期望收到的下一个序号，因此，确认序号应当是上次已成功收到数据字节序号加 1。不过，只有当控制位中的 ACK 标志（下面介绍）为 1 时该确认序列号的字段才有效。主要用来解决**不丢包**的问题。

**数据偏移（Offset）**：

占 4 位（bit），指出 TCP 报文段的数据起始处距离 TCP 报文段的起始处有多远，实际上是指出了 TCP 报文段的首部长度。由于首部中还有长度不确定的选项字段，因此数据偏移是必要的。但应注意，「数据偏移」的单位是 32 位字（即一个基本单位是 4 字节），4 位 二进制能表示的最大十进制数字是 15，因此数据偏移的最大值是 4×15=60 字节，这也是 TCP 首部的最大长度。

下面是 6 个控制位，用来说明这个报文段的性质。依次为 URG，ACK，PSH，RST，SYN，FIN，它们中的多个可同时被设置为 1，每个控制位的含义如下：

> - **URG**（urgent，紧急）：此标志表示TCP包的紧急指针域（后面马上就要说到）有效，用来保证 TCP 连接不被中断，并且督促中间层设备要尽快处理这些数据；

> - **ACK**（acknowledgement，确认）：仅当 ACK=1 时，确认号字段才有效，当 ACK=0 时，确认号字段无效。TCP 规定，在连接建立后所有传送的报文段都必须把 ACK 置为 1。

> - **PSH**（push，推送）：这个标志位表示 Push 操作。所谓 Push 操作就是指在数据包到达接收端以后，立即传送给应用程序，而不是在缓冲区中排队；

> - **RST**（reset，复位）：这个标志表示连接复位请求。用来复位那些产生错误的连接，也被用来拒绝错误和非法的数据包；

> - **SYN**（synchronization，同步）：表示同步序号，用来建立连接。SYN 标志位和 ACK 标志位搭配使用，当连接请求的时候，SYN=1，ACK=0；连接被响应的时候，SYN=1，ACK=1；SYN 置为 1 就表示这是一个连接请求或连接接受报文。

> - **FIN**（finish，终止）： 用来释放一个连接。当 FIN 为 1 时，表明此报文发送方的数据已发送完毕，并要求释放运输连接。

**窗口（Window）**：

占 2 字节，也就是有名的滑动窗口，用来进行流量控制。后面文章中会介绍。

**校验和**：

占 2 字节，校验和字段检验的范围包括首部和数据这两个部分。和 UDP 一样，在计算校验和时要在 TCP 报文段的前面加上 12 字节的伪首部。

**紧急指针**：

占 2 字节，紧急指针仅在 URG=1 时才有意义，它指出本报文段中紧急数据的字节数（紧急数据结束后就是普通数据）。因此，紧急指针指出了紧急数据的末尾在报文段中的位置。

**选项**：

长度可变，最长可达 40 字节。当没有使用选项时，TCP 首部的长度为 20 字节。
