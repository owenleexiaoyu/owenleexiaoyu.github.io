---
{"dg-publish":true,"permalink":"/HaiShu/Kotlin/Kotlin Conf 2024/","tags":["Kotlin"],"noteIcon":"","created":"2025-06-08T10:17:52.954+08:00","updated":"2025-06-08T10:37:23.121+08:00"}
---


# Keynote

> [YouTube KotlinConf'24 - Keynote](https://www.youtube.com/watch?v=Ar73Axsz2YA)
>
> [Bilibili KotlinConf'24 主题演讲](https://www.bilibili.com/video/BV18D421G7k2/?spm_id_from=333.337.search-card.all.click&vd_source=581e0a7f58fafc192abc773bb2e5e1ed)


Kotlin 语言的吉祥物 Kodee 出场。

Hadi Hariri: VP of Developer Advocacy, JetBrains

开场，闲聊，介绍 KotlinConf 的流程。

Egor Tolstoy: Kotlin Project Lead, JetBrains

官宣 Kotlin 2.0 正式发布

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716691473882-672aec82-4972-4d54-95f0-a277cb0eff05.png)

+ 借助于新的编译器，未来可以快速支持更多新的语言特性，为了让迁移更加丝滑，2.0 版本没有引入新的功能，但修复了很多长期存在的旧问题
+ 更加可靠、精确、更理解写的代码
+ 显著的性能提升，编译速度是之前的  2 倍（减少 50%）

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716691827334-29887a18-3a13-4e5c-b11b-f3f3d8de8550.png)

+ 使用 K2 的 IntelliJ Kotlin 插件，代码高亮的速度比之前快了 1.8 倍

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716692045370-02e38a9a-5110-4174-b907-f853f76abd36.png)

+ Kotlin 2.0 在 1 千万行代码上测试过，早期版本发布后， 是质量最好的版本，迁移非常安全。

Eve Mattaey: Android Developer Experience, Meta

介绍在 Meta 中使用 Kotlin 和 Kotlin 2.0 的历程，打个酱油，没啥干货。


Jeffrey van Gogh: Director of Engineering, Android Developer Experience, Google

介绍 Google 和 Android 在 Kotlin 上的投资

+ Google 和 JetBrains Kotlin 团队紧密合作，在 Kotlin 2.0 编译器上做了很多贡献，同时让 Android 适配 Kotlin 2.0
    - Android Lint
    - Parcelize
    - Kotlin Symbol Processing
    - Compose Compiler Plugin
+ Compose Compiler 之前版本和 Kotlin 版本不对齐，现在 Compose Compiler 迁移到了 Kotlin 仓库中，版本会保持一致，不再需要兼容的版本映射。

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716694287284-d470eaf8-3c90-4749-aa4c-81214bb15b6a.png)

+ Android Studio 对 Kotlin 2.0 的支持
    - Android Studio Koala 版本可以开启 K2 Kotlin 模式
+ Compose 即将到来的一些新特性
    - HTML Support
    - Drag and Drop
    - Lazy List item navigation
    - Share element transitions
+ 性能提升

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716694641795-b53a9fdb-d52c-4a5b-9ad5-4d8208ab711b.png)

+ Google workspace（谷歌文档）使用 KMP 在 Android、iOS、Web 上共享逻辑代码，进展非常好，计划在更多的产品上使用 KMP
+ Jetpack 库支持 KMP
    - Stable：
        * Annotations
        * Collections
        * DataStore
    - Alpha：
        * Lifecycles
        * ViewModels
        * 【New】 Room，支持 Android 和 iOS 操作 SQLite
+ 在 2024 年的 Google/IO 上，Android 正式宣布支持 KMP。

Ekaterina Petrova：Product Marketing Manager, JetBrains

Sebastian Aigner: Developer Advocate, JetBrains

介绍 KMP 的最新进展

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716462751767-dd5eb273-1205-4ed9-8b14-9a40399c59fa.png)

