---
layout: post
title: 博客图床转移
date: 2019-08-30 12:00
tags: ["Python"]
categories: 技术
cover: https://s2.loli.net/2022/01/25/21FwtmhoiRNZXpS.jpg
---

这几天在回头看自己博客的时候，发现很多图片都加载不出来了。这个情况之前出现过一次，上次是因为七牛云的图床用的一直是测试域名，然后七牛云突然说这个测试域名不能用了（鄙视），然后就只能重新找图床，当时选择了新浪微博图床，想着这下大公司应该比较稳定了吧，没想到现在还是有问题。我查了一下加载不出来的原因，是因为微博开启了防盗链，图片正常在浏览器中是可以正常访问的，但是在博客里就看不到。

关于盗链和防盗链可以看这篇文章：[防盗链](https://www.jianshu.com/p/c02064db8b5b)

#### 第一部分：转移新浪图床中的图片

在网上看了一些解决方法，但都不太适用。只能再次更换图床，这次选择了 [SM.MS](https://sm.ms/)，算是一个比较出名的免费图床了。

转移图床主要分为这么几步：

1. 筛选出博客中所有使用新浪图床的图片链接；
2. 将所有图片下载下来
3. 将图片上传到新的图床，得到新的图片链接
4. 更改博客中所有的图片链接

这四步中，1、2 两步自己手动操作特别麻烦，所以就用 python 写了一个脚本来完成。第 3 步涉及在网站上上传图片，自动化脚本对我来说比较难实现，所以就选择手动操作，因为目前博客里的图片数量还不是很多。第 4 步，其实也可以用正则来自动替换，但是发现在有些博客的封面也用到了图床里的图片（大部分的封面用的都是[一个](http://wufazhuce.com/)的每日一图），而封面和普通图片在文章里的格式不一样，怕自动替换出错，因此也选择手动替换，虽然确实比较麻烦，但是也没办法啊。

来说下 1、2 步中的用 python 写的自动话脚本吧，其实也比较简单。

解决思路如下：

1. 遍历文章目录下的所有 markdown 文件
2. 对其中一个 markdown 文件，遍历其中的每一行内容
3. 如果这一行的内容中有新浪微博图床的域名的话，就将图片 url 提取出来，保存到 list 中
4. 遍历 list，根据 url 去下载图片，统一保存到一个文件夹下，文件夹以文章名字来命名，方便后续步骤的查找

代码如下，也加了一些注释，不难理解：

```python
from urllib.request import urlretrieve
import os

blog_dir = '/users/bd/Workspace/Blog/source/_posts/'
save_dir = '/users/bytedance/Desktop/imgs/'

def downloadAllXinlangImgs(dir_path, file_name):
    urls = []
    # 找出文件中所有新浪的图片链接，添加到列表中
    with open(dir_path + file_name, encoding='latin-1') as file:
        f = file.readlines()
        for line in f:
            # 如果一行的内容中包含新浪域名，则进行url提取
            if line.find('https://ws1.sinaimg.cn/') >= 0:
                # 查找到url的start
                start = line.find('http')
                # 查找到url的end，其实这里不严谨，不能识别后缀为gif、webp等格式的图片
                # 不过新浪图床中图片的后缀好像都是用jpg，所以没有什么关系
                end = line.rfind('g') + 1
                img_url = line[start:end]
                print("img_url:" + img_url)
                urls.append(img_url)

    # 下载列表中保存的所有图片，保存到save_dir中
    i = 1
    # 遍历list
    for url in urls:
        # 提取出文章的不带md后缀的名字
        file_name_without_tail = file_name[:-3]
        print(file_name_without_tail)
        dir = save_dir + file_name_without_tail
        # 如果目录不存在，则创建一个新的目录
        if not os.path.exists(dir):
            os.system(r"mkdir {}".format(dir))
        # 拼接图片的保存路径
        path = dir + "/" + "img" + str(i) + ".png"
        # 比较重要：如果相同名字的图片已经下载过了，就跳过
        # 因为脚本可能会跑好几次，需要避免重复下载相同的图片
        if os.path.exists(path):
            pass
        # 下载图片，并保存到相应路径
        urlretrieve(url, path)
        i = i + 1

if __name__ == '__main__':
    # 列出博客目录下的所有文章，是一个list
    file_list = os.listdir(blog_dir)
    # 遍历list，进行下载保存
    for file in file_list:
        downloadAllXinlangImgs(blog_dir, file)
```

第 3、4 步没什么好说的，以一篇文章（一个保存图片的文件夹）为单位，上传这篇文章的所有图片，拿到新的图片 url，然后根据文件夹的名字找到文章，将文章中旧的图片 url 依次替换就可以了，只是过程比较费时。

至此，转移图床就完成了。

#### 第二部分：替换残留的七牛云图片链接

但是，在之前转移的中途突然发现之前从七牛云转到新浪的时候有部分图片还没有替换，原因是替换时，这部分图片还可以正常访问（真想抽以前的自己一巴掌）。所以接着要把所有这些七牛云的图片链接筛出来，因为这些链接已经彻底不能访问了，所以这里就不能去用代码直接下载。好在我的博客都是使用马克飞象来写，直接保存到印象笔记中，而且这些图片数量不多，可以手动去印象笔记中对应的文章里面下载下来，然后传到新图床，再进行替换。

这些七牛云的图片链接散落在某些文章里，手动筛选是肯定不现实的，所以还是通过脚本来做，这里只需要找到文章里七牛云的图片链接，打印出它所在的文章，为了便于查找，把所在的行数也打印出来。

脚本代码如下：

```python
import os

blog_dir = '/users/bd/Workspace/Blog/source/_posts/'
qiniu_domain = 'http://opgrjw8x2.bkt.clouddn.com'

def listAllQiniuImgUrl(dir_path, file_name):
    # 不带md后缀的文件名
    file_name_without_tail = file_name[:-3]
    with open(dir_path + file_name, encoding='latin-1') as file:
        f = file.readlines()
        line_num = 1
        for line in f:
            # 如果一行的内容中包含七牛云域名，则将文件名，行数等信息打印出来
            if line.find(qiniu_domain) >= 0:
                print("{" + file_name_without_tail + "}line:" + str(line_num) + "---->" + line)
            line_num = line_num + 1

if __name__ == '__main__':
    # 列出博客目录下的所有文章，是一个list
    file_list = os.listdir(blog_dir)
    # 遍历list，查找所有的七牛云图片链接
    for file in file_list:
        listAllQiniuImgUrl(blog_dir, file)
```

有了图片链接所在文章和所在行数的信息，后续工作也比较方便了，又经历了一番繁琐的上传、替换后，终于将残余的七牛云图片链接全部换成了新图床的链接。

有句话说得好：今天流的泪，都是以前傻逼时脑袋进的水。End。