---
{"dg-publish":true,"permalink":"/HaiShu/Kotlin/Kotlin Conf 2024/","tags":["Kotlin"],"noteIcon":"","created":"2025-06-08T10:17:52.954+08:00","updated":"2025-06-08T11:12:03.524+08:00"}
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

![](https://img.lixiaoyu.life/blog-res/2025/06/f1c39b2b8b0845b659fb3751bf134d7b.png)

+ 借助于新的编译器，未来可以快速支持更多新的语言特性，为了让迁移更加丝滑，2.0 版本没有引入新的功能，但修复了很多长期存在的旧问题
+ 更加可靠、精确、更理解写的代码
+ 显著的性能提升，编译速度是之前的  2 倍（减少 50%）

![](https://img.lixiaoyu.life/blog-res/2025/06/5e2c3fc76de1214f203398c5c70dd757.png)

+ 使用 K2 的 IntelliJ Kotlin 插件，代码高亮的速度比之前快了 1.8 倍

![](https://img.lixiaoyu.life/blog-res/2025/06/cb75fc9ab40727e9821081354e9f059e.png)

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

![](https://img.lixiaoyu.life/blog-res/2025/06/acfa4312f97e0b91c216c5c8dfd3e6a1.png)

+ Android Studio 对 Kotlin 2.0 的支持
    - Android Studio Koala 版本可以开启 K2 Kotlin 模式
+ Compose 即将到来的一些新特性
    - HTML Support
    - Drag and Drop
    - Lazy List item navigation
    - Share element transitions
+ 性能提升

![](https://img.lixiaoyu.life/blog-res/2025/06/2021e909625ef84592864570ced72ead.png)

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

![](https://img.lixiaoyu.life/blog-res/2025/06/5b131f5ccefd09c62c25ecc096e4e27c.png)

+ 一些使用 KMP 的公司/团队的反馈（Showcase）
+ KMP 已经稳定，可以在生产环境中使用（去年宣布），并且还在演进，介绍了一些新的进展
    - Integration：Direct Kotlin-to-Swift export

![](https://img.lixiaoyu.life/blog-res/2025/06/7f6e4a0ef5150ccd53acec93895b0801.png)

    - Tooling：Fleet，KMP 的 All in one IDE
        * 项目的前置检查，确保开发环境满足条件
        * 完全支持 Xcode 项目和 Swift 语言：代码跳转、重命名等，甚至修改 Kotlin 的类名、变量名，Swift 也会直接生效
        * 可以让项目运行在所有的目标平台
        * 在所有平台上 Debug，可以在 Swift 和 Kotlin 代码间断点（Step in）
        * Compose 预览
        * JetBrains AI Assistant：解释代码，生成代码等
+ Amper: KMP 项目新的构建工具（还在早期阶段）

![](https://img.lixiaoyu.life/blog-res/2025/06/7c277e230f0090ed9982e2cc311441e3.png)

![](https://img.lixiaoyu.life/blog-res/2025/06/b91704346cf142b9b7951ed25c2721de.png)

+ Compose Multiplatform
    - iOS 在 alpha release 后有很多进展

![](https://img.lixiaoyu.life/blog-res/2025/06/7e7880fda8e2285f8036a212f3699365.png)

    - 新的通用 API
        * Navigation

![](https://img.lixiaoyu.life/blog-res/2025/06/8e04d16b65b5fb95c4d4cbd20dd72e27.png)

        * Lifecycle ViewModel 

![](https://img.lixiaoyu.life/blog-res/2025/06/ce7830acefaa4d3fda92e7bc4bbdaa96.png)

        * 资源 API

![](https://img.lixiaoyu.life/blog-res/2025/06/c2961366b549f147e96756d19c00b597.png)

    - Compose Multiplatform 在 iOS 平台上进入 Beta 阶段（主要的 API 固定，更容易迁移）
    - Compose Multiplatform for Web，将你的 App 带到浏览器中
        * 基于 Kotlin/Wasm，在所有现代浏览器上可用

![](https://img.lixiaoyu.life/blog-res/2025/06/6c733a488d5e9329487e6dfcd8a1a764.png)

        * Compose Multiplatform for Web 进入 Alpha 阶段（核心 API 可用；基于 Kotlin/Wasm；适配 Web）


Michail Zarecenskij: Lead language designer, JetBrains

介绍即将到来的 Kotlin 新语言特性。

+ Guards

![](https://img.lixiaoyu.life/blog-res/2025/06/7d9cb8990749dca25ad76962fd5b1975.png)

![](https://img.lixiaoyu.life/blog-res/2025/06/583b77c903123cf82c8c3c9901c38b47.png)

![](https://img.lixiaoyu.life/blog-res/2025/06/2e9932d18c5c13972327bb5a896f3f04.png)

+ $-escaping problem

![](https://img.lixiaoyu.life/blog-res/2025/06/17d1e2bc52f1219e5eae6417c1c9e440.png)

![](https://img.lixiaoyu.life/blog-res/2025/06/68507a9a5b1ea5f96c9c1829c0756938.png)

![](https://img.lixiaoyu.life/blog-res/2025/06/a5eb0adacd1f774fa19db611f1e0f53e.png)

![](https://img.lixiaoyu.life/blog-res/2025/06/9be53a7c60a0e2e2891878182799c819.png)

![](https://img.lixiaoyu.life/blog-res/2025/06/d05044f03424ff1a6941f164d3a22e0f.png)

+ Non-local break/continue

![](https://img.lixiaoyu.life/blog-res/2025/06/55aa7a741828f37f987b6d41e0243dbc.png)

![](https://img.lixiaoyu.life/blog-res/2025/06/7d83a6bc9016a2c8f3b52e1589730558.png)
 
![](https://img.lixiaoyu.life/blog-res/2025/06/29d8656f1687b82fcb78ec6e41193fcc.png)

+ Context receivers parameters

![](https://img.lixiaoyu.life/blog-res/2025/06/b814b87216ebc0acd53a3aacdbf789bc.png)

![](https://img.lixiaoyu.life/blog-res/2025/06/0403e33c7876819456256df399142a94.png)

![](https://img.lixiaoyu.life/blog-res/2025/06/6665cd58f77e348277c9ceafc60cfdd1.png)

Vsevolod Tolstopyatov: Group Lead, Kotlin Core Ecosystem

介绍 Kotlin 的生态。

![](https://img.lixiaoyu.life/blog-res/2025/06/9a28ff608c552abf19e7a33aed2d5d10.png)

![](https://img.lixiaoyu.life/blog-res/2025/06/088f76b86bdb4dcc09b4851bbea17f8d.png)

![](https://img.lixiaoyu.life/blog-res/2025/06/4262479d44bf533af1fa958a11ae9bac.png)

Julie Gunderson: Senior Developer, AWSCloud

介绍 AWS Cloud 中的 Kotlin SDK


Svetlana Isakova: Developer Advocate, JetBrains

介绍 Kotlin & AI，JetBrains AI Assistant
+ 自动代码补全
+ 解释代码
+ 根据自然语言生成代码
+ 生成注释和文档

![](https://img.lixiaoyu.life/blog-res/2025/06/d8b5a7ce85f4b55a47d95cb008bf7a3c.png)

Kotlin Language Model：自研的大模型，和其他大模型的对比。

