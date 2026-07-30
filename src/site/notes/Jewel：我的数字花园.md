---
{"dg-publish":true,"permalink":"/Jewel：我的数字花园/","tags":["gardenEntry"],"noteIcon":"","updated":"2026-07-30T10:29:27.266+08:00","dg-note-properties":{}}
---

![obsidian-second-brain](https://img.lixiaoyu.life/blog-res/2026/07/39df5744c78630a1d5d6d8a23ab6f644.png)

Hi，我是 Owen，这里是我的数字花园，我在这里播种我的想法，希望未来有一天，能够收获满满的创意和成果。

我把它起名为 Jewel（宝石），是希望我写下的文字都是一颗颗宝石，字字珠玑。

---
## 最新 Weekly


```base
views:
  - type: table
    name: 进行中项目
    filters:
      and:
        - file.tags.contains("Project")
        - wip == true
  - type: table
    name: 最近 Weekly
    filters:
      and:
        - file.inFolder("Journal")
        - file.name.startsWith("Weekly")
    sort:
      - property: file.name
        direction: DESC
    limit: 3
  - type: table
    name: WIP Notes
    filters:
      and:
        - wip == true
        - '!file.name.startsWith("Project")'
        - file.folder != "Template"

```


## 进行中项目


```base
views:
  - type: table
    name: 进行中项目
    filters:
      and:
        - file.tags.contains("Project")
        - wip == true
  - type: table
    name: 最近 Weekly
    filters:
      and:
        - file.inFolder("Journal")
        - file.name.startsWith("Weekly")
    sort:
      - property: file.name
        direction: DESC
    limit: 3
  - type: table
    name: WIP Notes
    filters:
      and:
        - wip == true
        - '!file.name.startsWith("Project")'
        - file.folder != "Template"

```


## 没写完的文章


```base
views:
  - type: table
    name: 进行中项目
    filters:
      and:
        - file.tags.contains("Project")
        - wip == true
  - type: table
    name: 最近 Weekly
    filters:
      and:
        - file.inFolder("Journal")
        - file.name.startsWith("Weekly")
    sort:
      - property: file.name
        direction: DESC
    limit: 3
  - type: table
    name: WIP Notes
    filters:
      and:
        - wip == true
        - '!file.name.startsWith("Project")'
        - file.folder != "Template"

```