+ 一些使用 KMP 的公司/团队的反馈（Showcase）
+ KMP 已经稳定，可以在生产环境中使用（去年宣布），并且还在演进，介绍了一些新的进展
    - Integration：Direct Kotlin-to-Swift export

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716713959969-6b124a3f-4788-48e3-9670-270d620a6f1b.png)

    - Tooling：Fleet，KMP 的 All in one IDE
        * 项目的前置检查，确保开发环境满足条件
        * 完全支持 Xcode 项目和 Swift 语言：代码跳转、重命名等，甚至修改 Kotlin 的类名、变量名，Swift 也会直接生效
        * 可以让项目运行在所有的目标平台
        * 在所有平台上 Debug，可以在 Swift 和 Kotlin 代码间断点（Step in）
        * Compose 预览
        * JetBrains AI Assistant：解释代码，生成代码等
+ Amper: KMP 项目新的构建工具（还在早期阶段）

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716714438896-401dad84-f3cc-4ba0-8159-c93f549f5990.png)

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716714657969-0a84bd88-6420-4497-aa62-c163e40961bc.png)

+ Compose Multiplatform
    - iOS 在 alpha release 后有很多进展

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716714970463-2c766a1e-70cf-4b74-a209-c5d3a0ec985c.png)

    - 新的通用 API
        * Navigation

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716714882027-9add72fc-3841-44cd-8359-64e8eaa47fb9.png)

        * Lifecycle ViewModel 

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716714843352-89ce587b-fbf7-4d27-894c-88e0de54b7e5.png)

        * 资源 API

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716714802659-fad146a2-080d-41c6-88a0-cb17bbce051a.png)

    - Compose Multiplatform 在 iOS 平台上进入 Beta 阶段（主要的 API 固定，更容易迁移）
    - Compose Multiplatform for Web，将你的 App 带到浏览器中
        * 基于 Kotlin/Wasm，在所有现代浏览器上可用

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716715253764-9dc08f9c-c703-46f9-ae8f-ad5ad8c4ddc8.png)

        * Compose Multiplatform for Web 进入 Alpha 阶段（核心 API 可用；基于 Kotlin/Wasm；适配 Web）


Michail Zarecenskij: Lead language designer, JetBrains

介绍即将到来的 Kotlin 新语言特性。

+ Guards

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716715474970-6c0a7bfc-971a-4a0e-80d9-8bc9adaf7fba.png)

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716715516966-b92b696b-513f-44be-aabd-29840892234b.png)

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716715549216-9b797d53-6bc0-40c7-bfe0-8dafca25a3da.png)

+ $-escaping problem

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716715596057-9a571cf5-7a47-4bb9-9a09-728d8f00824d.png)

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716715610736-b420b1f7-a1f1-48c1-81d5-ebd3cd0f0e69.png)

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716715626780-f6fcbe6d-39fc-46b2-b367-c558517220d0.png)

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716715656562-62f98d65-5031-48e7-8a68-6bc85daabc36.png)

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716715675029-c438ff5d-f7ec-4584-9de5-db55f7566095.png)

+ Non-local break/continue

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716715767885-2337172d-2696-460a-be3d-e04b33141824.png)

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716715795305-60dd5e27-a515-450d-9524-e539c8d237b0.png)
 
![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716715818300-64c3e25d-6ad7-4094-aaf2-e33730f5d024.png)

+ Context receivers parameters

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716715938117-aa133fab-90a5-40ba-b7d9-84c56777ffaa.png)

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716715966004-2785855e-30b6-498d-9a01-6775ed1a1837.png)

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716716015334-edf6ffaa-5a34-445a-a252-380b6b483fe3.png)

Vsevolod Tolstopyatov: Group Lead, Kotlin Core Ecosystem

介绍 Kotlin 的生态。

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716716142043-af96778a-a17d-4367-94f9-99044539a5d6.png)

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716716237221-d7565956-3f0e-4cf4-a474-d5520c08a23e.png)

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716716255403-fb344da8-0239-43e1-87d7-00ec4ab05a1c.png)

Julie Gunderson: Senior Developer, AWSCloud

介绍 AWS Cloud 中的 Kotlin SDK


Svetlana Isakova: Developer Advocate, JetBrains

介绍 Kotlin & AI，JetBrains AI Assistant
+ 自动代码补全
+ 解释代码
+ 根据自然语言生成代码
+ 生成注释和文档

![](https://cdn.nlark.com/yuque/0/2024/png/26123573/1716716592232-4ed86023-c904-4533-a1be-06dd939f1a9f.png)

Kotlin Language Model：自研的大模型，和其他大模型的对比。

