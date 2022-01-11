---
layout: post
title: Git 入门（二）安装 Git
date: 2021-05-12 08:00
tags: ["Git"]
categories: 技术
subtitle: 姗姗来迟的第二篇
---

哈哈，上一篇的 [Git 介绍](https://lixiaoyu.cc/2017/09/08/git-guide-1-introduction/) 已经是 2017 年写的了，现在都已经是 2021 年 5 月，才回过头来继续整理这个系列的笔记，我实在是太过咸鱼了。OK，闲话少叙，我们进入正题，这篇文章就来简单写写如何安装 Git。

![image.png](https://i.loli.net/2021/05/04/6J53RT1Yzt8UrFB.png)

上面这张图是 [Git 官网](https://git-scm.com/downloads) 的截图，点击页面上 Downloads 下方的不同平台（Windows、macOS、Linux/Unix），就可以找到最权威的该平台下 Git 的下载及安装方法。

## 在 Windows 上安装 Git

在Windows上使用 Git，可以从 [Git 官网](https://git-scm.com/downloads) 直接下载安装程序，然后按默认选项安装即可。

安装完成后，在开始菜单中找到 「Git」 -> 「Git Bash」，打开是一个命令行窗口，就说明 Git 安装成功了。

## 在 macOS 上安装 Git

在 mac 上有下面几种方便的安装 Git 的方法：

1. 使用 homebrew，通过 homebrew 命令安装 Git

```
brew install git
```

2. 使用 Xcode 

直接从 AppStore 安装 Xcode，Xcode已经集成了Git，不过默认没有安装，需要运行 Xcode，选择菜单 「Xcode」->「Preferences」，在弹出窗口中找到「Downloads」，选择「Command Line Tools」，点「Install」就可以完成安装了。

3. 下载 dmg 格式的安装包并安装

可以从 [这里](https://sourceforge.net/projects/git-osx-installer/) 下载 dmg 格式的安装包，下载后直接安装即可。

## 在 Linux 和 Unix 上安装 Git

使用 Linux 发行版的首选软件包管理器在 Linux 上安装 Git 是最简单的。

> 以下内容来自 https://git-scm.com/download/linux

**Debian/Ubuntu**

For the latest stable version for your release of Debian/Ubuntu

```
# apt-get install git
```

For Ubuntu, this PPA provides the latest stable upstream Git version

```
# add-apt-repository ppa:git-core/ppa
# apt update; apt install git
```

**Fedora**

```
# yum install git (up to Fedora 21)
# dnf install git (Fedora 22 and later)
```

**Gentoo**

```
# emerge --ask --verbose dev-vcs/git
```

**Arch Linux**

```
# pacman -S git
```

**openSUSE**

```
# zypper install git
```

**Mageia**

```
# urpmi git
```

**Nix/NixOS**

```
# nix-env -i git
```

**FreeBSD**

```
# pkg install git
```

**Solaris 9/10/11 ([OpenCSW](https://www.opencsw.org/))**

```
# pkgutil -i git
```

**Solaris 11 Express**

```
# pkg install developer/versioning/git
```

**OpenBSD**

```
# pkg_add git
```

**Alpine**

```
$ apk add git
```

**Red Hat Enterprise Linux, Oracle Linux, CentOS, Scientific Linux, et al.**

RHEL and derivatives typically ship older versions of git. You can [download a tarball](https://www.kernel.org/pub/software/scm/git/) and build from source, or use a 3rd-party repository such as [the IUS Community Project](https://ius.io/) to obtain a more recent version of git.

**Slitaz**

```
$ tazpkg get-install git
```

## 最后

关于安装 Git 就写到这里，其实贴个官网链接即可，不过为了这一系列的 Git 笔记，还是写一下。下一篇是关于 Git 的一些配置，以及一些基本命令。